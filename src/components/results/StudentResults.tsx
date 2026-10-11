"use client";

import { useState } from "react";
import Image from "next/image";
import { Printer, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isHeadline } from "@/lib/results";
import { school } from "@/data/school";

interface Sheet {
  title: string;
  session: string;
  published_at: string | null;
  columns: string[];
  data: Record<string, string>;
}

const input = "min-w-0 rounded-full border border-ink/15 bg-white px-5 py-3 outline-none focus:border-primary";

export default function StudentResults() {
  const [roll, setRoll] = useState("");
  const [cnic, setCnic] = useState("");
  const [sheets, setSheets] = useState<Sheet[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ready = roll.trim().length >= 3 && /^\d{4}$/.test(cnic);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !ready) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase.rpc("student_results", { p_roll: roll.trim(), p_cnic4: cnic });
    setLoading(false);
    if (error) {
      setSheets(null);
      setError(error.message.includes("Too many") ? error.message : "Could not load results right now. Please try again.");
      return;
    }
    setSheets(data as Sheet[]);
  }

  return (
    <div>
      <form onSubmit={lookup} className="grid gap-3 sm:grid-cols-[1fr_12rem_auto] print:hidden">
        <label className="sr-only" htmlFor="r-roll">
          Roll number
        </label>
        <input id="r-roll" value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="Roll number" autoComplete="off" disabled={!supabase} className={input} />
        <label className="sr-only" htmlFor="r-cnic">
          Last 4 digits of CNIC
        </label>
        <input
          id="r-cnic"
          value={cnic}
          onChange={(e) => setCnic(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="CNIC last 4 digits"
          inputMode="numeric"
          autoComplete="off"
          disabled={!supabase}
          className={input}
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

      {sheets && sheets.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-6 text-slate">
          No published result matches this roll number and CNIC. Check both, or ask the examination office if your result has been announced.
        </p>
      )}

      {sheets && sheets.length > 0 && (
        <div className="mt-10 space-y-8" aria-live="polite">
          {sheets.map((s) => {
            const nameCol = s.columns.find((c) => /^(student'?s?\s*)?name$/i.test(c.trim()));
            const headline = s.columns.filter(isHeadline);
            const rest = s.columns.filter((c) => !isHeadline(c) && c !== nameCol);
            return (
              <article key={s.title + s.session} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/10 print:shadow-none">
                <header className="flex flex-wrap items-center gap-4 border-b-2 border-gold bg-ink px-6 py-5 text-white print:bg-white print:text-black">
                  <Image src="/nbs-logo.png" alt="" width={48} height={48} className="size-12 rounded-full bg-white" />
                  <div className="flex-1">
                    <p className="text-xs text-mist print:text-black">{school.name}</p>
                    <h3 className="font-display text-xl font-semibold">
                      {s.title} · {s.session}
                    </h3>
                  </div>
                  <div className="text-right">
                    {nameCol && s.data[nameCol] && <p className="font-semibold">{s.data[nameCol]}</p>}
                    <p className="font-mono text-sm text-gold-light print:text-black">Roll no. {roll.trim().toUpperCase()}</p>
                  </div>
                </header>

                {headline.length > 0 && (
                  <dl className="grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-4">
                    {headline.map((c) => (
                      <div key={c} className="bg-fog p-5">
                        <dt className="text-xs font-semibold tracking-wide text-slate uppercase">{c}</dt>
                        <dd className="mt-1 font-display text-2xl font-semibold text-primary">{s.data[c] || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <dl className="divide-y divide-ink/10">
                  {rest.map((c) => (
                    <div key={c} className="flex justify-between gap-6 px-6 py-3">
                      <dt className="text-slate">{c}</dt>
                      <dd className="text-right font-semibold">{s.data[c] || "—"}</dd>
                    </div>
                  ))}
                </dl>

                <footer className="flex flex-wrap items-center justify-between gap-3 bg-fog px-6 py-4 text-xs text-slate">
                  <span>
                    {s.published_at ? `Published ${new Date(s.published_at).toLocaleDateString("en-GB", { dateStyle: "long" })}. ` : ""}
                    Errors and omissions excepted. The official notification is final.
                  </span>
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
          })}
        </div>
      )}
    </div>
  );
}
