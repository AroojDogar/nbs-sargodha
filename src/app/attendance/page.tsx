import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileSpreadsheet, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import StudentLookup from "@/components/attendance/StudentLookup";
import { REQUIRED_PERCENT } from "@/lib/attendance";

export const metadata: Metadata = {
  title: "Online attendance | Noon Business School",
  description: "Teachers mark attendance online; students check their attendance by roll number.",
};

const features = [
  { icon: ClipboardCheck, title: "Mark in seconds", text: "Pick a class and date, tap Present, Absent or Leave, and save." },
  { icon: FileSpreadsheet, title: "Reports and Excel", text: `Each student's percentage, a list of those below ${REQUIRED_PERCENT}%, and a CSV download.` },
  { icon: ShieldCheck, title: "Private by design", text: "Every teacher sees only their own classes. Students see only their own totals." },
];

export default function AttendancePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Online attendance"
          intro={`Teachers mark attendance from any phone or laptop. Students check their own record and see if they are below the ${REQUIRED_PERCENT}% needed for the final exam.`}
          image="/images/lab.jpeg"
        />

        <section className="py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[2fr_3fr] lg:px-10">
            <div className="flex flex-col rounded-3xl bg-ink p-8 text-white lg:p-10">
              <h2 className="font-display text-3xl font-semibold tracking-tight">For teachers</h2>
              <p className="mt-4 text-lg leading-relaxed text-mist">
                Sign in with the account given to you by the NBS office to manage your classes, students and attendance.
              </p>
              <Link
                href="/attendance/teacher"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-navy hover:bg-gold-light"
              >
                Teacher sign in <ArrowRight size={18} aria-hidden />
              </Link>
            </div>

            <div className="rounded-3xl bg-fog p-8 lg:p-10">
              <h2 className="font-display text-3xl font-semibold tracking-tight">For students</h2>
              <p className="mt-4 mb-8 text-lg leading-relaxed text-slate">
                Enter your roll number to see your attendance in every course.
              </p>
              <StudentLookup />
            </div>
          </div>

          <ul className="mx-auto mt-16 grid max-w-7xl gap-10 px-6 sm:grid-cols-3 lg:px-10">
            {features.map((f) => (
              <li key={f.title}>
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <f.icon size={22} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{f.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
