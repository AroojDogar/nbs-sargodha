import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import FacultyDirectory from "@/components/FacultyDirectory";
import { director, adminStaff, supportStaff } from "@/data/faculty";
import { school } from "@/data/school";

export const metadata: Metadata = { title: "Faculty and staff | Noon Business School" };

export default function FacultyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Faculty and staff"
          intro="Meet the professors, lecturers and administrators who teach and support students at Malik Firoz Khan Noon Business School."
        />

        <section className="bg-fog py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid overflow-hidden rounded-3xl bg-ink text-white md:grid-cols-[18rem_1fr]">
              <Avatar name={director.name} photo={director.photo} className="aspect-[4/5] md:aspect-auto md:h-full" />
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <p className="text-sm text-primary-light">Director</p>
                <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">{director.name}</h2>
                <p className="mt-2 text-mist">
                  {director.designation}, {director.qualification}
                </p>
                <p className="mt-6 max-w-xl leading-relaxed text-white/80">
                  Leads {school.name}, overseeing its undergraduate, graduate and doctoral programs.
                </p>
                <a href={`mailto:${school.contact.email}`} className="mt-6 text-primary-light underline-offset-4 hover:underline">
                  {school.contact.email}
                </a>
              </div>
            </div>

            <h2 className="mt-20 font-display text-4xl font-semibold tracking-tight">Teaching faculty</h2>
            <div className="mt-8">
              <FacultyDirectory />
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-4xl font-semibold tracking-tight">Administration</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate">
              For enrollment, records, labs and day-to-day questions, these are the people to see.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {adminStaff.map((s) => (
                <li key={s.name}>
                  <Avatar name={s.name} photo={s.photo} className="aspect-square w-full rounded-3xl" />
                  <p className="mt-4 font-display text-lg font-semibold">{s.name}</p>
                  <p className="text-sm text-slate">{s.role}</p>
                </li>
              ))}
            </ul>

            <div className="mt-14 rounded-3xl bg-fog p-8">
              <h3 className="font-display text-xl font-semibold">Support staff (Naib Qasids)</h3>
              <p className="mt-3 text-slate">{supportStaff.join(", ")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
