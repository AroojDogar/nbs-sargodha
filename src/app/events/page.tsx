import type { Metadata } from "next";
import { ArrowUpRight, Award, BookOpen, CalendarDays, Handshake, Mic, Sparkles, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { activitiesPerYear, eventsPortal, milestones, partners, recent } from "@/data/events";
import { activities } from "@/data/studentLife";

export const metadata: Metadata = {
  title: "Events and achievements | Noon Business School",
  description: "Conferences, accreditation, research grants, industry partnerships and student milestones at Noon Business School.",
};

const icons: Record<string, typeof Award> = {
  Conference: Mic,
  Accreditation: Award,
  "Faculty achievement": Trophy,
  Research: BookOpen,
  Partnership: Handshake,
  Seminar: Mic,
  Alumni: Trophy,
};

const totalActivities = activitiesPerYear.reduce((n, y) => n + y.count, 0);
const busiest = Math.max(...activitiesPerYear.map((y) => y.count));

function PortalButton({ light = false }: { light?: boolean }) {
  return (
    <a
      href={eventsPortal.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-colors ${
        light ? "bg-gold text-navy hover:bg-gold-light" : "bg-primary text-white hover:bg-primary-dark"
      }`}
    >
      Open the events portal
      <ArrowUpRight size={18} aria-hidden />
    </a>
  );
}

export default function EventsPage() {
  const [feature, ...others] = milestones;
  const FeatureIcon = icons[feature.category] ?? Sparkles;

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Events and achievements"
          intro="Conferences, accreditation, research, industry partnerships and student milestones: the record of a business school that keeps moving."
          image="/images/research-arena.jpg"
        />

        {/* Key numbers */}
        <section className="border-b border-ink/10">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 px-6 lg:grid-cols-4 lg:px-10">
            {[
              { value: `${totalActivities}+`, label: "Activities on record since 2024" },
              { value: partners.length, label: "Industry and academic MoUs" },
              { value: "3rd", label: "International conference held" },
              { value: "NBEAC", label: "Accredited business programs" },
            ].map((s) => (
              <div key={s.label} className="border-ink/10 py-10 pr-6 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-semibold tracking-tight text-primary xl:text-5xl">{s.value}</dd>
                <dd className="mt-2 text-sm text-slate">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Defining moments */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Defining moments</h2>
              <PortalButton />
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <article className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white lg:row-span-2 lg:p-12">
                <div className="absolute -top-24 -right-24 size-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
                <span className="relative inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-light">
                  <FeatureIcon size={14} aria-hidden /> {feature.category}
                </span>
                <h3 className="relative mt-8 font-display text-3xl leading-tight font-semibold lg:text-4xl">{feature.title}</h3>
                <p className="relative mt-4 flex items-center gap-2 text-gold-light">
                  <CalendarDays size={16} aria-hidden /> {feature.date}
                </p>
                {feature.text && <p className="relative mt-6 text-lg leading-relaxed text-mist">{feature.text}</p>}
              </article>

              <ul className="grid gap-6 sm:grid-cols-2">
                {others.map((m) => {
                  const Icon = icons[m.category] ?? Sparkles;
                  return (
                    <li key={m.title} className="flex flex-col rounded-3xl border border-ink/10 bg-white p-7 transition-shadow hover:shadow-lg">
                      <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Icon size={20} aria-hidden />
                      </span>
                      <p className="mt-5 text-xs font-semibold tracking-wide text-accent uppercase">{m.category}</p>
                      <h3 className="mt-2 font-display text-xl leading-snug font-semibold">{m.title}</h3>
                      <p className="mt-auto pt-4 text-sm text-slate">{m.date}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* Latest */}
        <section className="bg-fog py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Latest from the school</h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {recent.map((r) => (
                <li key={r.title} className="flex flex-col rounded-3xl bg-white p-8">
                  <p className="flex items-center justify-between gap-3 text-sm">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{r.category}</span>
                    <span className="text-slate">{r.date}</span>
                  </p>
                  <h3 className="mt-6 font-display text-2xl leading-snug font-semibold">{r.title}</h3>
                  {r.text && <p className="mt-3 leading-relaxed text-slate">{r.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Partnerships and activity per year */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[3fr_2fr] lg:px-10">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Bridges with industry and academia</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
                {partners.length} memoranda of understanding for internships, research, training and placements.
              </p>
              <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                {partners.map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-6 py-5">
                    <span className="flex items-center gap-4 font-display text-lg font-medium sm:text-xl">
                      <Handshake size={20} className="shrink-0 text-gold" aria-hidden />
                      {p.name}
                    </span>
                    <span className="shrink-0 text-sm text-slate">{p.year}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 lg:pt-4">
              <div className="rounded-3xl border border-ink/10 p-8">
                <h3 className="font-display text-2xl font-semibold">Activities per year</h3>
                <ul className="mt-8 space-y-5">
                  {activitiesPerYear.map((y) => (
                    <li key={y.year}>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{y.year}</span>
                        <span className="text-slate">{y.count} activities{y.year === new Date().getFullYear() ? " so far" : ""}</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-fog">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(y.count / busiest) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-fog p-8">
                <h3 className="font-display text-2xl font-semibold">Every year at NBS</h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {activities.map((a) => (
                    <li key={a} className="rounded-full bg-white px-4 py-2 text-sm font-medium">{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Portal call to action */}
        <section className="bg-ink py-20 text-white lg:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-6 lg:flex-row lg:items-center lg:px-10">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">The full record, month by month</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">
                The {eventsPortal.name} portal holds every conference, seminar, MoU, publication and student milestone,
                plus a printable activities booklet for guests.
              </p>
            </div>
            <PortalButton light />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
