// Source: University of Sargodha Prospectus 2026 (pp. 9–10, 178, 195, 235)
// Official spelling in the prospectus is "Firoz" — use it everywhere.

export const school = {
  name: "Malik Firoz Khan Noon Business School",
  shortName: "Noon Business School",
  abbreviation: "NBS",
  university: "University of Sargodha",
  faculty: "Faculty of Social Sciences",
  director: {
    name: "Dr. Arfan Shahzad",
    designation: "Professor / Director",
  },
  contact: {
    email: "nbs@uos.edu.pk",
    phone: "048-9230811-15 Ext 377",
    location: "Ibn-e-Rushd Block, University of Sargodha, Sargodha, Punjab, Pakistan",
  },
} as const;

export const facultyOfSocialSciences = {
  dean: {
    name: "Prof. Dr. Masood Sarwar Awan",
    designation: "Dean, Faculty of Social Sciences",
    email: "dean.socialsciences@uos.edu.pk",
    phone: "048-9230811-15 Ext 381, 383",
  },
  established: 2013,
  students: 6500,
  facultyMembers: 200, // full-time + visiting
  units: [
    "Institute of Education",
    "Economics",
    "History and Pakistan Studies",
    "Malik Firoz Khan Noon Business School",
    "Politics and International Relations",
    "Psychology",
    "Social Work",
    "Sociology and Criminology",
  ],
} as const;

export const university = {
  name: "University of Sargodha",
  journeyBegan: 1929, // De'Montmorency College, later Government College
  charter: 2002,
  students: "25,000+",
  facultyMembers: "600+",
  phds: "350+",
  vision:
    "To contribute to society through the pursuit of quality education, creative learning and productive research.",
  values: [
    "Integrity",
    "Inclusiveness",
    "Transparency",
    "Compassion",
    "Professionalism",
    "Social Responsibility",
  ],
  rankings: [
    { label: "Young University Ranking", value: "301–350" },
    { label: "Social Sciences (by subject)", value: "801–1000" },
  ],
  globalLinkages: ["China", "USA", "Malaysia", "Turkey", "Saudi Arabia", "Australia"],
  city: {
    name: "Sargodha",
    nicknames: ["City of Eagles", "California of Pakistan"],
    knownFor: "Kinnow citrus",
  },
} as const;

// Stats for the homepage ticker
export const tickerStats = [
  { value: "12", label: "Degree Programs" },
  { value: "50", label: "Faculty Members" },
  { value: "BBA → PhD", label: "Full Academic Ladder" },
  { value: "1929", label: "Legacy Since" },
  { value: "25,000+", label: "University Students" },
  { value: "6", label: "Countries in Global Linkages" },
] as const;
