import type { Category, CategoryId } from "./types";

export const categories: Category[] = [
  {
    id: "academic-systems",
    slug: "academic-systems",
    name: "Academic Systems",
    summary: "Semesters, assignments, exams and grades — organised.",
    statement: "The foundation of a calm semester: one place for every course, deadline and result.",
    order: 1,
    tone: ["#eef1ec", "#dbe5da"],
  },
  {
    id: "study-systems",
    slug: "study-systems",
    name: "Study Systems",
    summary: "Plan study time, revise with intent, keep notes findable.",
    statement: "Study that follows a plan feels lighter. These systems give every session a purpose.",
    order: 2,
    tone: ["#f2f0ea", "#e3ddd0"],
  },
  {
    id: "university-life",
    slug: "university-life",
    name: "University Life",
    summary: "Money, routines and the life around your lectures.",
    statement: "University is more than coursework. Keep the rest of life as organised as your timetable.",
    order: 3,
    tone: ["#eef1f2", "#d9e0e3"],
  },
  {
    id: "career-opportunities",
    slug: "career-opportunities",
    name: "Career & Opportunities",
    summary: "Internships, scholarships and competitions, tracked.",
    statement: "Opportunities reward the students who keep track of them. Never miss a deadline that matters.",
    order: 4,
    tone: ["#f3f0ea", "#e7dfd2"],
  },
  {
    id: "career-kits",
    slug: "career-kits",
    name: "Career Kits",
    summary: "CVs, portfolios and presentations, ready to adapt.",
    statement: "Present yourself with the same care you put into your work.",
    order: 5,
    tone: ["#f0f0f0", "#dedfe1"],
  },
  {
    id: "mini-templates",
    slug: "mini-templates",
    name: "Mini Templates",
    summary: "Single-purpose templates for one job, done well.",
    statement: "Small, focused templates for when you need exactly one thing.",
    order: 6,
    tone: ["#f4f3ef", "#e7e4dc"],
  },
  {
    id: "bundles",
    slug: "bundles",
    name: "Bundles",
    summary: "Complete sets, assembled around a stage of student life.",
    statement: "Everything for one chapter of student life, designed to work together.",
    order: 7,
    tone: ["#e8efe8", "#cddccf"],
  },
];

export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
