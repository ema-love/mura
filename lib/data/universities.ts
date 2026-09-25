export type CampusZone = {
  label: string;
  kind: "academic" | "residence" | "library" | "health" | "sport" | "gate" | "social";
  /** Position on a 100 × 64 abstract campus plan. */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type University = {
  id: string;
  short: string;
  name: string;
  city: string;
  established: number;
  /** Two-stop gradient used for the architectural card art. */
  tone: [string, string];
  /** Architectural motif drawn on the card. */
  motif: "arches" | "columns" | "tower" | "grid" | "steps" | "terraces";
  guide: string;
  hostel: { summary: string; notes: string[] };
  packing: string[];
  tips: string[];
  stores: { name: string; note: string }[];
  medical: string[];
  departments: string[];
  communities: { name: string; note: string }[];
  map: CampusZone[];
};

export const universities: University[] = [
  {
    id: "unilag",
    short: "UNILAG",
    name: "University of Lagos",
    city: "Akoka, Lagos",
    established: 1962,
    tone: ["#E6EEF6", "#C9D9EA"],
    motif: "tower",
    guide:
      "A lagoon-front campus in the middle of a city that never slows down. Expect crowded mornings, fast-moving registration, and a first week that rewards students who arrive with documents already sorted.",
    hostel: {
      summary: "Hall allocation is competitive and handled online. Many first-years share rooms of four.",
      notes: [
        "Apply for accommodation the moment the portal opens.",
        "Rooms are compact — prioritise vertical storage.",
        "Power can be intermittent; a rechargeable lamp earns its place.",
      ],
    },
    packing: ["Rechargeable desk lamp", "Extension cord with surge protection", "Compact fan", "Padlock (×2)", "Umbrella", "Laundry basket"],
    tips: [
      "Leave for early lectures before traffic builds on Herbert Macaulay Way.",
      "Keep printed and digital copies of every clearance document.",
      "The library fills quickly during exams — find your quiet corner in week one.",
    ],
    stores: [
      { name: "Yaba Market", note: "Bedding, buckets and everyday essentials" },
      { name: "Computer Village, Ikeja", note: "Laptop accessories and repairs" },
      { name: "Sabo, Yaba", note: "Stationery and printing" },
    ],
    medical: ["Medical examination at the University Health Service", "Recent passport photographs", "Immunisation record, if available"],
    departments: ["Engineering", "Medicine", "Law", "Mass Communication", "Architecture", "Sciences"],
    communities: [
      { name: "Freshers orientation week", note: "Faculty-led welcome sessions" },
      { name: "Departmental associations", note: "The fastest way to find past questions" },
    ],
    map: [
      { label: "Gate", kind: "gate", x: 4, y: 26, w: 10, h: 10 },
      { label: "Senate", kind: "academic", x: 20, y: 10, w: 18, h: 16 },
      { label: "Library", kind: "library", x: 42, y: 8, w: 16, h: 14 },
      { label: "Faculties", kind: "academic", x: 20, y: 32, w: 30, h: 16 },
      { label: "Halls", kind: "residence", x: 62, y: 10, w: 22, h: 24 },
      { label: "Health", kind: "health", x: 56, y: 40, w: 12, h: 10 },
      { label: "Sports", kind: "sport", x: 72, y: 40, w: 22, h: 18 },
      { label: "Lagoon front", kind: "social", x: 20, y: 52, w: 30, h: 8 },
    ],
  },
  {
    id: "covenant",
    short: "Covenant",
    name: "Covenant University",
    city: "Ota, Ogun State",
    established: 2002,
    tone: ["#ECEFF3", "#D3DCE6"],
    motif: "columns",
    guide:
      "A fully residential campus with a structured rhythm: set schedules, a formal dress code and a strong sense of order. Preparation here is about fitting in quickly to a well-defined way of living.",
    hostel: {
      summary: "On-campus residence is expected for undergraduates, with halls organised by gender.",
      notes: [
        "Review the residence handbook before packing — some appliances are restricted.",
        "Formal wear is worn most weekdays; plan outfits for a full week.",
        "Label everything. Laundry rooms are shared.",
      ],
    },
    packing: ["Formal shirts and trousers / skirts", "Dark formal shoes", "Iron (if permitted)", "Garment bag", "Bedside organiser", "Name labels"],
    tips: [
      "Study the dress code in detail — it is enforced from day one.",
      "Chapel and lecture timetables fill the week; a planner is essential.",
      "Arrive a day early to settle in before resumption activities.",
    ],
    stores: [
      { name: "Campus shopping complex", note: "Toiletries and stationery" },
      { name: "Ota town", note: "Household basics" },
    ],
    medical: ["Medical screening at the University Health Centre", "Medical history form", "Passport photographs"],
    departments: ["Engineering", "Computer Science", "Architecture", "Business", "Mass Communication", "Law"],
    communities: [
      { name: "Hall fellowships", note: "Community within your residence" },
      { name: "Student leadership forums", note: "Where many first friendships begin" },
    ],
    map: [
      { label: "Gate", kind: "gate", x: 4, y: 28, w: 10, h: 10 },
      { label: "Chapel", kind: "social", x: 38, y: 6, w: 24, h: 16 },
      { label: "Colleges", kind: "academic", x: 18, y: 26, w: 28, h: 16 },
      { label: "Library", kind: "library", x: 50, y: 26, w: 14, h: 14 },
      { label: "Halls", kind: "residence", x: 68, y: 8, w: 26, h: 28 },
      { label: "Health", kind: "health", x: 20, y: 48, w: 12, h: 10 },
      { label: "Sports", kind: "sport", x: 58, y: 44, w: 30, h: 16 },
    ],
  },
  {
    id: "oau",
    short: "OAU",
    name: "Obafemi Awolowo University",
    city: "Ile-Ife, Osun State",
    established: 1962,
    tone: ["#EDEAE4", "#D9D1C4"],
    motif: "terraces",
    guide:
      "One of the most architecturally celebrated campuses on the continent, set across a vast landscape. Distances are real: comfortable shoes and a reliable daily plan will matter more than you expect.",
    hostel: {
      summary: "A mix of on-campus halls and off-campus lodges in nearby neighbourhoods.",
      notes: [
        "If you go off-campus, visit the lodge in person before paying.",
        "Budget for daily transport if you live far from your faculty.",
        "Water storage containers are useful in many lodges.",
      ],
    },
    packing: ["Comfortable walking shoes", "Water containers", "Rechargeable fan", "Rain jacket", "Reusable water bottle", "Mosquito net"],
    tips: [
      "Walk your lecture routes before classes begin — the campus is large.",
      "Keep a small cash reserve for campus shuttles.",
      "Join your departmental group chat early for timetable changes.",
    ],
    stores: [
      { name: "Mayfair, Ile-Ife", note: "Groceries and household items" },
      { name: "Campus bookshop", note: "Course texts and stationery" },
    ],
    medical: ["Health centre registration", "Medical fitness certificate", "Passport photographs"],
    departments: ["Architecture", "Medicine", "Law", "Engineering", "Pharmacy", "Arts"],
    communities: [
      { name: "Faculty welcome events", note: "Your first map of the campus" },
      { name: "Hall associations", note: "Traditions that go back decades" },
    ],
    map: [
      { label: "Gate", kind: "gate", x: 4, y: 40, w: 10, h: 10 },
      { label: "Amphitheatre", kind: "social", x: 30, y: 26, w: 20, h: 12 },
      { label: "Faculties", kind: "academic", x: 18, y: 6, w: 34, h: 16 },
      { label: "Library", kind: "library", x: 56, y: 8, w: 14, h: 14 },
      { label: "Halls", kind: "residence", x: 72, y: 6, w: 22, h: 30 },
      { label: "Health", kind: "health", x: 56, y: 30, w: 12, h: 10 },
      { label: "Sports", kind: "sport", x: 30, y: 44, w: 34, h: 16 },
    ],
  },
  {
    id: "abu",
    short: "ABU",
    name: "Ahmadu Bello University",
    city: "Zaria, Kaduna State",
    established: 1962,
    tone: ["#EEEDE8", "#DAD7CC"],
    motif: "arches",
    guide:
      "A large, historic university with a dry-season climate that shapes daily life. The main campus is spread out, and harmattan months call for different preparation than the rains.",
    hostel: {
      summary: "Halls on the main campus, with high demand in the first weeks of the session.",
      notes: [
        "Pack for both heat and harmattan — layers are essential.",
        "A good lip balm and moisturiser matter during dry months.",
        "Keep a torch within reach at night.",
      ],
    },
    packing: ["Light layers and a warm jumper", "Moisturiser and lip balm", "Dust-proof storage box", "Torch", "Water bottle", "Bedsheets (×2)"],
    tips: [
      "Stay hydrated — carry water between lectures.",
      "Register courses early; portals are busiest in week two.",
      "Explore the campus by faculty cluster, not all at once.",
    ],
    stores: [
      { name: "Samaru Market", note: "Everyday essentials close to campus" },
      { name: "Zaria city", note: "Textiles and household goods" },
    ],
    medical: ["Medical examination at the university clinic", "Blood group and genotype results", "Passport photographs"],
    departments: ["Agriculture", "Engineering", "Medicine", "Environmental Design", "Law", "Sciences"],
    communities: [
      { name: "State and faculty associations", note: "Familiar faces far from home" },
      { name: "Freshers orientation", note: "Campus tours and registration help" },
    ],
    map: [
      { label: "Gate", kind: "gate", x: 4, y: 20, w: 10, h: 10 },
      { label: "Senate", kind: "academic", x: 18, y: 6, w: 20, h: 14 },
      { label: "Library", kind: "library", x: 42, y: 6, w: 16, h: 14 },
      { label: "Faculties", kind: "academic", x: 18, y: 26, w: 40, h: 14 },
      { label: "Halls", kind: "residence", x: 64, y: 6, w: 30, h: 22 },
      { label: "Clinic", kind: "health", x: 64, y: 34, w: 12, h: 10 },
      { label: "Sports", kind: "sport", x: 18, y: 46, w: 40, h: 14 },
    ],
  },
  {
    id: "babcock",
    short: "Babcock",
    name: "Babcock University",
    city: "Ilishan-Remo, Ogun State",
    established: 1959,
    tone: ["#EAF0EC", "#CFDDD3"],
    motif: "steps",
    guide:
      "A green, residential campus with a calm pace and a clear code of conduct. Days follow a steady schedule, and a well-organised room makes that rhythm easy to keep.",
    hostel: {
      summary: "Residential halls with room inspections and shared facilities.",
      notes: [
        "Read the student handbook — it lists permitted items.",
        "Storage boxes help keep rooms inspection-ready.",
        "Campus dining follows a vegetarian menu.",
      ],
    },
    packing: ["Under-bed storage boxes", "Formal outfits", "Bedding set", "Desk organiser", "Plant-based snacks", "Laundry bag"],
    tips: [
      "Build a weekly routine around worship and lecture times.",
      "Keep your room tidy daily — inspections can be unannounced.",
      "Use the quiet evenings for reading ahead.",
    ],
    stores: [
      { name: "Campus stores", note: "Daily essentials" },
      { name: "Ilishan town", note: "Household items" },
    ],
    medical: ["Medical screening at the university health services", "Medical history form", "Passport photographs"],
    departments: ["Medicine", "Nursing", "Law", "Computing", "Business", "Communication"],
    communities: [
      { name: "Residence hall councils", note: "Structure and support" },
      { name: "Service clubs", note: "Community outreach from week one" },
    ],
    map: [
      { label: "Gate", kind: "gate", x: 4, y: 30, w: 10, h: 10 },
      { label: "Pioneer Chapel", kind: "social", x: 20, y: 6, w: 20, h: 14 },
      { label: "Schools", kind: "academic", x: 44, y: 6, w: 28, h: 16 },
      { label: "Library", kind: "library", x: 20, y: 26, w: 16, h: 12 },
      { label: "Halls", kind: "residence", x: 40, y: 28, w: 32, h: 16 },
      { label: "Hospital", kind: "health", x: 76, y: 8, w: 18, h: 14 },
      { label: "Sports", kind: "sport", x: 20, y: 46, w: 52, h: 14 },
    ],
  },
  {
    id: "alu",
    short: "ALU",
    name: "African Leadership University",
    city: "Kigali, Rwanda",
    established: 2015,
    tone: ["#E4EEF7", "#C4D8EC"],
    motif: "grid",
    guide:
      "A modern, mission-driven university where learning is self-directed and collaborative. You will need strong digital habits, a dependable laptop and the confidence to own your schedule from day one.",
    hostel: {
      summary: "Students typically arrange housing in the city, with guidance and partner options from the university.",
      notes: [
        "Confirm your housing before you travel.",
        "Kigali evenings are cooler — pack a light jacket.",
        "A universal travel adapter is essential for international students.",
      ],
    },
    packing: ["Reliable laptop", "Universal travel adapter", "Noise-cancelling headphones", "Light jacket", "Portable power bank", "Reusable water bottle"],
    tips: [
      "Set up your learning platform accounts before orientation.",
      "Mission-based learning rewards early, clear goal-setting.",
      "Keep digital copies of your passport, visa and admission letter.",
    ],
    stores: [
      { name: "Kigali Heights", note: "Electronics and everyday essentials" },
      { name: "Kimironko Market", note: "Fabric, produce and household goods" },
    ],
    medical: ["Health insurance valid in Rwanda", "Yellow fever vaccination certificate, if required for your route", "Personal medical records"],
    departments: ["Software Engineering", "Entrepreneurial Leadership", "International Business", "Global Challenges"],
    communities: [
      { name: "Orientation cohort", note: "Your first team at ALU" },
      { name: "Student-led clubs", note: "Start one or join one" },
    ],
    map: [
      { label: "Entrance", kind: "gate", x: 4, y: 26, w: 10, h: 10 },
      { label: "Learning studios", kind: "academic", x: 18, y: 6, w: 34, h: 18 },
      { label: "Library", kind: "library", x: 56, y: 6, w: 16, h: 14 },
      { label: "Commons", kind: "social", x: 18, y: 30, w: 24, h: 14 },
      { label: "Residences", kind: "residence", x: 46, y: 28, w: 26, h: 16 },
      { label: "Wellness", kind: "health", x: 76, y: 6, w: 18, h: 14 },
      { label: "Courts", kind: "sport", x: 76, y: 26, w: 18, h: 18 },
    ],
  },
];

export const getUniversity = (id: string) => universities.find((u) => u.id === id);
