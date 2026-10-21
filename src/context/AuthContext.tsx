import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import {
  getFirestoreUserProfile,
  upsertFirestoreUserProfile,
  FirestoreUserProfile,
} from '../lib/firestoreService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  memberId: string;
  membershipPlan: string;
  membershipExpiry: string;
  phone?: string;
  fitnessGoal?: string;
  targetCalories?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string, goal?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserMembership: (planName: string, isAnnual: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fitflex_token'));
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const profile = await getFirestoreUserProfile(fbUser.uid);
          if (profile) {
            setUser({
              id: profile.uid,
              name: profile.name,
              email: profile.email,
              role: profile.role === 'coach' ? 'trainer' : profile.role,
              memberId: profile.memberId,
              membershipPlan: profile.membershipPlan,
              membershipExpiry: profile.membershipExpiry,
              fitnessGoal: profile.fitnessGoal,
              targetCalories: profile.targetCalories,
            });
            // Also store a session token indicator
            const tokenStr = await fbUser.getIdToken();
            setToken(tokenStr);
            localStorage.setItem('fitflex_token', tokenStr);
          }
        } catch (err) {
          console.error('Error fetching Firestore user profile on auth change:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Validate existing local token on mount if not logged in via Firebase
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('fitflex_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // If user is already resolved via Firebase, skip backend fetch
      if (auth.currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid
          localStorage.removeItem('fitflex_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to verify token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  // Login via Google with Firebase
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      let profile = await getFirestoreUserProfile(fbUser.uid);
      if (!profile) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        profile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'FitFlex Athlete',
          memberId: `FF-${fbUser.uid.substring(0, 6).toUpperCase()}`,
          membershipPlan: 'Pro Member',
          membershipExpiry: expiryDate.toISOString().split('T')[0],
          fitnessGoal: 'Hypertrophy & Performance',
          targetCalories: 2600,
          role: 'member',
          createdAt: new Date().toISOString(),
        };

        await upsertFirestoreUserProfile(profile);
      }

      const userProfile: UserProfile = {
        id: profile.uid,
        name: profile.name,
        email: profile.email,
        role: profile.role === 'coach' ? 'trainer' : profile.role,
        memberId: profile.memberId,
        membershipPlan: profile.membershipPlan,
        membershipExpiry: profile.membershipExpiry,
        fitnessGoal: profile.fitnessGoal,
        targetCalories: profile.targetCalories,
      };

      setUser(userProfile);
      setToken(idToken);
      localStorage.setItem('fitflex_token', idToken);
      return { success: true };
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Google Sign-In failed. Please try again.',
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      localStorage.setItem('fitflex_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred while connecting to server.' };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string, goal?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      localStorage.setItem('fitflex_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred while connecting to server.' };
    }
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
    localStorage.removeItem('fitflex_token');
    setToken(null);
    setUser(null);
    setFirebaseUser(null);
  };

  const updateUserMembership = async (planName: string, isAnnual: boolean) => {
    try {
      const res = await fetch('/api/membership/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          planName,
          isAnnual,
          memberName: user?.name || 'Guest Member',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (user) {
          const updated = {
            ...user,
            membershipPlan: data.membershipPlan,
            membershipExpiry: data.membershipExpiry,
          };
          setUser(updated);

          // If logged into Firebase, also sync to Firestore
          if (auth.currentUser) {
            upsertFirestoreUserProfile({
              uid: user.id,
              email: user.email,
              name: user.name,
              memberId: user.memberId,
              membershipPlan: data.membershipPlan,
              membershipExpiry: data.membershipExpiry,
              fitnessGoal: user.fitnessGoal,
              targetCalories: user.targetCalories,
              role: user.role === 'trainer' ? 'coach' : user.role,
              createdAt: new Date().toISOString(),
            }).catch(console.error);
          }
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        firebaseUser,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUserMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
