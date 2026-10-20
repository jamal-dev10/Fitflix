import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
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
  return res.json({ message: 'Goal deleted successfully', removed: removed[0] });
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
