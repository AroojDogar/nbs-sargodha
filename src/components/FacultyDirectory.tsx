"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Avatar from "@/components/Avatar";
import { faculty, type Rank } from "@/data/faculty";

const ranks: ("All" | Rank)[] = ["All", "Professor", "Associate Professor", "Assistant Professor", "Lecturer"];

export default function FacultyDirectory() {
  const [query, setQuery] = useState("");
  const [rank, setRank] = useState<(typeof ranks)[number]>("All");

  const q = query.trim().toLowerCase();
  const shown = faculty.filter(
    (f) =>
      (rank === "All" || f.rank === rank) &&
      (!q || `${f.name} ${f.qualification ?? ""} ${f.role ?? ""}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search faculty</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate" size={18} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or field, e.g. Finance"
            className="w-full rounded-full border border-ink/15 bg-white py-3 pr-4 pl-11 outline-none focus:border-primary"
          />
        </label>
        <div role="tablist" aria-label="Filter by rank" className="flex flex-wrap gap-2">
          {ranks.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={rank === r}
              onClick={() => setRank(r)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                rank === r ? "bg-ink text-white" : "bg-white text-slate hover:text-ink"
              }`}
            >
              {r === "All" ? "All" : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-slate" aria-live="polite">
        Showing {shown.length} of {faculty.length} faculty members
      </p>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-white p-10 text-center text-slate">
          No faculty member matches “{query}”. Try a first name or a field such as HRM.
        </p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((f) => (
            <li key={f.name} className="overflow-hidden rounded-3xl bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Avatar name={f.name} photo={f.photo} className="aspect-[4/5] w-full" />
              <div className="p-5">
                <p className="font-display text-lg font-semibold leading-snug">{f.name}</p>
                <p className="mt-1 text-sm font-medium text-primary">{f.rank}</p>
                {f.qualification && <p className="mt-1 text-sm text-slate">{f.qualification}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.role && <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{f.role}</span>}
                  {f.onLeave && <span className="rounded-full bg-fog px-3 py-1 text-xs font-semibold text-slate">On leave</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
