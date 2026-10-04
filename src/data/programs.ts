// Source: University of Sargodha Prospectus 2026 (pp. 195–203, seats p. 220+, fee structure pp. 235–236)
// Fees are the official TOTAL dues per semester in PKR (tuition + all funds and charges).
// The first semester is higher because it includes one-time admission, registration and
// refundable library security fees. Fees can be revised each year — re-check before submitting.

export type ProgramLevel = "Undergraduate" | "Graduate" | "Postgraduate";

export interface Fee {
  label: string; // "Regular", "Self-support" or "Weekend"
  firstSemester: number;
  laterSemesters: number;
}

export interface Program {
  slug: string;
  title: string;
  level: ProgramLevel;
  mode: "Regular" | "Weekend";
  duration: string;
  semesters: string;
  creditHours: string;
  eligibility: string;
  seats?: number;
  fees?: Fee[];
  specializations?: string[];
  highlights?: string[];
}

const ugEligibility = (pct: number) =>
  `At least ${pct}% marks in HSSC (Part-I / II) (FA, FSc, ICS, I.Com, D.Com), DAE (1st & 2nd Year) or equivalent qualification.`;

const ugFees: Fee[] = [
  { label: "Regular", firstSemester: 44100, laterSemesters: 34100 },
  { label: "Self-support", firstSemester: 50700, laterSemesters: 40700 },
];

const mbaFees: Fee[] = [
  { label: "Regular", firstSemester: 47400, laterSemesters: 37400 },
  { label: "Self-support", firstSemester: 56200, laterSemesters: 46200 },
];

export const programs: Program[] = [
  {
    slug: "bba",
    title: "Bachelor of Business Administration (BBA)",
    level: "Undergraduate",
    mode: "Regular",
    duration: "4 Years",
    semesters: "8",
    creditHours: "130 + internship viva voce",
    eligibility: ugEligibility(45),
    seats: 181,
    fees: ugFees,
    specializations: ["Finance", "Human Resource Management", "Marketing"],
    highlights: ["AI in Business", "Fintech", "Digital Transformation and Innovation", "Supply Chain Management", "Capstone Project"],
  },
  {
    slug: "bs-islamic-banking-finance",
    title: "BS in Islamic Banking and Finance",
    level: "Undergraduate",
    mode: "Regular",
    duration: "4 Years",
    semesters: "8",
    creditHours: "136 + internship + capstone project",
    eligibility: ugEligibility(50),
    seats: 131,
    fees: ugFees,
  },
  {
    slug: "bs-entrepreneurship",
    title: "BS in Entrepreneurship",
    level: "Undergraduate",
    mode: "Regular",
    duration: "4 Years",
    semesters: "8",
    creditHours: "138 + internship viva voce",
    eligibility: ugEligibility(45),
    seats: 131,
    fees: ugFees,
  },
  {
    slug: "bs-commerce",
    title: "BS in Commerce",
    level: "Undergraduate",
    mode: "Regular",
    duration: "4 Years",
    semesters: "8",
    creditHours: "135 + internship viva voce",
    eligibility: ugEligibility(45),
    seats: 131,
    fees: ugFees,
  },
  {
    slug: "bs-business-analytics",
    title: "BS in Business Analytics",
    level: "Undergraduate",
    mode: "Regular",
    duration: "4 Years",
    semesters: "8",
    creditHours: "130 + internship + capstone project",
    eligibility: ugEligibility(50),
    seats: 131,
    fees: ugFees,
  },
  {
    slug: "bs-accounting-finance",
    title: "BS in Accounting and Finance",
    level: "Undergraduate",
    mode: "Regular",
    duration: "4 Years",
    semesters: "8",
    creditHours: "130 + internship + capstone project",
    eligibility: ugEligibility(50),
    seats: 131,
    fees: ugFees,
  },
  {
    slug: "bba-2-year",
    title: "BBA (after 14 years of education)",
    level: "Undergraduate",
    mode: "Regular",
    duration: "2 Years",
    semesters: "5",
    creditHours: "77 + internship viva voce",
    eligibility:
      "At least 45% marks or CGPA 2.00/4.00 in graduation (Business, Commerce or relevant) or ADC (Business / Commerce), B.Com (2-year).",
    seats: 131,
    fees: ugFees,
  },
  {
    slug: "mba-1-5-year",
    title: "MBA (1.5 Years, relevant qualification)",
    level: "Graduate",
    mode: "Regular",
    duration: "1.5 Years",
    semesters: "3",
    creditHours: "35 (research project or thesis)",
    eligibility:
      "At least 50% marks in BBA (4-Year) / B.Com (4-Year) / M.Com 2-Years / MBA 2-Years + Internal Admission Test (at least 50%).",
    seats: 84,
    fees: mbaFees,
  },
  {
    slug: "mba-2-year",
    title: "MBA (2 Years, non-relevant qualification)",
    level: "Graduate",
    mode: "Regular",
    duration: "2 Years",
    semesters: "4",
    creditHours: "65 (research project or thesis)",
    eligibility:
      "16-year undergraduate degree in any field other than Business and Management (at least 50% marks) + Internal Admission Test (at least 50%).",
    seats: 84,
    fees: mbaFees,
  },
  {
    slug: "executive-mba",
    title: "Executive MBA",
    level: "Graduate",
    mode: "Weekend",
    duration: "2 Years",
    semesters: "4",
    creditHours: "72 + viva voce",
    eligibility:
      "At least 45% marks (or as per university policy), admission test with at least 50% marks, and 3 years of professional experience.",
    fees: [{ label: "Weekend", firstSemester: 101600, laterSemesters: 83600 }],
  },
  {
    slug: "ms-management-sciences",
    title: "MS Management Sciences",
    level: "Postgraduate",
    mode: "Weekend",
    duration: "1.5 Years",
    semesters: "3",
    creditHours: "32",
    eligibility:
      "At least 45% marks or CGPA 2.00/4.00 in relevant terminal degree + Internal Admission Test (at least 50%).",
    seats: 24,
    fees: [{ label: "Weekend", firstSemester: 101600, laterSemesters: 83600 }],
  },
  {
    slug: "phd-management-sciences",
    title: "PhD Management Sciences",
    level: "Postgraduate",
    mode: "Weekend",
    duration: "3–8 Years",
    semesters: "6–16",
    creditHours: "20 coursework + dissertation",
    eligibility:
      "At least 3.00 CGPA in terminal degree (18 years of education) + UOS Entry Test (equivalent to HEC HAT General) or HEC HAT General Test, at least 60% marks.",
    seats: 11,
    fees: [{ label: "Weekend", firstSemester: 120500, laterSemesters: 93500 }],
  },
];
