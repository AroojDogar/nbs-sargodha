"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { programs, type Program } from "@/data/programs";

const pkr = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

// Whole-degree estimate: first semester + every later semester. Only for fixed-length programs.
function totals(p: Program) {
  const n = Number(p.semesters);
  if (!p.fees) return ["Not listed"];
  if (!Number.isInteger(n)) return [`Varies (${p.semesters} semesters)`];
  return p.fees.map(
    (f) => `${p.fees!.length > 1 ? `${f.label}: ` : ""}${pkr(f.firstSemester + (n - 1) * f.laterSemesters)}`,
  );
}

const rows: { label: string; value: (p: Program) => string | string[] }[] = [
  { label: "Level", value: (p) => p.level },
  { label: "Duration", value: (p) => `${p.duration}, ${p.semesters} semesters` },
  { label: "Classes", value: (p) => p.mode },
  { label: "Degree requirements", value: (p) => p.creditHours },
  { label: "Eligibility", value: (p) => p.eligibility },
  { label: "Seats", value: (p) => (p.seats ? String(p.seats) : "Not listed") },
  { label: "Specializations", value: (p) => p.specializations?.join(", ") ?? "Not listed" },
  {
    label: "Fee per semester",
    value: (p) =>
      p.fees?.map(
        (f) => `${p.fees!.length > 1 ? `${f.label}: ` : ""}${pkr(f.firstSemester)} first, then ${pkr(f.laterSemesters)}`,
      ) ?? "Not listed",
  },
  { label: "Estimated total for the whole degree", value: totals },
];

function Select({ id, value, onChange, label }: { id: string; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="text-sm text-mist">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 font-display text-lg font-semibold text-white outline-none focus:border-primary-light [&>option]:text-ink"
      >
        {programs.map((p) => (
          <option key={p.slug} value={p.slug}>{p.title}</option>
        ))}
      </select>
    </div>
  );
}

export default function ProgramCompare() {
  const [a, setA] = useState("bba");
  const [b, setB] = useState("bs-business-analytics");
  const pa = programs.find((p) => p.slug === a)!;
  const pb = programs.find((p) => p.slug === b)!;

  return (
    <div className="mt-24 rounded-3xl border border-white/15 p-6 lg:p-10">
      <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Compare two programs</h3>
      <p className="mt-3 text-mist">Pick any two programs to see them side by side, including the estimated cost of the whole degree.</p>

      <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
        <Select id="compare-a" label="First program" value={a} onChange={setA} />
        <button
          type="button"
          onClick={() => { setA(b); setB(a); }}
          aria-label="Swap programs"
          className="grid size-12 shrink-0 place-items-center self-center rounded-full border border-white/20 hover:bg-white/10 sm:self-end"
        >
          <ArrowLeftRight size={18} aria-hidden />
        </button>
        <Select id="compare-b" label="Second program" value={b} onChange={setB} />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="sr-only">
            <tr><th>Detail</th><th>{pa.title}</th><th>{pb.title}</th></tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => (
              <tr key={r.label} className={r.label.startsWith("Estimated") ? "text-primary-light" : ""}>
                <th scope="row" className="w-48 py-4 pr-6 align-top text-sm font-medium text-mist">{r.label}</th>
                {[pa, pb].map((p, i) => {
                  const v = r.value(p);
                  return (
                    <td key={i} className="py-4 pr-6 align-top leading-relaxed">
                      {Array.isArray(v) ? v.map((line) => <span key={line} className="block">{line}</span>) : v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-mist">
        Totals are estimates from the official per-semester fees. Fees may be revised each year.
      </p>
    </div>
  );
}
