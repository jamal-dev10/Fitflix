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
