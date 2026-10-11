// Source: MFKNBS Activities & Events portal (https://mfknbs-events.vercel.app).
// The portal is the full, always-updated record; this file holds the highlights shown on this site.

export const eventsPortal = {
  url: "https://mfknbs-events.vercel.app/",
  name: "MFKNBS Activities & Events",
};

export interface Milestone {
  title: string;
  category: string;
  date: string;
  text?: string;
}

export const milestones: Milestone[] = [
  {
    title: "3rd International Conference on Sustainable Business Development (ICSB-2025)",
    category: "Conference",
    date: "18–19 December 2025",
    text: "Two days on climate change, renewable energy, data science and SME entrepreneurship with scholars from the UK, Malaysia, Hong Kong and Qatar.",
  },
  {
    title: "NBEAC Accreditation Approved",
    category: "Accreditation",
    date: "26 February 2025",
    text: "Business programs accredited by the National Business Education Accreditation Council.",
  },
  {
    title: "Dr. Naseer Abbas Khan among the world's top 2% researchers",
    category: "Faculty achievement",
    date: "28 September 2025",
  },
  {
    title: "HEC NRPU 2025 research grants",
    category: "Research",
    date: "27 June 2025",
  },
  {
    title: "MoU with Hailey College of Commerce, University of the Punjab",
    category: "Partnership",
    date: "8 January 2026",
  },
];

export const recent: Milestone[] = [
  {
    title: "Session: Entrepreneurship in the Digital Era",
    category: "Seminar",
    date: "30 September 2026",
    text: "Mr. Khawaja Mohsin Mehdi on digital entrepreneurship, organized with the University Alumni Office.",
  },
  {
    title: "Tamgha-e-Imtiaz conferred on alumnus Tahir Naweed",
    category: "Alumni",
    date: "23 May 2026",
    text: "The school celebrates its alumnus (Batch 2011–2013) receiving the National Civil Award 2025.",
  },
  {
    title: "MoU with WALEE Financial Services",
    category: "Partnership",
    date: "15 May 2026",
    text: "Extending industry links into finance and fintech: internships, skills sessions and placements.",
  },
];

export const partners = [
  { name: "Sargodha Chamber of Small Traders & Small Industries", year: 2024 },
  { name: "University of Chakwal", year: 2024 },
  { name: "Hailey College of Commerce, University of the Punjab", year: 2026 },
  { name: "Sameel Sulaiman Distributors", year: 2026 },
  { name: "Suzuki Falcon Sargodha", year: 2026 },
  { name: "WALEE Financial Services", year: 2026 },
];

// Activities on record per year, as listed on the portal's timeline.
export const activitiesPerYear = [
  { year: 2024, count: 13 },
  { year: 2025, count: 31 },
  { year: 2026, count: 9 },
];
