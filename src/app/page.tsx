import Image from "next/image";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import ProgramLadder from "@/components/ProgramLadder";
import AcademicPathSection from "@/components/AcademicPathSection";
import Footer from "@/components/Footer";
import { school, facultyOfSocialSciences, university } from "@/data/school";
import { faculty, director, type Rank } from "@/data/faculty";
import { programs } from "@/data/programs";
import { clubs } from "@/data/studentLife";
import { eventsPortal, milestones } from "@/data/events";
import { ArrowUpRight } from "lucide-react";

const reasons = [
  {
    title: "Every level in one school",
    text: "Start with a BBA or one of six BS programs, then continue to an MBA, Executive MBA, MS or PhD without changing institutions.",
  },
  {
    title: "Courses built for today's market",
    text: "The BBA includes AI in Business, Fintech, Digital Transformation and Innovation, and E-Commerce and Digital Business.",
  },
  {
    title: "Certification and internship built in",
    text: "BBA students complete a professional certification and a field internship as part of their degree, so they graduate with experience.",
  },
  {
    title: "Weekend study for professionals",
    text: "The Executive MBA, MS and PhD in Management Sciences run on weekends, so you can keep working while you study.",
  },
];

const gallery = [
  { src: "/images/student.jpeg", alt: "Students on campus", caption: "Student life", big: true },
  { src: "/images/research-arena.jpg", alt: "Faculty at the Research Arena event", caption: "Research Arena" },
  { src: "/images/uos.jpg", alt: "Shelves in the university library", caption: "University library" },
  { src: "/images/sport.jpeg", alt: "A student competing in a tug of war", caption: "Sports gala" },
  { src: "/images/lab.jpeg", alt: "Students working in a computer lab", caption: "Computer labs" },
];

const ranks: Rank[] = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];

export default function Home() {
  const doctorates = faculty.filter((f) => f.name.startsWith("Dr.")).length + 1; // + Director

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />

        {/* About */}
        <section id="about" className="scroll-mt-20 py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
            <div>
              <h2 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                The business school of the University of Sargodha
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate">
                {school.name} is part of the {school.faculty}, which brings together{" "}
                {facultyOfSocialSciences.students.toLocaleString()} students and{" "}
                {facultyOfSocialSciences.facultyMembers} faculty members across eight departments and institutes.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate">
                The University itself traces its history to {university.journeyBegan}, received its charter in{" "}
                {university.charter}, and today serves {university.students} students with links to partner
                institutions in {university.globalLinkages.join(", ")}.
              </p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-fog p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <Image src="/nbs-logo.png" alt="" width={64} height={64} className="size-16 rounded-full bg-white" />
                <p className="font-display text-2xl font-semibold">NBS at a glance</p>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { value: programs.length, label: "Degree programs", href: "#programs" },
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

        <AcademicPathSection />

        <ProgramLadder />

        {/* Why NBS */}
        <section id="why" className="scroll-mt-20 py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[2fr_3fr] lg:px-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                Why study at Noon Business School
              </h2>
              <Image
                src="/images/nbs.jpeg"
                alt="Students working in a university computer lab"
                width={815}
                height={543}
                className="mt-8 aspect-[3/2] w-full rounded-3xl object-cover"
              />
            </div>
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {reasons.map((r) => (
                <div key={r.title} className="grid gap-3 py-9 sm:grid-cols-[1fr_1.4fr] sm:gap-10">
                  <h3 className="font-display text-2xl font-semibold text-primary">{r.title}</h3>
                  <p className="text-lg leading-relaxed text-slate">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership and faculty */}
        <section id="leadership" className="scroll-mt-20 bg-fog py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Leadership and faculty</h2>
              <Link href="/faculty" className="rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
                Meet all faculty
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                {
                  name: director.name,
                  designation: director.designation,
                  note: `Leads ${school.name}`,
                  photo: director.photo,
                },
                {
                  name: facultyOfSocialSciences.dean.name,
                  designation: facultyOfSocialSciences.dean.designation,
                  note: "Oversees the Faculty of Social Sciences, home to NBS",
                  photo: "sarwar.jpg", // put the photo in public/people
                },
              ].map((p) => (
                <div key={p.name} className="flex flex-col gap-6 rounded-3xl bg-white p-6 sm:flex-row sm:items-center lg:p-8">
                  <Avatar
                    name={p.name}
                    photo={p.photo}
                    className="aspect-[4/5] w-full shrink-0 rounded-2xl sm:w-48 lg:w-56"
                  />
                  <div>
                    <p className="font-display text-2xl font-semibold lg:text-3xl">{p.name}</p>
                    <p className="mt-2 font-medium text-accent">{p.designation}</p>
                    <p className="mt-3 text-slate">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-8 rounded-3xl bg-ink p-10 text-white sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="font-display text-5xl font-semibold text-primary-light">{doctorates}</p>
                <p className="mt-2 text-mist">faculty members hold a doctorate</p>
              </div>
              {ranks.map((rank) => (
                <div key={rank}>
                  <p className="font-display text-5xl font-semibold">{faculty.filter((f) => f.rank === rank).length}</p>
                  <p className="mt-2 text-mist">{rank}s</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events and achievements */}
        <section id="events" className="scroll-mt-20 bg-ink py-24 text-white lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Events and achievements</h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">
                  International conferences, NBEAC accreditation, research grants and new industry partnerships.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/events" className="rounded-full bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-light">
                  See all highlights
                </Link>
                <a
                  href={eventsPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold hover:border-gold-light hover:text-gold-light"
                >
                  Events portal <ArrowUpRight size={18} aria-hidden />
                </a>
              </div>
            </div>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {milestones.slice(0, 4).map((m) => (
                <li key={m.title} className="flex flex-col bg-ink p-8">
                  <p className="text-xs font-semibold tracking-wide text-gold-light uppercase">{m.category}</p>
                  <p className="mt-4 font-display text-xl leading-snug font-semibold">{m.title}</p>
                  <p className="mt-auto pt-6 text-sm text-mist">{m.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Campus life */}
        <section id="life" className="scroll-mt-20 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Life on campus</h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
                  Four student clubs, a CEO Forum, a sports gala and more, on a green campus in the heart of Sargodha.
                </p>
              </div>
              <Link href="/student-life" className="rounded-full border border-ink/20 px-6 py-3 font-semibold hover:border-primary hover:text-primary">
                Explore student life
              </Link>
            </div>
            <div className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((g) => (
                <figure
                  key={g.src}
                  className={`group relative overflow-hidden rounded-3xl ${g.big ? "sm:col-span-2 sm:row-span-2" : ""}`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-5 pt-10 pb-4 font-medium text-white">
                    {g.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}