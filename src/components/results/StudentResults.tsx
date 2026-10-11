"use client";

import { useState } from "react";
import Image from "next/image";
import { Printer, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { summaryLabel, type Layout, type ResultData } from "@/lib/results";
import { school } from "@/data/school";
import VerifyQr from "@/components/results/VerifyQr";

export interface PublishedResult {
  title: string;
  session: string;
  semester: string | null;
  declared_on: string | null;
  published_at: string | null;
  layout: Layout;
  data: ResultData;
  roll_no?: string;
  verify_code?: string;
}

const longDate = (d: string) => new Date(d.length === 10 ? d + "T00:00" : d).toLocaleDateString("en-GB", { dateStyle: "long" });

function StatusBadge({ value }: { value: string }) {
  if (!value) return <span>—</span>;
  const good = /promot|pass/i.test(value);
  const bad = /drop|fail|withdraw/i.test(value);
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-bold tracking-wide ${
        good ? "bg-emerald-100 text-emerald-800" : bad ? "bg-red-100 text-red-700" : "bg-fog text-ink"
      }`}
    >
      {value}
    </span>
  );
}

export function ResultCard({ r, studentId }: { r: PublishedResult; studentId: string }) {
  const { layout, data } = r;
  const summary = layout.summary.map((raw) => ({ raw, label: summaryLabel(raw), value: data.summary[raw] ?? "" }));
  const status = summary.find((s) => s.label === "Result status");
  const tiles = summary.filter((s) => s !== status);
  const highlight = new Set(["GPA", "CGPA"]);

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/10 print:rounded-none print:shadow-none print:ring-0">
      <header className="border-b-2 border-gold bg-ink px-6 py-6 text-white print:bg-white print:text-black">
        <div className="flex flex-wrap items-center gap-4">
          <Image src="/nbs-logo.png" alt="" width={56} height={56} className="size-14 rounded-full bg-white" />
          <div className="flex-1">
            <p className="text-xs tracking-wide text-mist uppercase print:text-black">{school.university} · Consolidated result</p>
            <h3 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{school.name}</h3>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          {[
            ["Program", r.title],
            ["Semester", r.semester || "—"],
            ["Session", r.session],
            ["Declared", r.declared_on ? longDate(r.declared_on) : "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-mist print:text-black">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6">
        <div>
          <p className="text-sm text-slate">Student</p>
          <p className="font-display text-2xl font-semibold">{data.name || "—"}</p>
          <p className="font-mono text-sm text-slate">{studentId}</p>
        </div>
        {status && <StatusBadge value={status.value} />}
      </div>

      <div className="mt-6 overflow-x-auto px-6">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-ink/15 text-slate">
            <tr>
              <th className="py-2 pr-3 font-semibold">Code</th>
              <th className="py-2 pr-3 font-semibold">Course</th>
              <th className="py-2 pr-3 text-center font-semibold">Cr. hrs</th>
              <th className="py-2 pr-3 text-center font-semibold">Marks</th>
              <th className="py-2 pr-3 text-center font-semibold">GPT</th>
              <th className="py-2 text-center font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {layout.subjects.map((s) => {
              const [marks, gpt, grade] = data.marks[s.code] ?? ["", "", ""];
              const failed = /^f$/i.test(grade);
              return (
                <tr key={s.code} className={failed ? "bg-red-50" : ""}>
                  <td className="py-3 pr-3 font-mono text-xs text-slate">{s.code}</td>
                  <td className="py-3 pr-3 font-medium">
                    {s.name}
                    {!s.graded && <span className="ml-2 text-xs font-normal text-slate">(non-credit)</span>}
                  </td>
                  <td className="py-3 pr-3 text-center">{s.credits || "—"}</td>
                  <td className="py-3 pr-3 text-center font-semibold">{marks || "—"}</td>
                  <td className="py-3 pr-3 text-center">{s.graded ? gpt || "—" : ""}</td>
                  <td className={`py-3 text-center font-bold ${failed ? "text-red-600" : "text-primary"}`}>{s.graded ? grade || "—" : ""}</td>
                </tr>
              );
            })}
          </tbody>
          {layout.totalCredits && (
            <tfoot className="border-t border-ink/15 text-slate">
              <tr>
                <td />
                <td className="py-2 pr-3 text-right text-xs">Total credit hours</td>
                <td className="py-2 pr-3 text-center font-semibold text-ink">{layout.totalCredits}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <dl className="mx-6 mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.raw} className="bg-fog p-4">
            <dt className="text-xs font-semibold tracking-wide text-slate uppercase">{t.label}</dt>
            <dd className={`mt-1 font-display font-semibold ${highlight.has(t.label) ? "text-3xl text-primary" : "text-xl"}`}>{t.value || "—"}</dd>
          </div>
        ))}
      </dl>

      {r.verify_code && (
        <div className="mx-6 mt-6 border-t border-dashed border-ink/15 pt-6">
          <VerifyQr code={r.verify_code} />
        </div>
      )}

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-fog px-6 py-4 text-xs text-slate">
        <span>Errors and omissions excepted. The official notification of the University of Sargodha is final.</span>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-primary ring-1 ring-ink/10 print:hidden"
        >
          <Printer size={14} aria-hidden /> Print / save PDF
        </button>
      </footer>
    </article>
  );
}

export default function StudentResults() {
  const [roll, setRoll] = useState("");
  const [results, setResults] = useState<PublishedResult[] | null>(null);
  const [searched, setSearched] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ready = roll.replace(/\s/g, "").length >= 5;

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !ready) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase.rpc("student_results", { p_roll: roll.trim() });
    setLoading(false);
    if (error) {
      setResults(null);
      setError("Could not load results right now. Please try again.");
      return;
    }
    setSearched(roll.trim().toUpperCase());
    setResults(data as PublishedResult[]);
  }

  return (
    <div>
      <form onSubmit={lookup} className="flex flex-col gap-3 sm:flex-row print:hidden">
        <label className="sr-only" htmlFor="r-roll">
          Student ID
        </label>
        <input
          id="r-roll"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="Student ID, e.g. BUSC51F24R001"
          autoComplete="off"
          disabled={!supabase}
          className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-5 py-3 font-mono uppercase outline-none placeholder:font-sans placeholder:normal-case focus:border-primary"
        />
        <button
          type="submit"
          disabled={!supabase || loading || !ready}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <Search size={18} aria-hidden />
          {loading ? "Checking…" : "View result"}
        </button>
      </form>

      {!supabase && <p className="mt-4 text-sm text-slate">The results portal is not set up yet.</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {results && results.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-6 text-slate print:hidden">
          No published result for <strong className="text-ink">{searched}</strong>. Check your Student ID, or ask the examination office whether your result has been announced.
        </p>
      )}

      {results && results.length > 0 && (
        <div className="mt-10 space-y-10" aria-live="polite">
          {results.map((r) => (
            <ResultCard key={r.verify_code ?? r.title + r.session + r.semester} r={r} studentId={r.roll_no ?? searched} />
          ))}
        </div>
      )}
    </div>
  );
}
