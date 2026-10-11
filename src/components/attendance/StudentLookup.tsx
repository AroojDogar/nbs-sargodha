"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { percent, REQUIRED_PERCENT } from "@/lib/attendance";

interface Row {
  class_name: string;
  course: string;
  present: number;
  absent: number;
  on_leave: number;
  total: number;
}

export default function StudentLookup() {
  const [roll, setRoll] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || roll.trim().length < 3) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase.rpc("student_attendance", { p_roll: roll.trim() });
    setLoading(false);
    if (error) {
      setError("Could not load attendance right now. Please try again.");
      setRows(null);
      return;
    }
    setRows(data as Row[]);
  }

  return (
    <div>
      <form onSubmit={lookup} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="roll" className="sr-only">
          Roll number
        </label>
        <input
          id="roll"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="Your roll number, e.g. BBAF24M001"
          autoComplete="off"
          disabled={!supabase}
          className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-5 py-3 outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!supabase || loading || roll.trim().length < 3}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <Search size={18} aria-hidden />
          {loading ? "Checking…" : "Check attendance"}
        </button>
      </form>

      {!supabase && <p className="mt-4 text-sm text-slate">The attendance portal is not set up yet.</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {rows && (
        <div className="mt-8" aria-live="polite">
          {rows.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-slate">
              No record found for <strong className="text-ink">{roll.trim()}</strong>. Check the roll number exactly as your teacher entered it.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {rows.map((r) => {
                const p = percent(r);
                const short = r.total > 0 && p < REQUIRED_PERCENT;
                return (
                  <li key={r.class_name + r.course} className="rounded-2xl bg-white p-6">
                    <p className="text-sm text-slate">{r.class_name}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{r.course}</p>
                    <p className={`mt-4 font-display text-4xl font-semibold ${short ? "text-red-600" : "text-primary"}`}>
                      {r.total ? `${p}%` : "—"}
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-fog">
                      <div className={`h-full rounded-full ${short ? "bg-red-500" : "bg-primary"}`} style={{ width: `${p}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-slate">
                      {r.present} present · {r.absent} absent · {r.on_leave} leave · {r.total} lectures
                    </p>
                    {short && (
                      <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                        Below {REQUIRED_PERCENT}%: you may not be allowed to sit the final exam.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
