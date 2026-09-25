export type Category = "documents" | "technology" | "study" | "room" | "wellbeing" | "finance";

export type Essential = {
  id: string;
  name: string;
  category: Category;
  /** Short, human reason shown next to a recommendation. */
  reason: string;
  /** Approximate price in naira, used for budget-aware ordering. */
  price: number;
};

export const categoryLabels: Record<Category, string> = {
  documents: "Documents",
  technology: "Technology",
  study: "Study",
  room: "Room",
  wellbeing: "Wellbeing",
  finance: "Finance",
};

export const essentials: Essential[] = [
  { id: "admission-letter", name: "Admission letter", category: "documents", reason: "Required at every clearance desk.", price: 0 },
  { id: "passport-photos", name: "Passport photographs", category: "documents", reason: "Registration, ID card and medicals all ask for them.", price: 2000 },
  { id: "document-wallet", name: "Document wallet", category: "documents", reason: "Keeps originals flat, dry and together.", price: 6000 },
  { id: "laptop", name: "Laptop", category: "technology", reason: "Assignments, portals and research.", price: 450000 },
  { id: "laptop-sleeve", name: "Laptop sleeve", category: "technology", reason: "Protects the most expensive thing you carry.", price: 12000 },
  { id: "extension-cord", name: "Surge-protected extension cord", category: "technology", reason: "Shared rooms rarely have enough sockets.", price: 15000 },
  { id: "power-bank", name: "Power bank", category: "technology", reason: "Long days, unpredictable power.", price: 25000 },
  { id: "ethernet-cable", name: "Ethernet cable", category: "technology", reason: "Wired internet is faster when Wi-Fi is crowded.", price: 5000 },
  { id: "usb-drive", name: "USB drive", category: "technology", reason: "Printing shops still prefer them.", price: 7000 },
  { id: "headphones", name: "Headphones", category: "technology", reason: "Focus in busy rooms and libraries.", price: 30000 },
  { id: "travel-adapter", name: "Universal travel adapter", category: "technology", reason: "Different country, different sockets.", price: 10000 },
  { id: "calculator", name: "Scientific calculator", category: "study", reason: "Allowed in exams where phones are not.", price: 18000 },
  { id: "notebooks", name: "Notebooks (×4)", category: "study", reason: "One per course keeps notes findable.", price: 6000 },
  { id: "planner", name: "Semester planner", category: "study", reason: "Every deadline in one place.", price: 9000 },
  { id: "drawing-kit", name: "Drawing kit & scale rule", category: "study", reason: "Studio work starts in week one.", price: 22000 },
  { id: "lab-coat", name: "Lab coat", category: "study", reason: "Required for practical sessions.", price: 12000 },
  { id: "stethoscope", name: "Stethoscope", category: "study", reason: "Clinical skills begin sooner than you think.", price: 35000 },
  { id: "legal-dictionary", name: "Legal dictionary", category: "study", reason: "The vocabulary of your first year.", price: 15000 },
  { id: "padlock", name: "Padlock", category: "room", reason: "Lockers, wardrobes and peace of mind.", price: 4000 },
  { id: "laundry-basket", name: "Laundry basket", category: "room", reason: "Shared rooms stay calmer with a system.", price: 7000 },
  { id: "bedding", name: "Bedding set", category: "room", reason: "Hostel mattresses arrive bare.", price: 20000 },
  { id: "desk-lamp", name: "Rechargeable desk lamp", category: "room", reason: "Study continues when the lights go out.", price: 14000 },
  { id: "storage-box", name: "Under-bed storage", category: "room", reason: "Doubles the space in a small room.", price: 10000 },
  { id: "bucket", name: "Bucket & bowl", category: "room", reason: "Useful in every hostel.", price: 5000 },
  { id: "water-bottle", name: "Water bottle", category: "wellbeing", reason: "Long walks between lectures.", price: 8000 },
  { id: "first-aid", name: "Personal first-aid kit", category: "wellbeing", reason: "Plasters and painkillers at 11pm.", price: 8000 },
  { id: "bank-account", name: "Student bank account", category: "finance", reason: "Receive allowances and pay fees safely.", price: 0 },
];

export const getEssential = (id: string) => essentials.find((e) => e.id === id)!;
