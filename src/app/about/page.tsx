import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { school, facultyOfSocialSciences, university } from "@/data/school";
import { faculty, director } from "@/data/faculty";
import { programs } from "@/data/programs";
import { clubs, motto } from "@/data/studentLife";

export const metadata: Metadata = { title: "About | Noon Business School" };

export default function AboutPage() {
  const doctorates = faculty.filter((f) => f.name.startsWith("Dr.")).length + 1; // + Director

  const leaders = [
    { name: director.name, designation: director.designation, note: `Leads ${school.name}`, photo: director.photo },
    {
      name: facultyOfSocialSciences.dean.name,
      designation: facultyOfSocialSciences.dean.designation,
      note: "Oversees the Faculty of Social Sciences, home to NBS",
      photo: "masood-sarwar-awan.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="About NBS"
          intro={`${school.name} is the business school of the ${school.university}, part of the ${school.faculty}.`}
        />

        {/* Introduction and NBS at a glance */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
            <div>
              <h2 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                Business education from BBA to PhD
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate">
                NBS offers {programs.length} degree programs in management, finance, commerce, analytics and
                entrepreneurship, with weekend options for working professionals. Students learn from{" "}
                {faculty.length + 1} faculty members, {doctorates} of whom hold a doctorate.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate">
                The school is part of the {school.faculty}, which brings together{" "}
                {facultyOfSocialSciences.students.toLocaleString()} students and{" "}
                {facultyOfSocialSciences.facultyMembers} faculty members.
              </p>
              <Link
                href="/#programs"
                className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 font-semibold text-white hover:bg-primary-dark"
              >
                Explore programs
              </Link>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-fog p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <Image src="/nbs-logo.png" alt="" width={64} height={64} className="size-16 rounded-full bg-white" />
                <p className="font-display text-2xl font-semibold">NBS at a glance</p>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { value: programs.length, label: "Degree programs", href: "/programs" },
                  { value: faculty.length + 1, label: "Faculty members", href: "/faculty" },
                  { value: doctorates, label: "Hold a doctorate", href: "/faculty" },
                  { value: clubs.length, label: "Student clubs", href: "/student-life" },
                ].map((s) => (
                  <li key={s.label}>
                    <Link href={s.href} className="group block rounded-2xl bg-white p-6 transition-shadow hover:shadow-lg">
                      <span className="block font-display text-5xl font-semibold text-primary lg:text-6xl">{s.value}</span>
                      <span className="mt-2 block text-slate group-hover:text-ink">{s.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Motto */}
        <section className="bg-ink py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Our motto</h2>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {motto.map((word, i) => (
                <li key={word} className="bg-ink p-8">
                  <span className="text-sm text-mist">Step {i + 1}</span>
                  <p className="mt-2 font-display text-4xl font-semibold text-primary-light">{word}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Leadership */}
        <section className="bg-fog py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Leadership</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {leaders.map((p) => (
                <div key={p.name} className="flex flex-col gap-6 rounded-3xl bg-white p-6 sm:flex-row sm:items-center lg:p-8">
                  <Avatar name={p.name} photo={p.photo} className="aspect-[4/5] w-full shrink-0 rounded-2xl sm:w-48 lg:w-56" />
                  <div>
                    <p className="font-display text-2xl font-semibold lg:text-3xl">{p.name}</p>
                    <p className="mt-2 font-medium text-accent">{p.designation}</p>
                    <p className="mt-3 text-slate">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Faculty of Social Sciences and University */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-10">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Faculty of Social Sciences
              </h2>
              <p className="mt-4 text-slate">
                Established in {facultyOfSocialSciences.established}. Dean: {facultyOfSocialSciences.dean.name}.
              </p>
              <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {facultyOfSocialSciences.units.map((u) => (
                  <li key={u} className={`py-4 text-lg ${u === school.name ? "font-semibold text-primary" : ""}`}>
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{university.name}</h2>
              <p className="mt-4 text-slate">
                Journey began in {university.journeyBegan}, University charter in {university.charter},{" "}
                {university.students} students today.
              </p>
              <blockquote className="mt-8 rounded-3xl bg-primary p-8 font-display text-2xl leading-snug font-medium text-white">
                {university.vision}
              </blockquote>
              <p className="mt-8 text-sm font-semibold">Values</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {university.values.map((v) => (
                  <li key={v} className="rounded-full border border-ink/15 px-4 py-2 text-sm">{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}