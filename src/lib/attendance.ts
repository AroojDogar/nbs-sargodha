// Shared types and helpers for the attendance portal. Tables are defined in supabase/schema.sql.

export type Status = "P" | "A" | "L";

export interface ClassRow {
  id: string;
  name: string;
  course: string;
}

export interface StudentRow {
  id: string;
  roll_no: string;
  name: string;
}

export interface Totals {
  present: number;
  absent: number;
  leave: number;
  total: number;
}

// The handbook rule: at least 75% attendance to sit the final exam.
export const REQUIRED_PERCENT = 75;

export const statusLabel: Record<Status, string> = { P: "Present", A: "Absent", L: "Leave" };

export const percent = (t: Pick<Totals, "present" | "total">) => (t.total ? Math.round((t.present / t.total) * 1000) / 10 : 0);

// Today's date in the visitor's own time zone, as YYYY-MM-DD.
export const today = () => new Date().toLocaleDateString("en-CA");

// Sort roll numbers the way people read them: "BBA-2" before "BBA-10".
export const byRoll = (a: { roll_no: string }, b: { roll_no: string }) =>
  a.roll_no.localeCompare(b.roll_no, undefined, { numeric: true, sensitivity: "base" });

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
