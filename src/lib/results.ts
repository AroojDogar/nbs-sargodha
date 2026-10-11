// Reads the University of Sargodha "Consolidated Results" sheet as the Deputy Registrar copies it
// from Excel, and describes it for the results portal. Tables are in supabase/results.sql.
//
// The sheet looks like this (merged cells come through as one value followed by blanks):
//   (subject names)          Translate of the Holy Quran II* | Basic Science         | ...
//   Credit Hours             0                               | 3                     | ...            16
//   Sr.# | Student ID | NAME | URCG-5111                       | URCG5114 | GPT | Grade | ... | Total Mks | Sem Gpts | GPA | ...
//   1    | BUSC51F24R001 | … | 88                              | 88       | 12.00 | A+ | ... | 498       | 63.48    | 3.97 | ...
// A subject with credit hours has Marks, GPT and Grade columns; a 0-credit subject has only Marks.

export interface Subject {
  code: string;
  name: string;
  credits: string;
  graded: boolean; // has GPT and Grade columns
}

export interface Layout {
  subjects: Subject[];
  summary: string[];
  totalCredits?: string;
}

export interface ResultData {
  name: string;
  marks: Record<string, [string, string, string]>; // code -> [marks, gpt, grade]
  summary: Record<string, string>;
}

export interface ResultRow {
  roll_no: string;
  data: ResultData;
}

export interface ParsedSheet {
  layout: Layout;
  rows: ResultRow[];
  errors: string[];
  warnings: string[];
}

// Excel copies cells as tab-separated text; cells with line breaks or tabs are wrapped in quotes.
function readTsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === "\t") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) rows.push([...row, cell]);
  return rows.map((r) => r.map((c) => c.replace(/\s+/g, " ").trim()));
}

// Excel errors such as #N/A mean "no value".
const clean = (v: string | undefined) => (!v || /^#(N\/A|VALUE!|REF!|DIV\/0!|NAME\?)$/i.test(v) ? "" : v);
const compact = (h: string) => h.replace(/\s+/g, "").toLowerCase();
const isGpt = (h: string) => /^gpts?$/.test(compact(h));
const isGrade = (h: string) => /^grade?$|^grad$/.test(compact(h));
const isSummary = (h: string) => /total|sem|gpa|cgpa|prev|result|status|remarks/i.test(h);

export function parseSheet(text: string): ParsedSheet {
  const rows = readTsv(text);
  const errors: string[] = [];
  const warnings: string[] = [];
  const empty = { layout: { subjects: [], summary: [] }, rows: [], errors, warnings };

  const headRow = rows.findIndex((r) => r.some((c) => /student\s*id|roll\s*no/i.test(c)));
  if (headRow < 0) {
    errors.push('Could not find the heading row with "Student ID". Copy the sheet including its three heading rows.');
    return empty;
  }
  const head = rows[headRow];
  const idCol = head.findIndex((c) => /student\s*id|roll\s*no/i.test(c));
  let nameCol = head.findIndex((c, i) => i > idCol && /name/i.test(c));
  if (nameCol < 0) nameCol = idCol + 1;

  let creditRow = -1;
  for (let r = headRow - 1; r >= Math.max(0, headRow - 3); r--) {
    if (rows[r].some((c) => /credit/i.test(c))) {
      creditRow = r;
      break;
    }
  }
  const titleRow = creditRow > 0 ? creditRow - 1 : -1;
  const at = (r: number, c: number) => (r >= 0 ? (rows[r][c] ?? "") : "");

  // Work out which columns belong to which subject.
  const subjects: (Subject & { col: number; gptCol?: number; gradeCol?: number })[] = [];
  const summary: { label: string; col: number }[] = [];
  let totalCredits: string | undefined;
  for (let c = nameCol + 1; c < head.length; c++) {
    const h = head[c];
    if (!h) continue;
    const current = subjects[subjects.length - 1];
    if (isGpt(h) && current && !summary.length) current.gptCol = c;
    else if (isGrade(h) && current && !summary.length) current.gradeCol = c;
    else if (isSummary(h)) {
      if (!summary.length) totalCredits = clean(at(creditRow, c)) || undefined;
      summary.push({ label: h, col: c });
    } else if (!summary.length) {
      subjects.push({ code: h, name: at(titleRow, c) || h, credits: clean(at(creditRow, c)), graded: false, col: c });
    }
  }
  subjects.forEach((s) => (s.graded = s.gptCol !== undefined || s.gradeCol !== undefined));

  if (!subjects.length) {
    errors.push("No subject columns were found after the NAME column.");
    return empty;
  }
  if (creditRow < 0) warnings.push('No "Credit Hours" row was found above the headings, so credit hours will be left blank.');

  const seen = new Set<string>();
  const out: ResultRow[] = [];
  let skipped = 0;
  for (const r of rows.slice(headRow + 1)) {
    const id = clean(r[idCol]);
    if (!id || !/\d/.test(id)) continue; // blank rows, "Re-Peaters" headings, signatures
    const marks = Object.fromEntries(
      subjects.map((s) => [
        s.code,
        [clean(r[s.col]), s.gptCol !== undefined ? clean(r[s.gptCol]) : "", s.gradeCol !== undefined ? clean(r[s.gradeCol]) : ""],
      ]),
    ) as ResultData["marks"];
    if (!Object.values(marks).some(([m]) => m !== "")) {
      skipped++;
      continue; // no marks at all for this student
    }
    const key = compact(id);
    if (seen.has(key)) {
      warnings.push(`${id} appears more than once; only the first row is used.`);
      continue;
    }
    seen.add(key);
    out.push({
      roll_no: id,
      data: {
        name: clean(r[nameCol]),
        marks,
        summary: Object.fromEntries(summary.map((s) => [s.label, clean(r[s.col])])),
      },
    });
  }
  if (skipped) warnings.push(`${skipped} row${skipped > 1 ? "s" : ""} with a Student ID but no marks (all #N/A) were left out.`);
  if (!out.length) errors.push("No student rows with marks were found under the headings.");

  return {
    layout: {
      subjects: subjects.map(({ code, name, credits, graded }) => ({ code, name, credits, graded })),
      summary: summary.map((s) => s.label),
      totalCredits,
    },
    rows: out,
    errors,
    warnings,
  };
}

// Friendly names for the summary columns on a student's result card.
export function summaryLabel(raw: string) {
  const h = raw.toLowerCase();
  if (/total\s*mks|total\s*marks/.test(h)) return "Total marks";
  if (/sem/.test(h) && /gpt/.test(h)) return "Semester GPTs";
  if (/prev/.test(h)) return "Previous GPTs";
  if (/total/.test(h) && /gpt/.test(h)) return "Total GPTs";
  if (/cgpa/.test(h)) return "CGPA";
  if (/^gpa/.test(h)) return "GPA";
  if (/result|status/.test(h)) return "Result status";
  return raw;
}
