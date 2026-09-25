import type { Category, CategoryId } from "./types";

export const categories: Category[] = [
  {
    id: "academic-systems",
    slug: "academic-systems",
    name: "Academic Systems",
    summary: "Semesters, assignments, exams and grades — organised.",
    statement: "The foundation of a calm semester: one place for every course, deadline and result.",
    order: 1,
  },
  {
    id: "study-systems",
    slug: "study-systems",
    name: "Study Systems",
    summary: "Plan study time, revise with intent, keep notes findable.",
    statement: "Study that follows a plan feels lighter. These systems give every session a purpose.",
    order: 2,
  },
  {
    id: "university-life",
    slug: "university-life",
    name: "University Life",
    summary: "Money, routines and the life around your lectures.",
    statement: "University is more than coursework. Keep the rest of life as organised as your timetable.",
    order: 3,
  },
  {
    id: "career-opportunities",
    slug: "career-opportunities",
    name: "Career & Opportunities",
    summary: "Internships, scholarships and competitions, tracked.",
    statement: "Opportunities reward the students who keep track of them. Never miss a deadline that matters.",
    order: 4,
  },
  {
    id: "career-kits",
    slug: "career-kits",
    name: "Career Kits",
    summary: "CVs, portfolios and presentations, ready to adapt.",
    statement: "Present yourself with the same care you put into your work.",
    order: 5,
  },
  {
    id: "mini-templates",
    slug: "mini-templates",
    name: "Mini Templates",
    summary: "Single-purpose templates for one job, done well.",
    statement: "Small, focused templates for when you need exactly one thing.",
    order: 6,
  },
  {
    id: "bundles",
    slug: "bundles",
    name: "Bundles",
    summary: "Complete sets, assembled around a stage of student life.",
    statement: "Everything for one chapter of student life, designed to work together.",
    order: 7,
  },
];

export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
