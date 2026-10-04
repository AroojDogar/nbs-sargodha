"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { programs, type ProgramLevel } from "@/data/programs";
import ProgramCompare from "@/components/ProgramCompare";

const filters: ("All" | ProgramLevel)[] = ["All", "Undergraduate", "Graduate", "Postgraduate"];

const pkr = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

export default function ProgramLadder() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [openSlug, setOpenSlug] = useState<string | null>("bba");

  const shown = filter === "All" ? programs : programs.filter((p) => p.level === filter);

  return (
    <section id="programs" className="scroll-mt-20 bg-ink py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Programs</h2>
            <p className="mt-5 text-lg leading-relaxed text-mist">
              Choose a level to narrow the list, then open any program to see eligibility,
              specializations and fees.
            </p>
          </div>

          <div role="tablist" aria-label="Filter programs by level" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const count = f === "All" ? programs.length : programs.filter((p) => p.level === f).length;
              const active = filter === f;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-white text-ink" : "border border-white/20 text-mist hover:border-white/50 hover:text-white"
                  }`}
                >
                  {f} <span className={active ? "text-primary" : "text-white/40"}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-14 border-t border-white/15">
          {shown.map((p) => {
            const open = openSlug === p.slug;
            return (
              <li key={p.slug} className="border-b border-white/15">
                <button
                  onClick={() => setOpenSlug(open ? null : p.slug)}
                  aria-expanded={open}
                  className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-7 text-left md:grid-cols-[1fr_8rem_12rem_7rem_auto]"
                >
                  <span className="font-display text-xl font-medium transition-colors group-hover:text-primary-light sm:text-2xl">
                    {p.title}
                  </span>
                  <span className="hidden text-mist md:block">{p.duration}</span>
                  <span className="hidden text-mist md:block">{p.creditHours.split(" ")[0]} credit hours</span>
                  <span className="hidden md:block">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.mode === "Weekend" ? "bg-accent/20 text-[#f0a184]" : "bg-primary/30 text-primary-light"
                      }`}
                    >
                      {p.mode}
                    </span>
                  </span>
                  <span
                    className={`row-span-2 grid size-10 place-items-center rounded-full border border-white/20 transition-all md:row-span-1 ${
                      open ? "rotate-45 bg-white text-ink" : "text-white"
                    }`}
                    aria-hidden
                  >
                    <Plus size={18} />
                  </span>
                  <span className="text-sm text-mist md:hidden">
                    {p.duration}, {p.mode.toLowerCase()}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-10 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-semibold text-primary-light">Eligibility</h3>
                          <p className="mt-2 max-w-prose leading-relaxed text-white/80">{p.eligibility}</p>

                          {p.specializations && (
                            <>
                              <h3 className="mt-6 text-sm font-semibold text-primary-light">Specializations</h3>
                              <p className="mt-2 text-white/80">{p.specializations.join(", ")}</p>
                            </>
                          )}

                          {p.highlights && (
                            <>
                              <h3 className="mt-6 text-sm font-semibold text-primary-light">Courses you will take</h3>
                              <ul className="mt-3 flex flex-wrap gap-2">
                                {p.highlights.map((h) => (
                                  <li key={h} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>

                        <dl className="space-y-4 rounded-2xl bg-white p-6 text-ink">
                          <div>
                            <dt className="text-sm text-slate">Semesters</dt>
                            <dd className="font-display text-lg font-medium">{p.semesters}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-slate">Degree requirements</dt>
                            <dd className="font-display text-lg font-medium">{p.creditHours}</dd>
                          </div>
                          {p.seats && (
                            <div>
                              <dt className="text-sm text-slate">Seats offered</dt>
                              <dd className="font-display text-lg font-medium">{p.seats}</dd>
                            </div>
                          )}
                          {p.fees && (
                            <div>
                              <dt className="text-sm text-slate">Total fee per semester</dt>
                              <dd className="mt-2 space-y-3">
                                {p.fees.map((f) => (
                                  <div key={f.label}>
                                    {p.fees!.length > 1 && <p className="text-sm font-semibold">{f.label}</p>}
                                    <p className="font-display text-lg font-medium">
                                      {pkr(f.firstSemester)} <span className="text-sm font-normal text-slate">first semester</span>
                                    </p>
                                    <p className="font-display text-lg font-medium">
                                      {pkr(f.laterSemesters)} <span className="text-sm font-normal text-slate">each semester after</span>
                                    </p>
                                  </div>
                                ))}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <ProgramCompare />
      </div>
    </section>
  );
}
