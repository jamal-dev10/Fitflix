import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  name: string;
  memberId: string;
  membershipPlan: string;
  membershipExpiry: string;
  fitnessGoal?: string;
  targetCalories?: number;
  role: 'member' | 'coach' | 'admin';
  createdAt: string;
}

export interface FirestoreWorkout {
  id: string;
  userId: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  type: 'strength' | 'hiit' | 'cardio' | 'mobility' | 'endurance' | 'powerlifting' | 'boxing' | 'recovery';
  title: string;
  duration: number; // minutes
  calories?: number;
  rpe?: number; // 1-10
  notes?: string;
  createdAt: string;
}

export interface FirestoreGoal {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  category: 'weight_loss' | 'workout_frequency' | 'muscle_gain' | 'nutrition' | 'strength' | 'endurance';
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
}

export interface FirestoreReservation {
  id: string;
  userId: string;
  userEmail: string;
  classId: string;
  classTitle: string;
  day: string;
  time: string;
  trainer: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface FirestoreConsultation {
  id: string;
  userId: string;
  userEmail: string;
  name: string;
  trainerName: string;
  programInterest: string;
  date: string;
  timeSlot: string;
  referenceCode: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface FirestoreNotificationRecord {
  id: string;
  userId: string;
  userEmail: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  goalsCount: number;
  status: 'delivered' | 'queued' | 'failed';
}

// -------------------------------------------------------------
// USER PROFILE OPERATIONS
// -------------------------------------------------------------
export async function getFirestoreUserProfile(userId: string): Promise<FirestoreUserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as FirestoreUserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function upsertFirestoreUserProfile(profile: FirestoreUserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    const docRef = doc(db, 'users', profile.uid);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// -------------------------------------------------------------
// WORKOUT SESSIONS
// -------------------------------------------------------------
export async function getFirestoreWorkouts(userId: string): Promise<FirestoreWorkout[]> {
  const path = 'workouts';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreWorkout);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveFirestoreWorkout(workout: FirestoreWorkout): Promise<void> {
  const path = `workouts/${workout.id}`;
  try {
    await setDoc(doc(db, 'workouts', workout.id), workout);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteFirestoreWorkout(workoutId: string): Promise<void> {
  const path = `workouts/${workoutId}`;
  try {
    await deleteDoc(doc(db, 'workouts', workoutId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// FITNESS GOALS
// -------------------------------------------------------------
export async function getFirestoreGoals(userId: string): Promise<FirestoreGoal[]> {
  const path = 'goals';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreGoal);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveFirestoreGoal(goal: FirestoreGoal): Promise<void> {
  const path = `goals/${goal.id}`;
  try {
    await setDoc(doc(db, 'goals', goal.id), goal);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteFirestoreGoal(goalId: string): Promise<void> {
  const path = `goals/${goalId}`;
  try {
    await deleteDoc(doc(db, 'goals', goalId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// CLASS RESERVATIONS
// -------------------------------------------------------------
export async function getFirestoreReservations(userId: string): Promise<FirestoreReservation[]> {
  const path = 'reservations';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreReservation);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveFirestoreReservation(reservation: FirestoreReservation): Promise<void> {
  const path = `reservations/${reservation.id}`;
  try {
    await setDoc(doc(db, 'reservations', reservation.id), reservation);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// -------------------------------------------------------------
// COACH CONSULTATIONS
// -------------------------------------------------------------
export async function getFirestoreConsultations(userId: string): Promise<FirestoreConsultation[]> {
  const path = 'consultations';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreConsultation);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveFirestoreConsultation(consultation: FirestoreConsultation): Promise<void> {
  const path = `consultations/${consultation.id}`;
  try {
    await setDoc(doc(db, 'consultations', consultation.id), consultation);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// -------------------------------------------------------------
// NOTIFICATIONS
// -------------------------------------------------------------
export async function getFirestoreNotifications(userId: string): Promise<FirestoreNotificationRecord[]> {
  const path = 'notifications';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreNotificationRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveFirestoreNotification(record: FirestoreNotificationRecord): Promise<void> {
  const path = `notifications/${record.id}`;
  try {
    await setDoc(doc(db, 'notifications', record.id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
