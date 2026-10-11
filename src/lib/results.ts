// Shared helpers for the results portal. Tables are defined in supabase/results.sql.

export interface ResultRow {
  roll_no: string;
  cnic_last4: string;
  data: Record<string, string>;
}

export interface ParsedSheet {
  columns: string[];
  rows: ResultRow[];
  errors: string[];
}

const ROLL = /roll/i;
const CNIC = /cnic|id\s*card|nic\b/i;

// Columns shown big at the top of a student's result card.
export const isHeadline = (col: string) => /^(s?gpa|cgpa|result|status|remarks?|total|percentage|grade)\b/i.test(col.trim());

// Reads a sheet pasted from Excel (tab-separated) or written as CSV. The first row must be the
// headings, with one column for the roll number and one for the CNIC. Only the last 4 digits
// of the CNIC are kept.
export function parseSheet(text: string): ParsedSheet {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const errors: string[] = [];
  if (lines.length < 2) return { columns: [], rows: [], errors: ["Paste the heading row and at least one student."] };

  const sep = lines[0].includes("\t") ? "\t" : ",";
  const split = (l: string) => l.split(sep).map((c) => c.trim());
  const headers = split(lines[0]);
  const rollIdx = headers.findIndex((h) => ROLL.test(h));
  const cnicIdx = headers.findIndex((h) => CNIC.test(h));
  if (rollIdx < 0) errors.push('No "Roll No" column found in the heading row.');
  if (cnicIdx < 0) errors.push('No "CNIC" column found in the heading row.');
  if (errors.length) return { columns: [], rows: [], errors };

  const keep = headers.map((h, i) => ({ h: h || `Column ${i + 1}`, i })).filter(({ i }) => i !== rollIdx && i !== cnicIdx);
  const seen = new Set<string>();
  const rows: ResultRow[] = [];

  lines.slice(1).forEach((line, n) => {
    const cells = split(line);
    const roll = cells[rollIdx] ?? "";
    const digits = (cells[cnicIdx] ?? "").replace(/\D/g, "");
    const rowNo = n + 2;
    if (!roll) return errors.push(`Row ${rowNo}: roll number is empty.`);
    if (digits.length < 4) return errors.push(`Row ${rowNo} (${roll}): CNIC is missing or too short.`);
    const key = roll.toLowerCase();
    if (seen.has(key)) return errors.push(`Row ${rowNo}: roll number ${roll} appears twice.`);
    seen.add(key);
    rows.push({
      roll_no: roll,
      cnic_last4: digits.slice(-4),
      data: Object.fromEntries(keep.map(({ h, i }) => [h, cells[i] ?? ""])),
    });
  });

  return { columns: keep.map((k) => k.h), rows, errors };
}
