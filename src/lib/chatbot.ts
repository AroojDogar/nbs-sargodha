// The NBS Assistant's offline "brain", used when the Gemini AI (app/api/chat) is not set up or
// not reachable. It answers only from the site's own data files (prospectus + orientation),
// so it never makes up fees, rules or names.

import { school, facultyOfSocialSciences, university } from "@/data/school";
import { programs, type Program } from "@/data/programs";
import { faculty, director, adminStaff } from "@/data/faculty";
import { activities, clubs } from "@/data/studentLife";
import { evaluation, gradeFor, promotion, scholarships, uniform } from "@/data/handbook";
import { milestones } from "@/data/events";

export interface Reply {
  text: string;
  link?: { href: string; label: string };
}

const pkr = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

const has = (q: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}`, "i").test(q));

// Which program is the question about? Longer, more specific names are checked first.
const programAliases: [string, RegExp][] = [
  ["executive-mba", /\b(executive|emba|e-mba)\b/i],
  ["bba-2-year", /\bbba\b.*\b(2|two|14|bridging)\b|\b(2|two)[ -]?years?\b.*\bbba\b/i],
  ["bs-islamic-banking-finance", /\bislamic\b|\bbanking\b/i],
  ["bs-entrepreneurship", /\bentrepreneur/i],
  ["bs-business-analytics", /\banalytic/i],
  ["bs-accounting-finance", /\baccounting\b/i],
  ["bs-commerce", /\bcommerce\b|\bb\.?com\b/i],
  ["phd-management-sciences", /\bph\.?d\b|\bdoctora/i],
  ["ms-management-sciences", /\bms\b|\bm\.?phil\b/i],
  ["mba-2-year", /\bmba\b/i],
  ["bba", /\bbba\b/i],
];

function findProgram(q: string): Program | undefined {
  for (const [slug, re] of programAliases) {
    if (re.test(q)) return programs.find((p) => p.slug === slug);
  }
}

function programAnswer(p: Program, q: string): Reply {
  const link = { href: "/#programs", label: "See all programs" };
  if (has(q, ["fee", "fees", "cost", "charges", "dues", "price", "kitni", "paise"])) {
    if (!p.fees) return { text: `I don't have fee details for ${p.title}. Please email ${school.contact.email}.`, link };
    const lines = p.fees.map(
      (f) => `${p.fees!.length > 1 ? `${f.label}: ` : ""}${pkr(f.firstSemester)} in the first semester, then ${pkr(f.laterSemesters)} per semester`,
    );
    const extra = p.slug.startsWith("mba")
      ? "\n\nThe same fee applies to both MBA tracks (1.5-year and 2-year)."
      : "";
    const title = p.slug.startsWith("mba") ? "the MBA" : p.title;
    return { text: `Total fee for ${title}:\n${lines.join("\n")}${extra}\n\nFees may be revised each year.`, link };
  }
  if (has(q, ["eligib", "marks", "admission", "requirement", "criteria", "merit", "percentage", "apply", "qualif"])) {
    let text = `Eligibility for ${p.title}: ${p.eligibility}`;
    if (p.slug.startsWith("mba")) {
      const other = programs.find((x) => x.slug === (p.slug === "mba-2-year" ? "mba-1-5-year" : "mba-2-year"))!;
      text += `\n\n${other.title}: ${other.eligibility}`;
    }
    return { text, link };
  }
  if (has(q, ["special", "major"])) {
    return {
      text: p.specializations
        ? `${p.title} offers specializations in ${p.specializations.join(", ")}.`
        : `The prospectus doesn't list specializations for ${p.title}.`,
      link,
    };
  }
  if (has(q, ["seat"])) {
    return { text: p.seats ? `${p.title} offers ${p.seats} seats.` : `The prospectus doesn't list seats for ${p.title}.`, link };
  }
  const feeLine = p.fees ? `\nFee: from ${pkr(p.fees[0].laterSemesters)} per semester (${pkr(p.fees[0].firstSemester)} first semester).` : "";
  return {
    text:
      `${p.title}\nDuration: ${p.duration}, ${p.semesters} semesters (${p.mode.toLowerCase()})\n` +
      `Requirements: ${p.creditHours}\nEligibility: ${p.eligibility}${feeLine}`,
    link,
  };
}

// Match a teacher or staff member by name.
const common = new Set(["muhammad", "dr", "dr.", "m.", "khan", "ahmed", "ali", "hassan", "prof", "prof."]);
function findPeople(q: string) {
  const words = q.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 3 && !common.has(w));
  if (!words.length) return [];
  const people = [
    ...faculty.map((f) => ({ name: f.name, info: `${f.rank}${f.qualification ? `, ${f.qualification}` : ""}${f.role ? `, ${f.role}` : ""}${f.onLeave ? " (on leave)" : ""}` })),
    ...adminStaff.map((s) => ({ name: s.name, info: s.role })),
  ];
  const scored = people
    .map((p) => {
      const tokens = p.name.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/);
      return { ...p, score: words.filter((w) => tokens.includes(w)).length };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!scored.length) return [];
  return scored.filter((p) => p.score === scored[0].score).slice(0, 4);
}

export function answer(input: string): Reply {
  const q = input.trim().toLowerCase();
  if (!q) return { text: "Type a question, for example: “What is the BBA fee?”" };

  if (/^(hi|hello|hey|salam|assalam|aoa|asalam)/.test(q))
    return { text: "Hello! Ask me about programs, fees, admission, attendance, scholarships, faculty or student life." };
  if (has(q, ["thank", "thanks", "shukriya", "jazak"])) return { text: "You're welcome! Anything else you'd like to know?" };

  // Grade calculator, e.g. "what grade is 72" or "gpa for 68%"
  const num = q.match(/\b(\d{1,3})\s*%?/);
  if (num && has(q, ["grade", "gpa", "gp", "point", "marks"]) && Number(num[1]) <= 100 && !findProgram(q)) {
    const g = gradeFor(Number(num[1]));
    return { text: `${num[1]}% is a ${g.letter} grade with a grade point of ${g.gp.toFixed(2)}.`, link: { href: "/handbook#grading", label: "Grading table" } };
  }

  const program = findProgram(q);
  if (program) return programAnswer(program, q);

  if (has(q, ["director", "head of", "hod"]))
    return { text: `The Director of NBS is ${director.name}, ${director.designation}, ${director.qualification}.`, link: { href: "/faculty", label: "Meet the faculty" } };
  if (has(q, ["vc", "vice chancellor", "vice-chancellor", "chancellor"]))
    return { text: `The Vice Chancellor of the ${university.name} is ${university.viceChancellor.name} (since ${university.viceChancellor.since}).` };
  if (has(q, ["dean"]))
    return { text: `The Dean of the Faculty of Social Sciences is ${facultyOfSocialSciences.dean.name}.` };

  if (has(q, ["fee", "fees", "cost", "charges", "dues"]))
    return {
      text: `${programAnswer(programs[0], "fee").text}\n\nThe same fee applies to all BS programs. Ask about a specific program, like “MBA fee”, for others.`,
      link: { href: "/#programs", label: "See all fees" },
    };

  if (has(q, ["eligib", "admission", "marks", "merit", "requirement", "apply"]))
    return {
      text: "BBA, BS Entrepreneurship and BS Commerce need at least 45% in HSSC or DAE. BS Islamic Banking and Finance, BS Business Analytics and BS Accounting and Finance need at least 50%. MBA needs 50% plus an internal admission test.\n\nAsk about a specific program for full details.",
      link: { href: "/#programs", label: "See all programs" },
    };

  if (has(q, ["program", "degree", "course", "offer", "study"]))
    return {
      text: `NBS offers ${programs.length} programs:\n${programs.map((p) => `• ${p.title}`).join("\n")}`,
      link: { href: "/#programs", label: "Explore programs" },
    };

  if (has(q, ["weekend", "job", "working", "professional", "evening"]))
    return { text: "The Executive MBA, MS Management Sciences and PhD Management Sciences run on weekends. The Executive MBA requires 3 years of professional experience." };

  if (has(q, ["attendance", "absent", "short", "leave"]))
    return { text: "You need at least 75% attendance in a course to sit its final exam. For valid reasons, the Director may allow a shortfall of up to 5% of total lectures.", link: { href: "/handbook#attendance", label: "Attendance rules" } };

  if (has(q, ["promot", "cgpa", "probation", "fail"]))
    return {
      text: promotion.map((p) => `${p.program}:\n${p.steps.map((s) => `• ${s.when}: ${s.rule}`).join("\n")}`).join("\n\n"),
      link: { href: "/handbook#promotion", label: "Promotion criteria" },
    };

  if (has(q, ["grade", "gpa", "grading", "mid", "final", "exam", "sessional", "evaluation"]))
    return {
      text: `Courses without a practical are usually marked: ${evaluation.map((e) => `${e.part} ${e.weight}`).join(", ")}. 80% and above is an A (4.00). Tell me your percentage, like “grade for 72”, and I'll work out your grade point.`,
      link: { href: "/handbook#grading", label: "Grading table" },
    };

  if (has(q, ["scholar", "financial", "aid", "concession", "peef", "hec", "ehsaas", "kinship", "hafiz"]))
    return { text: `Available scholarships and aid:\n${scholarships.map((s) => `• ${s.name}${s.detail ? ` (${s.detail})` : ""}`).join("\n")}`, link: { href: "/handbook#scholarships", label: "Scholarships" } };

  if (has(q, ["uniform", "dress"]))
    return { text: `Uniform is compulsory.\nFemale: ${uniform.female.join(", ")}.\nMale: ${uniform.male.join(", ")}.`, link: { href: "/handbook#uniform", label: "Uniform" } };

  if (has(q, ["club", "societ"]))
    return { text: `NBS has ${clubs.length} clubs: ${clubs.join(", ")}. Each has a President, Vice President and General Secretary.`, link: { href: "/student-life", label: "Student life" } };

  if (has(q, ["event", "activit", "gala", "forum", "dinner", "conference", "achievement", "mou", "partner", "accredit", "nbeac"]))
    return {
      text: `Recent highlights:\n${milestones.map((m) => `• ${m.title} (${m.date})`).join("\n")}\n\nEvery year NBS also holds: ${activities.join(", ")}.`,
      link: { href: "/events", label: "Events and achievements" },
    };

  if (has(q, ["contact", "email", "phone", "number", "call", "address", "where", "location", "located", "office", "map"]))
    return { text: `Email: ${school.contact.email}\nPhone: ${school.contact.phone}\nAddress: ${school.contact.location}`, link: { href: "#contact", label: "Map and directions" } };

  if (has(q, ["faculty", "teacher", "professor", "lecturer", "staff"]))
    return { text: `NBS has ${faculty.length + 1} faculty members, including the Director. Ask me about a teacher by name, like “Who is Nimra Zia?”`, link: { href: "/faculty", label: "Faculty directory" } };

  const people = findPeople(q);
  if (people.length)
    return { text: people.map((p) => `${p.name}: ${p.info}`).join("\n"), link: { href: "/faculty", label: "Faculty directory" } };

  return {
    text: `Sorry, I don't have an answer for that yet. I can help with programs, fees, admission, attendance, grading, scholarships, uniform, clubs and faculty. For anything else, email ${school.contact.email}.`,
  };
}

export const suggestions = ["BBA fee", "Admission marks", "Weekend programs", "Attendance rule", "Scholarships", "Latest events", "Contact NBS"];
