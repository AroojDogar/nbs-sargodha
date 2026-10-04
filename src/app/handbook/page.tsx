import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import GradeCalculator from "@/components/GradeCalculator";
import { conduct, evaluation, gradeBands, otherGrades, promotion, scholarships, uniform } from "@/data/handbook";

export const metadata: Metadata = { title: "Student handbook | Noon Business School" };

const sections = [
  { id: "attendance", label: "Attendance" },
  { id: "evaluation", label: "Exams and evaluation" },
  { id: "grading", label: "Grading" },
  { id: "promotion", label: "Promotion criteria" },
  { id: "scholarships", label: "Scholarships" },
  { id: "uniform", label: "Uniform" },
  { id: "conduct", label: "Code of conduct" },
];

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{children}</h2>
);

export default function HandbookPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Student handbook"
          intro="The rules every NBS student should know: attendance, exams, grading, promotion, scholarships, uniform and conduct."
          image="/images/library.jpg"
        />

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[14rem_1fr] lg:px-10 lg:py-28">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-semibold">On this page</p>
            <ul className="mt-4 flex flex-wrap gap-2 lg:block lg:space-y-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="rounded-full bg-fog px-3 py-1.5 text-sm text-slate hover:text-primary lg:bg-transparent lg:p-0">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-24">
            <section id="attendance" className="scroll-mt-28">
              <H2>Attendance</H2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-primary p-8 text-white">
                  <p className="font-display text-6xl font-semibold">75%</p>
                  <p className="mt-3 text-white/85">
                    Minimum attendance needed to sit the final term exam of a course.
                  </p>
                </div>
                <div className="rounded-3xl bg-fog p-8">
                  <p className="font-display text-6xl font-semibold text-primary">5%</p>
                  <p className="mt-3 text-slate">
                    For valid reasons, the Director may allow a shortfall of up to 5% of total lectures.
                  </p>
                </div>
              </div>
            </section>

            <section id="evaluation" className="scroll-mt-28">
              <H2>Exams and evaluation</H2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
                The mid-term is normally held after the first eight weeks of teaching. The final exam comes at the end
                of the semester, covers the full syllabus and includes at least 25% of the mid-term course. Course
                teachers set the exact split; for courses without a practical it is usually:
              </p>
              <div className="mt-8 flex h-16 overflow-hidden rounded-2xl text-white" role="img" aria-label="Mid-term 30%, sessional 20%, final 50%">
                {evaluation.map((e, i) => (
                  <div
                    key={e.part}
                    style={{ width: `${e.weight}%` }}
                    className={`flex items-center justify-between px-5 ${["bg-primary", "bg-accent", "bg-ink"][i]}`}
                  >
                    <span className="font-medium">{e.part}</span>
                    <span className="font-display text-xl font-semibold">{e.weight}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="grading" className="scroll-mt-28">
              <H2>Grading</H2>
              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="overflow-x-auto rounded-3xl border border-ink/10">
                  <table className="w-full text-left">
                    <thead className="bg-fog text-sm text-slate">
                      <tr>
                        <th className="px-6 py-4 font-medium">Marks (%)</th>
                        <th className="px-6 py-4 font-medium">Letter</th>
                        <th className="px-6 py-4 font-medium">Grade point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {gradeBands.map((b) => (
                        <tr key={b.letter}>
                          <td className="px-6 py-4">{b.range}</td>
                          <td className="px-6 py-4 font-display text-xl font-semibold text-primary">{b.letter}</td>
                          <td className="px-6 py-4">{b.gp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="border-t border-ink/10 px-6 py-4 text-sm text-slate">
                    {otherGrades.map((g) => `${g.letter} = ${g.meaning}`).join(", ")}
                  </p>
                </div>
                <GradeCalculator />
              </div>
            </section>

            <section id="promotion" className="scroll-mt-28">
              <H2>Promotion criteria</H2>
              <p className="mt-5 max-w-2xl text-lg text-slate">
                Each academic year includes its two semesters plus the summer semester.
              </p>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {promotion.map((p) => (
                  <div key={p.program} className="rounded-3xl bg-fog p-8">
                    <h3 className="font-display text-2xl font-semibold">{p.program}</h3>
                    <ol className="mt-6 space-y-5 border-l-2 border-primary pl-6">
                      {p.steps.map((s) => (
                        <li key={s.when}>
                          <p className="text-sm text-slate">{s.when}</p>
                          <p className="font-medium">{s.rule}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>

            <section id="scholarships" className="scroll-mt-28">
              <H2>Scholarships and financial aid</H2>
              <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {scholarships.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-baseline justify-between gap-2 py-5">
                    <span className="font-display text-xl font-semibold">{s.name}</span>
                    {s.detail && <span className="text-slate">{s.detail}</span>}
                  </li>
                ))}
              </ul>
            </section>

            <section id="uniform" className="scroll-mt-28">
              <H2>Uniform</H2>
              <p className="mt-5 text-lg text-slate">Uniform is compulsory for all students of the Faculty of Social Sciences.</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {(["female", "male"] as const).map((k) => (
                  <div key={k} className="rounded-3xl border border-ink/10 p-8">
                    <h3 className="font-display text-2xl font-semibold">{k === "female" ? "Female students" : "Male students"}</h3>
                    <ul className="mt-5 space-y-3 text-slate">
                      {uniform[k].map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="conduct" className="scroll-mt-28">
              <H2>Code of conduct</H2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {conduct.map((c) => (
                  <li key={c} className="rounded-2xl bg-fog p-6 leading-relaxed">{c}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
