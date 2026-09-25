export type Collection = {
  id: string;
  title: string;
  for: string;
  statement: string;
  items: string[];
  pieces: number;
  tone: [string, string];
};

export const collections: Collection[] = [
  {
    id: "first-year",
    title: "First-Year Essentials",
    for: "Every student",
    statement: "The quiet foundation. Everything a first week asks of you, and nothing it doesn't.",
    items: ["Document wallet", "Semester planner", "Extension cord", "Padlock", "Water bottle", "Desk lamp"],
    pieces: 18,
    tone: ["#F1F5F9", "#DCEEFF"],
  },
  {
    id: "engineering",
    title: "Engineering Starter",
    for: "Engineering & Physical Sciences",
    statement: "Precision tools for the discipline of building things that last.",
    items: ["Scientific calculator", "Drawing set", "Graph notebooks", "Mechanical pencils", "Laptop sleeve"],
    pieces: 14,
    tone: ["#EEF0F2", "#D5DCE3"],
  },
  {
    id: "medical",
    title: "Medical Student Preparation",
    for: "Medicine, Nursing & Pharmacy",
    statement: "For long days, early practicals and a profession built on care.",
    items: ["Lab coat", "Stethoscope", "Anatomy notebook", "Comfortable shoes", "Water bottle"],
    pieces: 12,
    tone: ["#EFF5F3", "#D4E6E0"],
  },
  {
    id: "architecture",
    title: "Architecture Studio Kit",
    for: "Architecture & Design",
    statement: "Studio culture begins in week one. Arrive with the tools to think with your hands.",
    items: ["Scale rule", "Drafting pens", "Cutting mat", "A3 sketchbook", "Portfolio case"],
    pieces: 16,
    tone: ["#F3F1EC", "#E3DDD1"],
  },
  {
    id: "law",
    title: "Law School Preparation",
    for: "Law",
    statement: "Reading, reasoning and writing — supported by the right materials from the first brief.",
    items: ["Legal dictionary", "Case notebooks", "Highlighters", "Document wallet", "Formal wear checklist"],
    pieces: 11,
    tone: ["#F2F2F4", "#DCDDE4"],
  },
];
