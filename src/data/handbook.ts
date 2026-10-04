// Source: NBS Orientation, Batch 2026 Fall (Examination Rules & Regulations, Graduate and Undergraduate Programs 2024).

export const evaluation = [
  { part: "Mid-term", weight: 30 },
  { part: "Sessional", weight: 20 },
  { part: "Final", weight: 50 },
];

// Grade point for each whole percentage from 40 to 79 (80–100 = 4.00, below 40 = 0).
export const gradePoints: Record<number, number> = {
  79: 3.94, 78: 3.87, 77: 3.8, 76: 3.74, 75: 3.67, 74: 3.6, 73: 3.54, 72: 3.47, 71: 3.4, 70: 3.34,
  69: 3.27, 68: 3.2, 67: 3.14, 66: 3.07, 65: 3.0, 64: 2.92, 63: 2.85, 62: 2.78, 61: 2.7, 60: 2.64,
  59: 2.57, 58: 2.5, 57: 2.43, 56: 2.36, 55: 2.3, 54: 2.24, 53: 2.18, 52: 2.12, 51: 2.06, 50: 2.0,
  49: 1.9, 48: 1.8, 47: 1.7, 46: 1.6, 45: 1.5, 44: 1.4, 43: 1.3, 42: 1.2, 41: 1.1, 40: 1.0,
};

export function gradeFor(percent: number) {
  const p = Math.floor(percent);
  if (p >= 80) return { gp: 4, letter: "A" };
  if (p < 40) return { gp: 0, letter: "F" };
  const gp = gradePoints[p];
  const letter = p >= 65 ? "B" : p >= 50 ? "C" : "D";
  return { gp, letter };
}

export const gradeBands = [
  { range: "80–100", letter: "A", gp: "4.00" },
  { range: "65–79", letter: "B", gp: "3.00–3.94" },
  { range: "50–64", letter: "C", gp: "2.00–2.92" },
  { range: "40–49", letter: "D", gp: "1.00–1.90" },
  { range: "Below 40", letter: "F", gp: "0" },
];

export const otherGrades = [
  { letter: "W", meaning: "Withdrawal" },
  { letter: "R", meaning: "Repeat" },
  { letter: "I", meaning: "Incomplete" },
];

export const promotion = [
  {
    program: "4-year programs",
    steps: [
      { when: "End of 1st semester", rule: "Pass at least 50% of courses with a minimum GPA of 1.75" },
      { when: "After 1st year", rule: "Minimum CGPA 2.10" },
      { when: "After 2nd year", rule: "Minimum CGPA 2.50" },
      { when: "After 3rd year", rule: "Minimum CGPA 2.25" },
      { when: "After 4th year", rule: "Minimum CGPA 2.50 to complete the degree" },
    ],
  },
  {
    program: "2-year programs",
    steps: [
      { when: "End of 1st semester", rule: "Pass at least 50% of courses with a minimum GPA of 1.75" },
      { when: "After 1st year", rule: "Minimum CGPA 2.00" },
      { when: "After 2nd year", rule: "Minimum CGPA 2.10" },
    ],
  },
];

export const scholarships: { name: string; detail?: string }[] = [
  { name: "PEEF Scholarships", detail: "Punjab Educational Endowment Fund" },
  { name: "Kinship Scholarships" },
  { name: "Hafiz-e-Quran", detail: "Fee concession" },
  { name: "HEC Need-Based", detail: "Scholarships" },
  { name: "Deserving students", detail: "Fee concession through the Ehsaas Program" },
];

export const uniform = {
  female: ["White shirt", "White shalwar", "White dupatta with a 2-inch royal blue ribbon", "Navy blue sweater or blazer", "Black shoes"],
  male: ["White shirt with a 1-inch pocket strip", "Grey pants", "Black belt", "Navy blue sweater or blazer", "Black shoes"],
};

export const conduct = [
  "Attend classes regularly. Planning to skip class, alone or with classmates, is not allowed.",
  "Smoking and any kind of drug are strictly prohibited.",
  "No music or noise, and no idle standing in corridors or on stairs.",
  "No abusive or unethical language in class or in the department.",
  "No games such as Ludo or chess in class.",
  "Keep your Student ID card to yourself and never use someone else's.",
  "Use the dustbins and take care of University property.",
  "Only officially allowed curricular, co-curricular and extra-curricular activities may take place.",
];
