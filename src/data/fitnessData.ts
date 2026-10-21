import { Program, Trainer, Recipe, ClassSession, MembershipPlan, TransformationStory, FacilityZone, FaqItem, CoachAvailability } from '../types';

export const PROGRAMS: Program[] = [
  {
    id: 'strength-training',
    title: 'Strength Training',
    category: 'strength',
    description: 'The program typically involves lifting weights, performing bodyweight exercises, or using resistance machines to challenge and stimulate the muscles.',
    longDescription: 'Engineered for progressive overload, muscular hypertrophy, and functional power. FitFlex Strength Training pairs compound multi-joint movements with targeted accessory work to build unyielding resilience and bone density.',
    image: '/assets/img/img4.jpg',
    icon: '/assets/img/dumbbell.png',
    duration: '60 Mins',
    intensity: 'Advanced',
    schedule: 'Mon / Wed / Fri',
    trainer: 'Marcus Vance',
    exercises: [
      { name: 'Barbell Back Squat', sets: '4', reps: '6-8 reps', notes: 'Focus on full depth and explosive upward drive' },
      { name: 'Romanian Deadlift', sets: '3', reps: '8-10 reps', notes: 'Hinge back with neutral spine and hamstring stretch' },
      { name: 'Incline Dumbbell Press', sets: '4', reps: '8-12 reps', notes: '30-degree bench angle, 3-second controlled eccentric' },
      { name: 'Weighted Pull-Ups', sets: '3', reps: '6-8 reps', notes: 'Full dead-hang to chin over bar' },
      { name: 'Standing Overhead Press', sets: '3', reps: '8 reps', notes: 'Brace core tightly, bar path close to nose' }
    ]
  },
  {
    id: 'yoga',
    title: 'Yoga & Flexibility',
    category: 'yoga',
    description: 'Typically involves a series of physical postures, breathing techniques, and meditation to improve flexibility, strength, balance, and relaxation.',
    longDescription: 'Harmonize your kinetic chain through dynamic Vinyasa flows, deep myofascial release, and diaphragmatic breathwork. Designed to accelerate recovery between heavy lifting sessions and sharpen mental clarity.',
    image: '/assets/img/img5.jpg',
    icon: '/assets/img/yoga.png',
    duration: '50 Mins',
    intensity: 'All Levels',
    schedule: 'Tue / Thu / Sat',
    trainer: 'Elena Rostova',
    exercises: [
      { name: 'Surya Namaskar (Sun Salutation A & B)', sets: '5 rounds', reps: 'Fluid flow', notes: 'Synchronize inhalations with upward expansion' },
      { name: 'Warrior II to Extended Side Angle', sets: '3', reps: '5 breaths / side', notes: 'Ground back heel and open pelvic girdle' },
      { name: 'Lizard Pose & Hip Opener', sets: '3', reps: '90s hold / side', notes: 'Release tight hip flexors and psoas' },
      { name: 'Crow Pose (Bakasana)', sets: '4', reps: '15-30s hold', notes: 'Gaze forward and engage deep lower abdominals' },
      { name: 'Reclined Spinal Twist & Savasana', sets: '1', reps: '5-8 mins', notes: 'Complete parasympathetic nervous system reboot' }
    ]
  },
  {
    id: 'cardio-hiit',
    title: 'Cardio & HIIT',
    category: 'cardio',
    description: 'From high-intensity interval training to martial arts, turn up the heat and boost your fitness for everything you want to do in life.',
    longDescription: 'High-octane metabolic conditioning that triggers the EPOC afterburn effect. Alternate between anaerobic sprint intervals, plyometric power bursts, and athletic agility drills that shred body fat while elevating VO2 max.',
    image: '/assets/img/img6.jpg',
    icon: '/assets/img/muscle.png',
    duration: '45 Mins',
    intensity: 'Intermediate',
    schedule: 'Mon / Tue / Thu / Sat',
    trainer: 'Zack Taylor',
    exercises: [
      { name: 'Assault Bike Sprint Intervals', sets: '8 rounds', reps: '20s max / 40s rest', notes: 'Target heart rate zone 4-5' },
      { name: 'Kettlebell Swings (Heavy Russian)', sets: '5', reps: '20 reps', notes: 'Explosive hip snap, zero lower back rounding' },
      { name: 'Plyometric Box Jump Overs', sets: '4', reps: '12 reps', notes: 'Soft landing, step down deliberately' },
      { name: 'Battle Rope Waves & Slams', sets: '4', reps: '30s on / 30s off', notes: 'Maintain athletic quarter squat stance' },
      { name: 'Burpee Broad Jumps', sets: '4', reps: '10 reps', notes: 'Maximum horizontal jump drive upon chest rebound' }
    ]
  },
  {
    id: 'functional-hypertrophy',
    title: 'Functional Hypertrophy',
    category: 'functional',
    description: 'Combines multi-planar movements with hypertrophy volume to forge a dense, athletic physique that performs as impressively as it looks.',
    longDescription: 'Bridge the gap between raw powerlifting and athletic agility. You will work with sleds, sandbags, rings, and unilateral dumbbell clusters to eliminate muscular imbalances and bulletproof your joints.',
    image: '/assets/img/img7.jpg',
    icon: '/assets/img/mark.png',
    duration: '55 Mins',
    intensity: 'Advanced',
    schedule: 'Tue / Thu / Sun',
    trainer: 'Marcus Vance',
    exercises: [
      { name: 'Heavy Prowler Sled Push & Drag', sets: '5', reps: '30 meters', notes: 'Drive through balls of feet with neutral spine' },
      { name: 'Bulgarian Split Squats (Dumbbells)', sets: '4', reps: '10 reps / leg', notes: 'Slight torso forward lean to maximize glute tension' },
      { name: 'Gymnastic Ring Dips', sets: '4', reps: '8-12 reps', notes: 'Turn rings out at top for peak triceps activation' },
      { name: 'Farmer Carry with Trap Bar', sets: '4', reps: '40 meters', notes: 'Shoulders retracted, upright posture, grip endurance' }
    ]
  },
  {
    id: 'endurance-conditioning',
    title: 'Power & Endurance',
    category: 'cardio',
    description: 'Sustain maximum athletic output across long durations with high-tempo rower, skierg, and functional circuit ladders.',
    longDescription: 'Designed for triathletes, combat athletes, and obstacle course competitors looking to elevate their lactic threshold and psychological toughness under physical fatigue.',
    image: '/assets/img/img8.jpg',
    icon: '/assets/img/dumbbell.png',
    duration: '50 Mins',
    intensity: 'Intermediate',
    schedule: 'Wed / Fri / Sun',
    trainer: 'Zack Taylor',
    exercises: [
      { name: 'Concept2 Rower 500m Repeats', sets: '5', reps: 'Sub 1:45 split pace', notes: 'Consistent stroke rate of 28-30 SPM' },
      { name: 'SkiErg Steady State Metcon', sets: '3', reps: '1000m each', notes: 'Engage lats and hip hinge with each pull' },
      { name: 'Wall Ball Shots (9kg / 20lb)', sets: '4', reps: '25 reps unbroken', notes: 'Full depth squat before targeting 10ft mark' }
    ]
  },
  {
    id: 'mobility-rehab',
    title: 'Mobility & Joint Rehab',
    category: 'yoga',
    description: 'Restore full rotational range of motion in thoracic spine, shoulders, and hips while correcting postural deficits.',
    longDescription: 'Ideal for desk-workers, recovering athletes, or heavy lifters with chronic stiffness. Utilizes Controlled Articular Rotations (CARs) and loaded end-range stretching.',
    image: '/assets/img/img9.jpg',
    icon: '/assets/img/yoga.png',
    duration: '40 Mins',
    intensity: 'All Levels',
    schedule: 'Mon / Wed / Sat',
    trainer: 'Elena Rostova',
    exercises: [
      { name: 'Thoracic Foam Rolling & Extensions', sets: '3', reps: '10 extensions', notes: 'Support neck, open thoracic spine segments' },
      { name: '90/90 Hip Internal/External Switches', sets: '4', reps: '8 reps / side', notes: 'Keep tall chest without placing hands on floor' },
      { name: 'Banded Shoulder Dislocates & Pull-Aparts', sets: '3', reps: '15 reps', notes: 'Slow tempo with light resistance band' }
    ]
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Head of Strength & Conditioning',
    experience: '12+ Years Coaching',
    specialty: ['Powerlifting', 'Hypertrophy Protocols', 'Olympic Weightlifting', 'Injury Prevention'],
    bio: 'Former national powerlifter and CSCS coach. Marcus has prepared collegiate athletes and busy executives to build bulletproof strength through precision biomechanics.',
    image: '/assets/img/img1.jpg',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Yoga Master & Mobility Specialist',
    experience: '9+ Years Coaching',
    specialty: ['Ashtanga & Vinyasa Flow', 'Postural Restoration', 'Myofascial Release', 'Breathwork & Mindfulness'],
    bio: 'Certified 500-hr RYT yoga instructor and kinesiology graduate. Elena brings mindful movement and restorative mobility to optimize athletic longevity.',
    image: '/assets/img/img2.jpg',
    availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: 'zack-taylor',
    name: 'Zack Taylor',
    role: 'HIIT & Performance Coach',
    experience: '8+ Years Coaching',
    specialty: ['Metabolic Conditioning', 'VO2 Max Training', 'Boxing & Agility', 'Body Recomposition'],
    bio: 'Certified NASM Master Trainer and combat conditioning specialist. Zack pushes you past perceived limitations with high-energy, scientifically calibrated intervals.',
    image: '/assets/img/img3.jpg',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'lemon-herb-grilled-salmon',
    title: 'Lemon Herb Grilled Salmon & Quinoa',
    mealType: 'Dinner',
    calories: 540,
    protein: 44,
    carbs: 38,
    fat: 22,
    prepTime: '25 Mins',
    description: 'Omega-3 rich wild salmon fillet glazed with fresh dill, lemon zest, garlic, served alongside warm fluffy quinoa and charred asparagus.',
    ingredients: [
      '200g Wild Alaskan Salmon Fillet',
      '1 cup Cooked Tricolor Quinoa',
      '12 Asparagus Spears',
      '1 tbsp Extra Virgin Olive Oil',
      '1 Lemon (Juiced & Zested)',
      '2 cloves Minced Garlic',
      'Fresh Dill, Sea Salt & Cracked Black Pepper'
    ],
    instructions: [
      'Whisk olive oil, lemon juice, zest, minced garlic, salt, and dill in a small bowl.',
      'Brush salmon fillet generously and marinate for 10 minutes at room temperature.',
      'Heat grill pan to medium-high. Sear salmon skin-side down for 4-5 mins until crisp, flip gently and cook 3 mins more.',
      'Grill asparagus spears for 4 minutes with a drizzle of olive oil.',
      'Plate on a warm bed of seasoned quinoa with grilled lemon wedges.'
    ],
    image: '/assets/img/nutri3.jpg'
  },
  {
    id: 'macro-chicken-sweet-potato-bowl',
    title: 'Cajun Chicken & Roasted Sweet Potato Bowl',
    mealType: 'Lunch',
    calories: 590,
    protein: 48,
    carbs: 62,
    fat: 14,
    prepTime: '30 Mins',
    description: 'Herb-roasted chicken breast dusted with smoky paprika and herbs, paired with caramelized sweet potato cubes, steamed broccoli, and avocado hummus.',
    ingredients: [
      '220g Lean Chicken Breast',
      '200g Diced Sweet Potatoes',
      '1.5 cups Fresh Broccoli Florets',
      '1 tbsp Avocado Oil',
      '1 tsp Smoked Paprika, Cumin, Oregano',
      '2 tbsp Tahini Garlic Dressing'
    ],
    instructions: [
      'Preheat oven to 200°C (400°F). Toss sweet potato cubes with avocado oil and seasonings.',
      'Roast sweet potatoes for 25 minutes until caramelized and tender with crispy edges.',
      'Season chicken breast with cajun spices; pan-sear in skillet for 6-7 mins per side until internal temp hits 75°C.',
      'Steam broccoli florets for 4 minutes until vibrant green with a tender crunch.',
      'Slice chicken across the grain, assemble in bowl, and drizzle with tahini dressing.'
    ],
    image: '/assets/img/nutri1.jpg'
  },
  {
    id: 'anabolic-berry-whey-parfait',
    title: 'Protein Chia & Greek Yogurt Berry Bowl',
    mealType: 'Breakfast',
    calories: 420,
    protein: 42,
    carbs: 34,
    fat: 11,
    prepTime: '10 Mins',
    description: 'Thick strained organic Greek yogurt layered with vanilla whey isolate, wild blueberries, antioxidant chia seeds, and raw almond slivers.',
    ingredients: [
      '250g 0% Fat Greek Yogurt',
      '1 Scoop (30g) Vanilla Isolate Whey Protein',
      '1 cup Fresh Blueberries and Raspberries',
      '1 tbsp Whole Chia Seeds',
      '15g Toasted Almond Slivers',
      '1 tsp Organic Raw Honey'
    ],
    instructions: [
      'In a wide mixing bowl, vigorously stir protein powder into Greek yogurt with a splash of almond milk until smooth and silky.',
      'Fold in half the chia seeds and transfer into serving parfait bowl.',
      'Top with fresh washed berries, remaining chia seeds, and toasted almonds for crunch.',
      'Finish with a light drizzle of honey before workout or post-training recovery.'
    ],
    image: '/assets/img/nutri2.jpg'
  }
];

export const CLASS_SCHEDULE: ClassSession[] = [
  { id: 'c1', day: 'Monday', time: '07:00 AM', title: 'Dawn Strength & Barbell', trainer: 'Marcus Vance', duration: '60 min', capacity: 16, enrolled: 12, location: 'Weight Hall A', category: 'strength' },
  { id: 'c2', day: 'Monday', time: '12:00 PM', title: 'Lunchtime HIIT Blast', trainer: 'Zack Taylor', duration: '45 min', capacity: 20, enrolled: 18, location: 'Functional Turf', category: 'cardio' },
  { id: 'c3', day: 'Monday', time: '06:00 PM', title: 'Hypertrophy Cluster', trainer: 'Marcus Vance', duration: '60 min', capacity: 15, enrolled: 15, location: 'Weight Hall A', category: 'strength' },
  { id: 'c4', day: 'Tuesday', time: '07:30 AM', title: 'Vinyasa Flow & Core', trainer: 'Elena Rostova', duration: '50 min', capacity: 18, enrolled: 9, location: 'Zen Studio 2', category: 'yoga' },
  { id: 'c5', day: 'Tuesday', time: '05:30 PM', title: 'Combat Cardio & Boxing', trainer: 'Zack Taylor', duration: '50 min', capacity: 20, enrolled: 14, location: 'Functional Turf', category: 'cardio' },
  { id: 'c6', day: 'Wednesday', time: '07:00 AM', title: 'Athletic Power Lifting', trainer: 'Marcus Vance', duration: '60 min', capacity: 14, enrolled: 10, location: 'Weight Hall A', category: 'strength' },
  { id: 'c7', day: 'Wednesday', time: '06:00 PM', title: 'High-Lactate Metcon', trainer: 'Zack Taylor', duration: '45 min', capacity: 22, enrolled: 19, location: 'Functional Turf', category: 'cardio' },
  { id: 'c8', day: 'Thursday', time: '08:00 AM', title: 'Spinal Mobility & CARs', trainer: 'Elena Rostova', duration: '45 min', capacity: 15, enrolled: 8, location: 'Zen Studio 2', category: 'yoga' },
  { id: 'c9', day: 'Thursday', time: '06:30 PM', title: 'Functional Sled & Strongman', trainer: 'Marcus Vance', duration: '60 min', capacity: 16, enrolled: 11, location: 'Outdoor Rig', category: 'functional' },
  { id: 'c10', day: 'Friday', time: '07:00 AM', title: 'Full Body Deadlift & Squat', trainer: 'Marcus Vance', duration: '60 min', capacity: 14, enrolled: 13, location: 'Weight Hall A', category: 'strength' },
  { id: 'c11', day: 'Friday', time: '05:30 PM', title: 'Friday Night Afterburn HIIT', trainer: 'Zack Taylor', duration: '45 min', capacity: 25, enrolled: 21, location: 'Functional Turf', category: 'cardio' },
  { id: 'c12', day: 'Saturday', time: '09:00 AM', title: 'Weekend Warrior Strongman', trainer: 'Marcus Vance', duration: '75 min', capacity: 20, enrolled: 17, location: 'Outdoor Rig', category: 'functional' },
  { id: 'c13', day: 'Saturday', time: '11:00 AM', title: 'Restorative Yin Yoga', trainer: 'Elena Rostova', duration: '60 min', capacity: 20, enrolled: 14, location: 'Zen Studio 2', category: 'yoga' },
  { id: 'c14', day: 'Sunday', time: '10:00 AM', title: 'Mobility & Recovery Flow', trainer: 'Elena Rostova', duration: '50 min', capacity: 18, enrolled: 10, location: 'Zen Studio 2', category: 'yoga' }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'starter',
    name: 'Day / Starter Pass',
    priceMonthly: 39,
    priceAnnual: 29,
    tagline: 'Ideal for independent lifters and seasonal athletes.',
    isPopular: false,
    features: [
      'Full open gym access during staffed hours',
      'Access to Olympic lifting platforms & cardio deck',
      'Lockers, luxury showers & towel service',
      'FitFlex mobile entry app'
    ],
    perks: ['Cancel anytime', 'No annual contract lock-in']
  },
  {
    id: 'black-elite',
    name: 'Black Card Elite',
    priceMonthly: 69,
    priceAnnual: 49,
    tagline: 'Our flagship membership with 24/7 keyless access & group classes.',
    isPopular: true,
    features: [
      'Unlimited 24/7/365 biometric facility access',
      'All 40+ weekly group fitness & HIIT classes included',
      'Finnish sauna & cold plunge therapy recovery suite',
      'Free monthly guest pass privileges',
      'InBody 570 body composition scan every 30 days',
      '15% discount at the FitFlex Fuel & Shake Bar'
    ],
    perks: ['Most Popular Choice', 'Free FitFlex Gym Bag upon signup']
  },
  {
    id: 'pro-performance',
    name: 'Pro Performance + PT',
    priceMonthly: 129,
    priceAnnual: 99,
    tagline: 'Comprehensive athletic transformation with dedicated coach guidance.',
    isPopular: false,
    features: [
      'Everything included in Black Card Elite',
      '2 Dedicated 1-on-1 personal training sessions/month',
      'Customized macronutrient meal plans & weekly diet audits',
      'Quarterly VO2 max and strength plateau assessments',
      'VIP priority locker & private laundry service',
      'Complimentary pre-workout and protein shake after each visit'
    ],
    perks: ['Dedicated Head Coach', 'Guaranteed Recomposition Results']
  }
];

export const TRANSFORMATIONS: TransformationStory[] = [
  {
    id: 't1',
    name: 'David K., 34',
    timeframe: '6 Months',
    achievement: '-16kg Fat · +35kg Squat PR',
    quote: 'FitFlex changed my life. I went from chronic lower back pain and fatigue to lifting heavy with absolute confidence. Marcus rebuilt my squat form from the ground up.',
    program: 'Strength Training + Nutrition Guide',
    trainer: 'Marcus Vance',
    image: '/assets/img/img7.jpg'
  },
  {
    id: 't2',
    name: 'Sarah M., 29',
    timeframe: '4 Months',
    achievement: '-9% Body Fat · Completed 1st Half Marathon',
    quote: 'The metabolic conditioning and HIIT classes under Zack gave me an athletic engine I never knew I had. Plus the community keeps you accountable every single dawn.',
    program: 'Cardio & HIIT Conditioning',
    trainer: 'Zack Taylor',
    image: '/assets/img/img8.jpg'
  },
  {
    id: 't3',
    name: 'Karim B., 42',
    timeframe: '8 Months',
    achievement: 'Full Shoulder Mobility Rehab · +12kg Lean Mass',
    quote: 'Combining Elena’s mobility work with functional powerlifting restored my shoulder after an old dislocation. I am stronger and more pain-free in my forties than in my twenties.',
    program: 'Functional Hypertrophy & Mobility',
    trainer: 'Elena Rostova',
    image: '/assets/img/img9.jpg'
  }
];

export const FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'barbell-hall',
    name: 'Olympic Barbell & Power Racks',
    tagline: 'Competition-Grade Heavy Iron',
    description: '10 custom power cages equipped with Eleiko competition bars, bumper plates, deadlift drop platforms, and monolifts.',
    equipment: ['Eleiko IPF Spec Barbells', 'Calibrated Steel Plates', 'Band Pegs & Chains', 'Belt Squat Rigs'],
    image: '/assets/img/img4.jpg'
  },
  {
    id: 'functional-turf',
    name: 'Metabolic Turf & Sled Track',
    tagline: '40-Meter High-Traction Sprint Lane',
    description: 'Designed for prowler sled pushes, tire flips, farmer carries, battle ropes, and explosive deceleration drills.',
    equipment: ['Heavy Prowler Sleds', 'Rogue Echo Bikes', 'Concept2 SkiErgs', 'Dumbbells up to 60kg'],
    image: '/assets/img/img6.jpg'
  },
  {
    id: 'recovery-suite',
    name: 'Contrast Therapy & Zen Studio',
    tagline: 'Infrared Heat & 4°C Cold Plunge',
    description: 'Accelerate muscular repair and reduce inflammatory markers with our temperature-controlled cold plunges and cedar wood Finnish saunas.',
    equipment: ['Cedar Wood Sauna', 'Sub-Zero Cold Plunge', 'Normatec Compression Boots', 'Foam Rollers & Theraguns'],
    image: '/assets/img/img5.jpg'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    category: 'membership',
    question: 'How does 24/7 facility access work?',
    answer: 'Black Card Elite and Pro Performance members receive a digital Bluetooth NFC pass in the FitFlex web app or physical RFID keycard. Front doors and turnstiles unlock 24/7/365 with continuous security surveillance.'
  },
  {
    id: 'f2',
    category: 'membership',
    question: 'Can I freeze or cancel my membership?',
    answer: 'Yes! FitFlex believes in honest fitness with zero lock-in traps. You can pause your membership for up to 60 days per calendar year or cancel anytime with 14 days written notice via email or our contact form.'
  },
  {
    id: 'f3',
    category: 'training',
    question: 'Are group classes suitable for total beginners?',
    answer: 'Absolutely. Every class session has certified instructors who provide scaled regressions and modifications for beginners as well as advanced progressions for seasoned lifters.'
  },
  {
    id: 'f4',
    category: 'facility',
    question: 'What amenities and locker facilities are included?',
    answer: 'We provide spacious private locker suites, rainfall showers, Malin+Goetz grooming amenities, fresh towel service, steam rooms, and complimentary filtered hydration stations.'
  },
  {
    id: 'f5',
    category: 'nutrition',
    question: 'How do the tailored nutrition guides work?',
    answer: 'Upon registering, you complete a 10-minute metabolic survey. Our sports dietitian constructs an exact macronutrient blueprint with meal plans tailored to your food preferences, cooking time, and training schedule.'
  }
];

export const COACH_AVAILABILITIES: CoachAvailability[] = [
  {
    id: 'coach-marcus',
    trainerId: 'marcus-vance',
    trainerName: 'Marcus Vance',
    avatar: '/assets/img/img1.jpg',
    role: 'Head of Strength & Biomechanics',
    certifications: ['CSCS Certified', 'USAW Level 2 Coach', 'Ex-Powerlifting Champion'],
    bio: 'Specializing in barbell mechanics, CNS power output, and heavy progressive overload. Marcus has engineered over 1,400 physical breakthroughs.',
    rating: 4.98,
    reviewsCount: 184,
    sessionsCompleted: 1420,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['07:00 AM', '09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
    location: 'Olympic Weightlifting Deck & Power Racks',
    pricePerSession: 95,
    status: 'available',
  },
  {
    id: 'coach-elena',
    trainerId: 'elena-rostova',
    trainerName: 'Elena Rostova',
    avatar: '/assets/img/img2.jpg',
    role: 'Yoga Master & Mobility Specialist',
    certifications: ['500-HR RYT Yoga Alliance', 'FRCms Mobility Specialist', 'BSc Kinesiology'],
    bio: 'Restoring joint integrity, hip mobility, and spinal decompression. Elena equips heavy lifters and athletes with rotational freedom and longevity.',
    rating: 4.95,
    reviewsCount: 142,
    sessionsCompleted: 980,
    availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    timeSlots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:30 PM', '05:30 PM'],
    location: 'Zen Mind & Mobility Studio (Zone 4)',
    pricePerSession: 85,
    status: 'available',
  },
  {
    id: 'coach-zack',
    trainerId: 'zack-taylor',
    trainerName: 'Zack Taylor',
    avatar: '/assets/img/img3.jpg',
    role: 'Metabolic Conditioning & Combat Agility',
    certifications: ['NASM Master Trainer', 'Golden Gloves Finalist', 'Precision Nutrition Level 1'],
    bio: 'Pushing your anaerobic threshold with combat pad work, high-speed kettlebell complexes, and lactate-clearing VO2 max intervals.',
    rating: 4.92,
    reviewsCount: 165,
    sessionsCompleted: 1120,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: ['06:30 AM', '08:30 AM', '12:00 PM', '05:00 PM', '07:00 PM'],
    location: 'Turf Sprint Lane & Combat Zone',
    pricePerSession: 90,
    status: 'limited',
  },
  {
    id: 'coach-maya',
    trainerId: 'maya-lindqvist',
    trainerName: 'Maya Lindqvist',
    avatar: '/assets/img/img6.jpg',
    role: 'Olympic Weightlifting & Explosive Speed',
    certifications: ['USAW Senior Coach', 'MSc Exercise Science', 'CrossFit Level 3'],
    bio: 'Precision snatch and clean & jerk coaching. Maya focuses on bar path trajectory, ankle mobility, and explosive triple extension.',
    rating: 4.97,
    reviewsCount: 118,
    sessionsCompleted: 750,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['07:30 AM', '09:30 AM', '01:30 PM', '04:00 PM', '06:30 PM'],
    location: 'Eleiko Competition Weightlifting Area',
    pricePerSession: 100,
    status: 'available',
  },
  {
    id: 'coach-darius',
    trainerId: 'darius-cole',
    trainerName: 'Dr. Darius Cole',
    avatar: '/assets/img/img7.jpg',
    role: 'Post-Rehab & Biomechanical Restoration',
    certifications: ['Doctor of Physical Therapy (DPT)', 'CSCS Strength Specialist', 'PRI Postural Restoration'],
    bio: 'Bridging physical therapy and maximal athletic output. Darius works with members recovering from disc bulges, ACL surgeries, and shoulder impingements.',
    rating: 4.99,
    reviewsCount: 210,
    sessionsCompleted: 1600,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['09:00 AM', '11:00 AM', '02:30 PM', '04:30 PM'],
    location: 'Private Assessment Lab & Functional Rig',
    pricePerSession: 115,
    status: 'available',
  },
  {
    id: 'coach-soraya',
    trainerId: 'soraya-bensalem',
    trainerName: 'Soraya Bensalem',
    avatar: '/assets/img/img8.jpg',
    role: 'Female Hypertrophy & Pre/Post-Natal Fitness',
    certifications: ['ACE Certified Personal Trainer', 'PN-1 Sports Nutrition', 'Pre/Post-Natal Specialist'],
    bio: 'Empowering women with evidence-based glute hypertrophy, core reconnection, and sensible metabolic conditioning.',
    rating: 4.96,
    reviewsCount: 130,
    sessionsCompleted: 890,
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Sunday'],
    timeSlots: ['08:00 AM', '10:30 AM', '01:00 PM', '05:00 PM'],
    location: 'Glute Lab & Free Weights Area',
    pricePerSession: 85,
    status: 'available',
  },
];
