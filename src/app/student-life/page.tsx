import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { activities, clubs, motto, studentBody } from "@/data/studentLife";

export const metadata: Metadata = { title: "Student life | Noon Business School" };

const photos = [
  { src: "/images/student.jpeg", alt: "Students on campus" },
  { src: "/images/sport.jpeg", alt: "A student competing at the sports gala" },
  { src: "/images/research-arena.jpg", alt: "Faculty at a university event" },
];

export default function StudentLifePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Student life"
          intro="Clubs, events and student leadership at NBS, built around four words: learn, participate, develop and lead."
          image="/images/students.jpg"
        />

        {/* Motto */}
        <section className="border-b border-ink/10">
          <ol className="mx-auto grid max-w-7xl grid-cols-2 px-6 lg:grid-cols-4 lg:px-10">
            {motto.map((word, i) => (
              <li key={word} className="border-ink/10 py-10 pr-6 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
                <span className="text-sm text-slate">Step {i + 1}</span>
                <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-primary lg:text-4xl xl:text-5xl">{word}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Activities */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-10">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Events through the year</h2>
              <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                {activities.map((a) => (
                  <li key={a} className="py-5 font-display text-2xl font-medium">{a}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((p, i) => (
                <div key={p.src} className={`relative overflow-hidden rounded-3xl ${i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`}>
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clubs */}
        <section className="bg-ink py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Clubs</h2>
            <p className="mt-5 max-w-2xl text-lg text-mist">
              Four clubs run in the department. Every club has its own President, Vice President and General Secretary.
            </p>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/15 sm:grid-cols-2">
              {clubs.map((c) => (
                <li key={c} className="bg-ink p-8 font-display text-2xl font-medium lg:p-10">{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Student Representative Body */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Student Representative Body</h2>
            <p className="mt-5 text-lg text-slate">{studentBody.batch}</p>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {studentBody.streams.map((s) => (
                <div key={s.name} className="rounded-3xl bg-fog p-8 lg:p-10">
                  <h3 className="font-display text-2xl font-semibold text-primary">{s.name}</h3>
                  <dl className="mt-6 grid grid-cols-2 gap-6">
                    {s.heads.map((h) => (
                      <div key={h.role}>
                        <dt className="text-sm text-slate">{h.role}</dt>
                        <dd className="mt-1 font-display text-xl font-semibold">{h.name}</dd>
                      </div>
                    ))}
                  </dl>
                  {s.groups.map((g) => (
                    <div key={g.name} className="mt-8 border-t border-ink/10 pt-6">
                      <h4 className="text-sm font-semibold">{g.name}</h4>
                      <dl className="mt-4 grid grid-cols-2 gap-6">
                        {g.members.map((m) => (
                          <div key={m.role}>
                            <dt className="text-sm text-slate">{m.role}</dt>
                            <dd className="mt-1 font-medium">{m.name}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
