import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// In-Memory Database
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'member' | 'trainer' | 'admin';
  memberId: string;
  membershipPlan: string;
  membershipExpiry: string;
  phone?: string;
  fitnessGoal?: string;
  targetCalories?: number;
}

interface Reservation {
  id: string;
  userEmail: string;
  classId: string;
  classTitle: string;
  day: string;
  time: string;
  trainer: string;
  reservedAt: string;
}

interface Consultation {
  id: string;
  userEmail: string;
  name: string;
  phone?: string;
  trainerName?: string;
  programInterest: string;
  date: string;
  timeSlot: string;
  notes?: string;
  referenceCode: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program: string;
  message: string;
  createdAt: string;
}

interface ServerProgressLog {
  id: string;
  userEmail: string;
  date: string;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  createdAt: string;
}

interface ServerFitnessGoal {
  id: string;
  userEmail: string;
  title: string;
  category: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'workout_frequency' | 'nutrition';
  currentValue: number;
  targetValue: number;
  startValue: number;
  unit: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
}

interface ServerWorkoutSession {
  id: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  title: string;
  discipline: 'strength' | 'cardio' | 'hiit' | 'yoga' | 'recovery' | 'other';
  durationMinutes: number;
  exercisesCompleted?: string[];
  intensityRpe: number; // 1-10
  caloriesBurned?: number;
  notes?: string;
  createdAt: string;
}

interface ServerNotificationRecord {
  id: string;
  userEmail: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  stats: {
    totalWorkouts: number;
    totalMinutes: number;
    totalCalories: number;
    consistencyPct: number;
  };
  goalsCount: number;
  status: 'delivered' | 'sent';
}

const emailNotifications: ServerNotificationRecord[] = [];



const users: User[] = [
  {
    id: 'u1',
    name: 'Alex Walker',
    email: 'demo@fitflex.com',
    passwordHash: 'fitflex123',
    role: 'member',
    memberId: 'FF-884920',
    membershipPlan: 'Black Card Elite 24/7',
    membershipExpiry: 'DEC 2027',
    phone: '+1 (555) 234-5678',
    fitnessGoal: 'Hypertrophy & Strength',
    targetCalories: 2750,
  },
  {
    id: 'u2',
    name: 'Marcus Vance',
    email: 'marcus@fitflex.com',
    passwordHash: 'coach123',
    role: 'trainer',
    memberId: 'FF-COACH-01',
    membershipPlan: 'Master Coach All-Access',
    membershipExpiry: 'LIFETIME',
    phone: '+1 (555) 998-1122',
  },
];

const reservations: Reservation[] = [
  {
    id: 'res-1',
    userEmail: 'demo@fitflex.com',
    classId: 'c1',
    classTitle: 'Dawn Strength & Barbell',
    day: 'Monday',
    time: '07:00 AM',
    trainer: 'Marcus Vance',
    reservedAt: new Date().toISOString(),
  },
  {
    id: 'res-2',
    userEmail: 'demo@fitflex.com',
    classId: 'c7',
    classTitle: 'High-Lactate Metcon',
    day: 'Wednesday',
    time: '06:00 PM',
    trainer: 'Zack Taylor',
    reservedAt: new Date().toISOString(),
  },
];

const consultations: Consultation[] = [
  {
    id: 'con-1',
    userEmail: 'demo@fitflex.com',
    name: 'Alex Walker',
    phone: '+1 (555) 234-5678',
    trainerName: 'Marcus Vance',
    programInterest: 'Strength Training',
    date: '2026-10-25',
    timeSlot: '10:00 AM',
    notes: 'Looking to break through squat plateau.',
    referenceCode: 'FF-948201',
    createdAt: new Date().toISOString(),
  },
];

const contactMessages: ContactMessage[] = [];

const progressLogs: ServerProgressLog[] = [
  {
    id: 'prog-1',
    userEmail: 'demo@fitflex.com',
    date: '2026-08-15',
    weight: 86.4,
    bodyFat: 21.8,
    chest: 104,
    waist: 92.5,
    arms: 37.0,
    thighs: 60.5,
    notes: 'Initial FitFlex baseline weigh-in with Coach Marcus.',
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'prog-2',
    userEmail: 'demo@fitflex.com',
    date: '2026-08-29',
    weight: 85.1,
    bodyFat: 20.6,
    chest: 104.5,
    waist: 90.0,
    arms: 37.2,
    thighs: 60.0,
    notes: 'Week 2 check-in. Sore after Romanian deadlifts but recovery is on point.',
    createdAt: new Date('2026-08-29').toISOString(),
  },
  {
    id: 'prog-3',
    userEmail: 'demo@fitflex.com',
    date: '2026-09-12',
    weight: 84.0,
    bodyFat: 19.4,
    chest: 105.0,
    waist: 88.0,
    arms: 37.5,
    thighs: 59.5,
    notes: 'Increased daily water to 3.5L. Energy levels feeling sharp.',
    createdAt: new Date('2026-09-12').toISOString(),
  },
  {
    id: 'prog-4',
    userEmail: 'demo@fitflex.com',
    date: '2026-09-26',
    weight: 83.2,
    bodyFat: 18.2,
    chest: 105.5,
    waist: 86.5,
    arms: 38.0,
    thighs: 59.0,
    notes: 'Broke 100kg bench press milestone! Waist dropped 6cm since start.',
    createdAt: new Date('2026-09-26').toISOString(),
  },
  {
    id: 'prog-5',
    userEmail: 'demo@fitflex.com',
    date: '2026-10-10',
    weight: 82.0,
    bodyFat: 17.0,
    chest: 106.0,
    waist: 85.0,
    arms: 38.4,
    thighs: 59.0,
    notes: 'Added Friday night HIIT sprint session. Conditioning elevated.',
    createdAt: new Date('2026-10-10').toISOString(),
  },
  {
    id: 'prog-6',
    userEmail: 'demo@fitflex.com',
    date: '2026-10-20',
    weight: 81.2,
    bodyFat: 16.1,
    chest: 106.5,
    waist: 83.5,
    arms: 38.8,
    thighs: 58.5,
    notes: 'Current weigh-in. Down 5.2kg with visible abdominal definition.',
    createdAt: new Date('2026-10-20').toISOString(),
  },
];

const fitnessGoals: ServerFitnessGoal[] = [
  {
    id: 'goal-1',
    userEmail: 'demo@fitflex.com',
    title: 'Target Body Recomposition & Fat Shred',
    category: 'weight_loss',
    startValue: 86.4,
    currentValue: 81.2,
    targetValue: 78.0,
    unit: 'kg',
    deadline: '2026-12-15',
    notes: 'Aiming for sub-15% body fat with visible abs.',
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'goal-2',
    userEmail: 'demo@fitflex.com',
    title: 'Lean Muscle Mass Hypertrophy',
    category: 'muscle_gain',
    startValue: 64.0,
    currentValue: 67.2,
    targetValue: 70.0,
    unit: 'kg',
    deadline: '2027-02-01',
    notes: 'Progressive overload on barbell squats and deadlifts.',
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'goal-3',
    userEmail: 'demo@fitflex.com',
    title: 'Weekly Gym Training Consistency',
    category: 'workout_frequency',
    startValue: 2,
    currentValue: 4,
    targetValue: 5,
    unit: 'days/week',
    deadline: '2026-11-30',
    notes: '4 lifting sessions + 1 high-tempo HIIT class weekly.',
    createdAt: new Date('2026-09-01').toISOString(),
  },
  {
    id: 'goal-4',
    userEmail: 'demo@fitflex.com',
    title: 'Daily High-Protein Target',
    category: 'nutrition',
    startValue: 120,
    currentValue: 165,
    targetValue: 180,
    unit: 'g/day',
    deadline: '2026-12-31',
    notes: 'Hitting 2.2g protein per kg of bodyweight.',
    createdAt: new Date('2026-09-10').toISOString(),
  },
];

function formatOffsetDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const workoutSessions: ServerWorkoutSession[] = [
  {
    id: 'wo-today',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(0),
    title: 'Heavy Barbell Squats & Quad Hypertrophy',
    discipline: 'strength',
    durationMinutes: 65,
    exercisesCompleted: ['Back Squats 4x6 @ 130kg', 'Bulgarian Split Squats 3x10', 'Leg Press 4x12', 'Standing Calf Raises 4x15'],
    intensityRpe: 8,
    caloriesBurned: 480,
    notes: 'Hit clean depth on all squat sets. Quads were on fire by end of drop set.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-2d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(2),
    title: 'Upper Body Push & Shoulder Demolition',
    discipline: 'strength',
    durationMinutes: 60,
    exercisesCompleted: ['Incline Barbell Bench 4x8 @ 85kg', 'Dumbbell Overhead Press 3x10', 'Dips (Weighted +15kg) 3x8', 'Cable Lateral Raises 4x15'],
    intensityRpe: 8,
    caloriesBurned: 420,
    notes: 'Solid lockouts on incline press. Shoulders felt fully pumped.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-4d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(4),
    title: 'HIIT Sprints & Assault Bike Tabata',
    discipline: 'hiit',
    durationMinutes: 35,
    exercisesCompleted: ['Curved Treadmill Sprints 8x30s', 'Assault Bike 10/20 Intervals', 'Kettlebell Swings 4x20 @ 24kg'],
    intensityRpe: 9,
    caloriesBurned: 390,
    notes: 'Max heart rate touched 176 bpm during final assault bike round.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-6d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(6),
    title: 'Deadlift Density & Posterior Chain',
    discipline: 'strength',
    durationMinutes: 70,
    exercisesCompleted: ['Conventional Deadlift 5x5 @ 165kg', 'Romanian Deadlift 3x10', 'Chest-Supported T-Bar Rows 4x10', 'Hanging Leg Raises 4x15'],
    intensityRpe: 9,
    caloriesBurned: 520,
    notes: 'Clean double overhand grip up to 140kg, strapped for top 5x5.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-8d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(8),
    title: 'Yoga Restoration & Deep Hip Opener',
    discipline: 'yoga',
    durationMinutes: 45,
    exercisesCompleted: ['Sun Salutations A&B', 'Pigeon Pose Holds 3m/side', 'Lizard Pose & Hip Flossing', 'Thoracic Foam Rolling'],
    intensityRpe: 4,
    caloriesBurned: 160,
    notes: 'Great release for tight hip flexors and lower back after heavy deadlifts.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-11d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(11),
    title: 'Pull Power & Biceps Hypertrophy',
    discipline: 'strength',
    durationMinutes: 55,
    exercisesCompleted: ['Weighted Pull-ups 4x6 (+10kg)', 'Barbell Pendlay Rows 4x8', 'Incline Dumbbell Curls 4x12', 'Face Pulls 4x20'],
    intensityRpe: 8,
    caloriesBurned: 395,
    notes: 'Strict form with paused squeeze at the top of pull-ups.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-14d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(14),
    title: 'Functional Turf Conditioning & Sled Pushes',
    discipline: 'cardio',
    durationMinutes: 50,
    exercisesCompleted: ['Heavy Prowler Push 6x40m', 'Farmer Walks 4x50m @ 32kg each', 'Ski-Erg Intervals 5x500m'],
    intensityRpe: 8,
    caloriesBurned: 460,
    notes: 'Legs were heavy on the last two prowler pushes but sustained target pace.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wo-17d',
    userEmail: 'demo@fitflex.com',
    date: formatOffsetDate(17),
    title: 'Active Mobility & Contrast Therapy',
    discipline: 'recovery',
    durationMinutes: 35,
    exercisesCompleted: ['90/90 Hip Switches', 'Shoulder CARs', 'Sauna 15 min & Cold Plunge 3 min'],
    intensityRpe: 3,
    caloriesBurned: 110,
    notes: 'Heart rate reset nicely. CNS felt refreshed.',
    createdAt: new Date().toISOString(),
  },
  // Also seed October 2026 dates to align with progress logs
  {
    id: 'wo-oct20',
    userEmail: 'demo@fitflex.com',
    date: '2026-10-20',
    title: 'Heavy Lower Body & Glutes',
    discipline: 'strength',
    durationMinutes: 65,
    exercisesCompleted: ['Back Squats 4x6 @ 135kg', 'Bulgarian Split Squats 3x10', 'Leg Press 4x12'],
    intensityRpe: 8,
    caloriesBurned: 480,
    notes: 'Matched milestone weigh-in day. Energy level peak.',
    createdAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'wo-oct18',
    userEmail: 'demo@fitflex.com',
    date: '2026-10-18',
    title: 'Upper Push Hypertrophy',
    discipline: 'strength',
    durationMinutes: 60,
    exercisesCompleted: ['Incline Bench 4x8', 'Dumbbell Shoulder Press 3x10', 'Dips 3x12'],
    intensityRpe: 8,
    caloriesBurned: 410,
    notes: 'Pushed heavy sets on incline.',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'wo-oct15',
    userEmail: 'demo@fitflex.com',
    date: '2026-10-15',
    title: 'Metabolic Sprint Circuit',
    discipline: 'hiit',
    durationMinutes: 40,
    exercisesCompleted: ['Curved Treadmill 10x30s', 'Assault Bike 8 rounds'],
    intensityRpe: 9,
    caloriesBurned: 420,
    notes: 'Fast paced conditioning.',
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'wo-oct12',
    userEmail: 'demo@fitflex.com',
    date: '2026-10-12',
    title: 'Deadlifts & Barbell Rows',
    discipline: 'strength',
    durationMinutes: 65,
    exercisesCompleted: ['Conventional Deadlift 5x5 @ 160kg', 'Pendlay Rows 4x8'],
    intensityRpe: 9,
    caloriesBurned: 500,
    notes: 'Locked out smoothly with zero lower back strain.',
    createdAt: '2026-10-12T10:00:00Z',
  },
];

// Persistent File-Based JSON Database
const DB_FILE = path.resolve(__dirname, 'data', 'database.json');

function saveDb(): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const payload = {
      users,
      reservations,
      consultations,
      contactMessages,
      progressLogs,
      fitnessGoals,
      workoutSessions,
      emailNotifications,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist database:', err);
  }
}

function loadDb(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.users) && data.users.length) {
        users.length = 0;
        users.push(...data.users);
      }
      if (Array.isArray(data.reservations) && data.reservations.length) {
        reservations.length = 0;
        reservations.push(...data.reservations);
      }
      if (Array.isArray(data.consultations) && data.consultations.length) {
        consultations.length = 0;
        consultations.push(...data.consultations);
      }
      if (Array.isArray(data.contactMessages) && data.contactMessages.length) {
        contactMessages.length = 0;
        contactMessages.push(...data.contactMessages);
      }
      if (Array.isArray(data.progressLogs) && data.progressLogs.length) {
        progressLogs.length = 0;
        progressLogs.push(...data.progressLogs);
      }
      if (Array.isArray(data.fitnessGoals) && data.fitnessGoals.length) {
        fitnessGoals.length = 0;
        fitnessGoals.push(...data.fitnessGoals);
      }
      if (Array.isArray(data.workoutSessions) && data.workoutSessions.length) {
        workoutSessions.length = 0;
        workoutSessions.push(...data.workoutSessions);
      }
      if (Array.isArray(data.emailNotifications) && data.emailNotifications.length) {
        emailNotifications.length = 0;
        emailNotifications.push(...data.emailNotifications);
      }
      console.log('[DB] Database state loaded successfully from disk.');
    } else {
      saveDb();
      console.log('[DB] Seed database written to disk.');
    }
  } catch (err) {
    console.error('[DB] Failed to load database from disk:', err);
  }
}

// Initialize database from disk
loadDb();

// Helper to extract bearer token / email
function getAuthEmail(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Simple encoded token: base64 email or raw email
    try {
      if (token.includes('@')) return token;
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      if (decoded.includes('@')) return decoded;
    } catch {
      return token;
    }
    return token;
  }
  return null;
}

// ==========================================
// API ROUTES
// ==========================================

// Auth: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, goal } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const newUser: User = {
    id: `u-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: password,
    role: 'member',
    memberId: `FF-${randomDigits}`,
    membershipPlan: 'Free Day Trial Pass',
    membershipExpiry: 'ACTIVE',
    phone: phone || '',
    fitnessGoal: goal || 'Strength & Conditioning',
    targetCalories: 2400,
  };

  users.push(newUser);
  saveDb();

  const token = Buffer.from(newUser.email).toString('base64');
  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      memberId: newUser.memberId,
      membershipPlan: newUser.membershipPlan,
      membershipExpiry: newUser.membershipExpiry,
      phone: newUser.phone,
      fitnessGoal: newUser.fitnessGoal,
    },
  });
});

// Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = Buffer.from(user.email).toString('base64');
  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      membershipPlan: user.membershipPlan,
      membershipExpiry: user.membershipExpiry,
      phone: user.phone,
      fitnessGoal: user.fitnessGoal,
    },
  });
});

// Auth: Me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const email = getAuthEmail(req);
  if (!email) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      membershipPlan: user.membershipPlan,
      membershipExpiry: user.membershipExpiry,
      phone: user.phone,
      fitnessGoal: user.fitnessGoal,
      targetCalories: user.targetCalories,
    },
  });
});

// Reservations: List
app.get('/api/reservations', (req: Request, res: Response) => {
  const email = getAuthEmail(req);
  if (!email) {
    return res.json({ reservations: [] });
  }

  const userReservations = reservations.filter(
    (r) => r.userEmail.toLowerCase() === email.toLowerCase()
  );
  return res.json({ reservations: userReservations });
});

// Reservations: Create
app.post('/api/reservations', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || req.body.email || 'guest@fitflex.com';
  const { classId, classTitle, day, time, trainer } = req.body;

  if (!classId || !classTitle) {
    return res.status(400).json({ error: 'Class details are required.' });
  }

  // Check if already reserved
  const existing = reservations.find(
    (r) => r.userEmail.toLowerCase() === email.toLowerCase() && r.classId === classId
  );
  if (existing) {
    return res.status(409).json({ error: 'You already reserved a spot in this class.' });
  }

  const newRes: Reservation = {
    id: `res-${Date.now()}`,
    userEmail: email,
    classId,
    classTitle,
    day: day || 'Today',
    time: time || 'TBD',
    trainer: trainer || 'FitFlex Coach',
    reservedAt: new Date().toISOString(),
  };

  reservations.push(newRes);
  saveDb();
  return res.status(201).json({ message: 'Spot reserved successfully', reservation: newRes });
});

// Reservations: Cancel / Delete
app.delete('/api/reservations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found.' });
  }

  const removed = reservations.splice(index, 1);
  saveDb();
  return res.json({ message: 'Reservation canceled', removed: removed[0] });
});

// Consultations: List
app.get('/api/consultations', (req: Request, res: Response) => {
  const email = getAuthEmail(req);
  if (!email) {
    return res.json({ consultations: [] });
  }
  const userConsultations = consultations.filter(
    (c) => c.userEmail.toLowerCase() === email.toLowerCase()
  );
  return res.json({ consultations: userConsultations });
});

// Consultations: Create
app.post('/api/consultations', (req: Request, res: Response) => {
  const { name, email, phone, trainerName, programInterest, date, timeSlot, notes } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const referenceCode = 'FF-' + Math.floor(100000 + Math.random() * 900000);
  const newConsultation: Consultation = {
    id: `con-${Date.now()}`,
    userEmail: email.toLowerCase(),
    name,
    phone,
    trainerName,
    programInterest: programInterest || 'General Performance',
    date: date || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '10:00 AM',
    notes,
    referenceCode,
    createdAt: new Date().toISOString(),
  };

  consultations.push(newConsultation);
  saveDb();
  return res.status(201).json({
    message: 'Consultation appointment scheduled',
    consultation: newConsultation,
    referenceCode,
  });
});

// Contact Messages
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, program, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const msg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone,
    program: program || 'General Inquiry',
    message,
    createdAt: new Date().toISOString(),
  };

  contactMessages.push(msg);
  saveDb();
  return res.status(201).json({
    message: 'Thank you for reaching out. We will get back to you within 24 hours.',
    id: msg.id,
  });
});

// Membership update / enrollment
app.post('/api/membership/enroll', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || req.body.email;
  const { planName, isAnnual, memberName } = req.body;

  if (!planName) {
    return res.status(400).json({ error: 'Plan name is required.' });
  }

  let user = users.find((u) => email && u.email.toLowerCase() === email.toLowerCase());
  if (!user && memberName) {
    user = users.find((u) => u.name.toLowerCase() === memberName.toLowerCase());
  }

  const expiry = isAnnual ? `DEC ${new Date().getFullYear() + 1}` : 'ACTIVE MONTHLY';

  if (user) {
    user.membershipPlan = planName;
    user.membershipExpiry = expiry;
    saveDb();
  }

  const token = user ? Buffer.from(user.email).toString('base64') : 'guest-pass';
  return res.json({
    message: `Enrolled into ${planName}`,
    membershipPlan: planName,
    membershipExpiry: expiry,
    memberId: user ? user.memberId : `FF-${Math.floor(100000 + Math.random() * 900000)}`,
    token,
  });
});

// Progress Tracking: List logs
app.get('/api/progress', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || 'demo@fitflex.com';
  const userLogs = progressLogs
    .filter((p) => p.userEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return res.json({ logs: userLogs });
});

// Progress Tracking: Log new measurement
app.post('/api/progress', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || req.body.email || 'demo@fitflex.com';
  const { date, weight, bodyFat, chest, waist, arms, thighs, notes } = req.body;

  if (!weight) {
    return res.status(400).json({ error: 'Body weight is required.' });
  }

  const newLog: ServerProgressLog = {
    id: `prog-${Date.now()}`,
    userEmail: email.toLowerCase(),
    date: date || new Date().toISOString().split('T')[0],
    weight: Number(weight),
    bodyFat: bodyFat ? Number(bodyFat) : undefined,
    chest: chest ? Number(chest) : undefined,
    waist: waist ? Number(waist) : undefined,
    arms: arms ? Number(arms) : undefined,
    thighs: thighs ? Number(thighs) : undefined,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  progressLogs.push(newLog);
  saveDb();
  return res.status(201).json({ message: 'Measurement logged successfully', log: newLog });
});

// Progress Tracking: Delete log
app.delete('/api/progress/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = progressLogs.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Log entry not found.' });
  }

  const removed = progressLogs.splice(index, 1);
  saveDb();
  return res.json({ message: 'Log deleted', removed: removed[0] });
});

// Fitness Goals: List
app.get('/api/goals', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || 'demo@fitflex.com';
  const userGoals = fitnessGoals.filter(
    (g) => g.userEmail.toLowerCase() === email.toLowerCase()
  );
  return res.json({ goals: userGoals });
});

// Fitness Goals: Create
app.post('/api/goals', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || req.body.email || 'demo@fitflex.com';
  const { title, category, startValue, currentValue, targetValue, unit, deadline, notes } = req.body;

  if (!title || targetValue === undefined) {
    return res.status(400).json({ error: 'Goal title and target value are required.' });
  }

  const newGoal: ServerFitnessGoal = {
    id: `goal-${Date.now()}`,
    userEmail: email.toLowerCase(),
    title,
    category: category || 'weight_loss',
    startValue: Number(startValue ?? currentValue ?? 0),
    currentValue: Number(currentValue ?? startValue ?? 0),
    targetValue: Number(targetValue),
    unit: unit || 'kg',
    deadline: deadline || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  fitnessGoals.push(newGoal);
  saveDb();
  return res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
});

// Fitness Goals: Update progress
app.put('/api/goals/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const goal = fitnessGoals.find((g) => g.id === id);
  if (!goal) {
    return res.status(404).json({ error: 'Goal not found.' });
  }

  const { title, currentValue, targetValue, startValue, unit, deadline, notes } = req.body;
  if (title !== undefined) goal.title = title;
  if (currentValue !== undefined) goal.currentValue = Number(currentValue);
  if (targetValue !== undefined) goal.targetValue = Number(targetValue);
  if (startValue !== undefined) goal.startValue = Number(startValue);
  if (unit !== undefined) goal.unit = unit;
  if (deadline !== undefined) goal.deadline = deadline;
  if (notes !== undefined) goal.notes = notes;

  saveDb();
  return res.json({ message: 'Goal updated successfully', goal });
});

// Fitness Goals: Delete
app.delete('/api/goals/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = fitnessGoals.findIndex((g) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Goal not found.' });
  }

  const removed = fitnessGoals.splice(index, 1);
  saveDb();
  return res.json({ message: 'Goal deleted successfully', removed: removed[0] });
});

// Workout Calendar Sessions: List
app.get('/api/workouts', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || 'demo@fitflex.com';
  const { month } = req.query; // optional YYYY-MM filter

  let userWorkouts = workoutSessions.filter(
    (w) => w.userEmail.toLowerCase() === email.toLowerCase()
  );

  if (month && typeof month === 'string') {
    userWorkouts = userWorkouts.filter((w) => w.date.startsWith(month));
  }

  // Sort by date descending
  userWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return res.json({ workouts: userWorkouts });
});

// Workout Calendar Sessions: Log new session
app.post('/api/workouts', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || req.body.email || 'demo@fitflex.com';
  const { date, title, discipline, durationMinutes, exercisesCompleted, intensityRpe, caloriesBurned, notes } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Workout title and date are required.' });
  }

  const newWorkout: ServerWorkoutSession = {
    id: `wo-${Date.now()}`,
    userEmail: email.toLowerCase(),
    date: date,
    title,
    discipline: discipline || 'strength',
    durationMinutes: Number(durationMinutes || 45),
    exercisesCompleted: Array.isArray(exercisesCompleted)
      ? exercisesCompleted
      : typeof exercisesCompleted === 'string' && exercisesCompleted.trim()
      ? exercisesCompleted.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [],
    intensityRpe: Math.min(10, Math.max(1, Number(intensityRpe || 7))),
    caloriesBurned: caloriesBurned ? Number(caloriesBurned) : undefined,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  workoutSessions.push(newWorkout);
  saveDb();
  return res.status(201).json({ message: 'Workout logged successfully', workout: newWorkout });
});

// Workout Calendar Sessions: Update (notes/reflections, details)
app.put('/api/workouts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const workout = workoutSessions.find((w) => w.id === id);
  if (!workout) {
    return res.status(404).json({ error: 'Workout session not found.' });
  }

  const { notes, title, discipline, durationMinutes, intensityRpe, caloriesBurned, exercisesCompleted } = req.body;
  if (notes !== undefined) workout.notes = notes;
  if (title !== undefined) workout.title = title;
  if (discipline !== undefined) workout.discipline = discipline;
  if (durationMinutes !== undefined) workout.durationMinutes = Number(durationMinutes);
  if (intensityRpe !== undefined) workout.intensityRpe = Number(intensityRpe);
  if (caloriesBurned !== undefined) workout.caloriesBurned = caloriesBurned ? Number(caloriesBurned) : undefined;
  if (exercisesCompleted !== undefined) {
    workout.exercisesCompleted = Array.isArray(exercisesCompleted)
      ? exercisesCompleted
      : typeof exercisesCompleted === 'string'
      ? exercisesCompleted.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : workout.exercisesCompleted;
  }

  saveDb();
  return res.json({ message: 'Workout updated successfully', workout });
});

// Workout Calendar Sessions: Delete
app.delete('/api/workouts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = workoutSessions.findIndex((w) => w.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Workout session not found.' });
  }

  const removed = workoutSessions.splice(index, 1);
  saveDb();
  return res.json({ message: 'Workout session deleted', removed: removed[0] });
});

// Gym Live Overview Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  return res.json({
    coachesCount: 15,
    weeklyClasses: 42,
    activeMembers: 1240,
    openStatus: '24/7 OPEN',
    peakHours: '06:00 - 08:30 & 17:30 - 20:30',
  });
});

// ==========================================
// WEEKLY SUMMARY EMAIL NOTIFICATION GENERATOR
// ==========================================
function generateWeeklySummaryEmail(userEmail: string) {
  const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase()) || {
    id: 'u-guest',
    name: 'Alex Walker',
    email: userEmail,
    role: 'member',
    memberId: 'FF-884920',
    membershipPlan: 'Black Card Elite 24/7',
    membershipExpiry: 'ACTIVE',
  };

  // Reference window (past 7 days)
  const now = new Date();
  const past7Days = new Date();
  past7Days.setDate(now.getDate() - 7);
  const nowStr = now.toISOString().split('T')[0];
  const past7Str = past7Days.toISOString().split('T')[0];

  // Workouts for this user
  const userWorkouts = workoutSessions.filter(
    (w) => w.userEmail.toLowerCase() === userEmail.toLowerCase()
  );

  let weekWorkouts = userWorkouts.filter((w) => w.date >= past7Str && w.date <= nowStr);
  if (weekWorkouts.length === 0 && userWorkouts.length > 0) {
    weekWorkouts = userWorkouts.slice(0, 5);
  }

  const totalWorkouts = weekWorkouts.length;
  const totalMinutes = weekWorkouts.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalCalories = weekWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  const avgRpe = totalWorkouts > 0
    ? (weekWorkouts.reduce((acc, curr) => acc + curr.intensityRpe, 0) / totalWorkouts).toFixed(1)
    : '7.8';
  const activeDays = new Set(weekWorkouts.map((w) => w.date)).size;

  // Goals progress calculations
  const userGoals = fitnessGoals.filter((g) => g.userEmail.toLowerCase() === userEmail.toLowerCase());
  const freqGoal = userGoals.find((g) => g.category === 'workout_frequency');
  const targetDays = freqGoal ? freqGoal.targetValue : 5;
  const consistencyPct = Math.min(100, Math.round((activeDays / targetDays) * 100));

  const disciplineBreakdown: Record<string, number> = {};
  for (const w of weekWorkouts) {
    disciplineBreakdown[w.discipline] = (disciplineBreakdown[w.discipline] || 0) + 1;
  }

  const goalsProgress = userGoals.map((g) => {
    let pct = 0;
    if (g.category === 'weight_loss') {
      const denom = (g.startValue - g.targetValue) || 1;
      pct = Math.round(((g.startValue - g.currentValue) / denom) * 100);
    } else if (g.category === 'workout_frequency') {
      pct = Math.round((activeDays / g.targetValue) * 100);
    } else {
      const denom = (g.targetValue - g.startValue) || g.targetValue || 1;
      pct = Math.round(((g.currentValue - g.startValue) / denom) * 100);
    }
    pct = Math.max(0, Math.min(150, pct));

    let statusText = 'In Progress';
    let statusColor = '#EAB308';
    if (pct >= 100) {
      statusText = 'Goal Met';
      statusColor = '#10B981';
    } else if (pct >= 75) {
      statusText = 'On Track';
      statusColor = '#FFFF00';
    } else if (pct < 50) {
      statusText = 'Needs Focus';
      statusColor = '#F43F5E';
    }

    return {
      id: g.id,
      title: g.title,
      category: g.category,
      startValue: g.startValue,
      currentValue: g.currentValue,
      targetValue: g.targetValue,
      unit: g.unit,
      percentage: pct,
      statusText,
      statusColor,
      notes: g.notes,
    };
  });

  const reflectionWorkouts = weekWorkouts.filter((w) => w.notes && w.notes.trim().length > 0);
  const highlightReflection = reflectionWorkouts.length > 0
    ? reflectionWorkouts[0].notes
    : 'Hit clean depth on all squat sets. CNS felt exceptional. Quads had incredible pump. Hydrated with 2L water.';

  const dateRange = `${past7Str} to ${nowStr}`;
  const subject = `⚡ Your Weekly FitFlex Digest: ${totalWorkouts} Workouts Completed • ${consistencyPct}% Consistency Rate`;

  // Generate Email HTML
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0A0A0A; border: 1px solid #262626;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 24px 30px; background-color: #000000; border-bottom: 2px solid #FFFF00;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF;">FIT<span style="color: #FFFF00;">FLEX</span></span>
                    <span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #A3A3A3; margin-top: 2px;">Weekly Consistency & Goals Digest</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-family: monospace; font-weight: 700; color: #FFFF00; background-color: #171717; padding: 4px 8px; border: 1px solid #333333;">
                      ${user.memberId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 28px 30px 20px 30px;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #FFFF00;">Performance Report</span>
              <h1 style="margin: 6px 0 10px 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px; color: #FFFFFF;">
                Week in Review, ${user.name}
              </h1>
              <p style="margin: 0; font-size: 13px; color: #A3A3A3; line-height: 1.5;">
                Here is your comprehensive training ledger for <strong>${dateRange}</strong>. Track your progress against active targets and lock in your focus for the upcoming week.
              </p>
            </td>
          </tr>

          <!-- Consistency Banner -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background-color: #141414; border: 1px solid #262626; padding: 16px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #A3A3A3;">Weekly Workout Consistency</span>
                      <div style="font-size: 20px; font-weight: 800; font-family: monospace; color: #FFFF00; margin: 4px 0;">
                        ${consistencyPct}% Attained (${activeDays} / ${targetDays} Planned Days)
                      </div>
                    </td>
                    <td align="right">
                      <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${consistencyPct >= 100 ? '#10B981' : '#FFFF00'};">
                        ${consistencyPct >= 100 ? 'Target Exceeded ⚡' : 'Solid Cadence 💪'}
                      </span>
                    </td>
                  </tr>
                </table>
                <div style="width: 100%; height: 8px; background-color: #262626; margin-top: 10px; overflow: hidden;">
                  <div style="width: ${Math.min(100, consistencyPct)}%; height: 100%; background-color: #FFFF00;"></div>
                </div>
              </div>
            </td>
          </tr>

          <!-- 4-Stat Metric Grid -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table width="100%" cellspacing="8" cellpadding="0" border="0" style="margin: 0 -8px;">
                <tr>
                  <td width="50%" style="background-color: #121212; border: 1px solid #262626; padding: 14px;">
                    <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Workouts Completed</span>
                    <div style="font-size: 22px; font-weight: 900; font-family: monospace; color: #FFFFFF; margin-top: 4px;">
                      ${totalWorkouts} <span style="font-size: 11px; font-weight: 600; color: #A3A3A3;">Sessions</span>
                    </div>
                  </td>
                  <td width="50%" style="background-color: #121212; border: 1px solid #262626; padding: 14px;">
                    <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Total Time Under Tension</span>
                    <div style="font-size: 22px; font-weight: 900; font-family: monospace; color: #FFFF00; margin-top: 4px;">
                      ${totalMinutes} <span style="font-size: 11px; font-weight: 600; color: #A3A3A3;">Minutes</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="background-color: #121212; border: 1px solid #262626; padding: 14px;">
                    <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Active Energy Burn</span>
                    <div style="font-size: 22px; font-weight: 900; font-family: monospace; color: #FFFFFF; margin-top: 4px;">
                      ${totalCalories.toLocaleString()} <span style="font-size: 11px; font-weight: 600; color: #A3A3A3;">kCal</span>
                    </div>
                  </td>
                  <td width="50%" style="background-color: #121212; border: 1px solid #262626; padding: 14px;">
                    <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Average Intensity</span>
                    <div style="font-size: 22px; font-weight: 900; font-family: monospace; color: #FFFF00; margin-top: 4px;">
                      ${avgRpe} <span style="font-size: 11px; font-weight: 600; color: #A3A3A3;">/ 10 RPE</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Goals Attainment Section -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <div style="border-top: 1px solid #262626; padding-top: 20px;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #FFFF00; display: block; margin-bottom: 12px;">
                  Progress Towards Defined Goals (${goalsProgress.length})
                </span>
                
                ${goalsProgress.map(g => `
                  <div style="background-color: #121212; border: 1px solid #262626; padding: 14px; margin-bottom: 10px;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #FFFFFF;">${g.title}</span>
                          <div style="font-size: 11px; font-family: monospace; color: #A3A3A3; margin-top: 2px;">
                            Current: <strong style="color: #FFFFFF;">${g.currentValue} ${g.unit}</strong> • Target: <strong style="color: #FFFF00;">${g.targetValue} ${g.unit}</strong>
                          </div>
                        </td>
                        <td align="right" valign="top">
                          <span style="display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; font-family: monospace; border: 1px solid ${g.statusColor}; color: ${g.statusColor}; background-color: #000000;">
                            ${g.statusText} (${g.percentage}%)
                          </span>
                        </td>
                      </tr>
                    </table>
                    <div style="width: 100%; height: 6px; background-color: #262626; margin-top: 10px; overflow: hidden;">
                      <div style="width: ${Math.min(100, g.percentage)}%; height: 100%; background-color: ${g.statusColor};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </td>
          </tr>

          <!-- Post-Workout Reflection Highlight -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <div style="background-color: #141414; border-left: 3px solid #FFFF00; padding: 14px 16px;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #FFFF00; display: block; margin-bottom: 4px;">
                  Post-Workout Reflection Highlight
                </span>
                <p style="margin: 0; font-size: 12px; color: #E5E5E5; font-style: italic; line-height: 1.5;">
                  &ldquo;${highlightReflection}&rdquo;
                </p>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 30px 30px;" align="center">
              <a href="https://fitflex.app/dashboard" style="display: inline-block; background-color: #FFFF00; color: #000000; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 14px 32px; border-radius: 0;">
                Open Member Portal & Log Next Workout &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #000000; border-top: 1px solid #1F1F1F; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #737373;">
                FitFlex Performance Gym • 24/7 Member Portal
              </p>
              <p style="margin: 0; font-size: 10px; color: #525252;">
                You are receiving this digest because your FitFlex profile has weekly summary notifications enabled.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Version
  const textContent = `
==================================================
FITFLEX WEEKLY SUMMARY REPORT
==================================================
Member: ${user.name} (${user.email})
Member ID: ${user.memberId}
Date Range: ${dateRange}

⚡ WORKOUT CONSISTENCY & TIME
--------------------------------------------------
- Consistency Attainment: ${consistencyPct}% (${activeDays} / ${targetDays} planned days active)
- Workouts Completed: ${totalWorkouts} sessions
- Total Training Volume: ${totalMinutes} minutes
- Active Caloric Burn: ${totalCalories} kCal
- Average Effort: ${avgRpe} / 10 RPE

🎯 PROGRESS TOWARDS DEFINED FITNESS GOALS
--------------------------------------------------
${goalsProgress.map((g, i) => `${i + 1}. ${g.title}
   Current: ${g.currentValue} ${g.unit} | Target: ${g.targetValue} ${g.unit}
   Attainment: ${g.percentage}% [${g.statusText}]`).join('\n')}

💬 POST-WORKOUT REFLECTION HIGHLIGHT
--------------------------------------------------
"${highlightReflection}"

==================================================
FitFlex Performance Gym • 24/7 Member Portal
Log your next session at https://fitflex.app/dashboard
==================================================
  `.trim();

  return {
    id: `digest-${Date.now()}`,
    recipientEmail: user.email,
    recipientName: user.name,
    subject,
    generatedAt: new Date().toISOString(),
    dateRange,
    stats: {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      avgRpe: Number(avgRpe),
      activeDays,
      targetDays,
      consistencyPct,
      disciplineBreakdown,
    },
    goals: goalsProgress,
    highlightReflection,
    htmlContent,
    textContent,
  };
}

// Notifications: Preview Weekly Summary
app.get('/api/notifications/weekly-summary', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || 'demo@fitflex.com';
  const summary = generateWeeklySummaryEmail(email);
  return res.json({ summary });
});

// Notifications: Dispatch / Send Weekly Summary Email
app.post('/api/notifications/weekly-summary/send', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || req.body.email || 'demo@fitflex.com';
  const summary = generateWeeklySummaryEmail(email);

  const record: ServerNotificationRecord = {
    id: `notif-${Date.now()}`,
    userEmail: email.toLowerCase(),
    recipientEmail: summary.recipientEmail,
    recipientName: summary.recipientName,
    subject: summary.subject,
    sentAt: new Date().toISOString(),
    stats: {
      totalWorkouts: summary.stats.totalWorkouts,
      totalMinutes: summary.stats.totalMinutes,
      totalCalories: summary.stats.totalCalories,
      consistencyPct: summary.stats.consistencyPct,
    },
    goalsCount: summary.goals.length,
    status: 'delivered',
  };

  emailNotifications.unshift(record);
  saveDb();

  return res.status(201).json({
    message: `Weekly summary email dispatched to ${record.recipientEmail}`,
    record,
    summary,
  });
});

// Notifications: History
app.get('/api/notifications/history', (req: Request, res: Response) => {
  const email = getAuthEmail(req) || 'demo@fitflex.com';
  const history = emailNotifications.filter(
    (n) => n.userEmail.toLowerCase() === email.toLowerCase()
  );
  return res.json({ history });
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`FitFlex Full-Stack Server running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
