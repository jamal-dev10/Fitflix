export type ProgramCategory = 'all' | 'strength' | 'yoga' | 'cardio' | 'functional';

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface Program {
  id: string;
  title: string;
  category: 'strength' | 'yoga' | 'cardio' | 'functional';
  description: string;
  longDescription: string;
  image: string;
  icon: string;
  duration: string;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  schedule: string;
  trainer: string;
  exercises: Exercise[];
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialty: string[];
  bio: string;
  image: string;
  availableDays: string[];
}

export interface Recipe {
  id: string;
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack & Shake';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image: string;
}

export interface ClassSession {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  title: string;
  trainer: string;
  duration: string;
  capacity: number;
  enrolled: number;
  location: string;
  category: 'strength' | 'yoga' | 'cardio' | 'functional';
}

export interface ConsultationBooking {
  name: string;
  email: string;
  phone: string;
  trainerId?: string;
  programInterest: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  tagline: string;
  isPopular?: boolean;
  features: string[];
  perks: string[];
}

export interface TransformationStory {
  id: string;
  name: string;
  timeframe: string;
  achievement: string;
  quote: string;
  program: string;
  trainer: string;
  image: string;
}

export interface FacilityZone {
  id: string;
  name: string;
  tagline: string;
  description: string;
  equipment: string[];
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'membership' | 'training' | 'nutrition' | 'facility';
}
