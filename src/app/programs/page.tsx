import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ProgramLadder from "@/components/ProgramLadder";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Programs | Noon Business School" };

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Programs"
          intro="Undergraduate, graduate and doctoral degrees in business, with eligibility, specializations and the official fee for every program."
          image="/images/lab.jpg"
        />
        <ProgramLadder />
        <section className="py-16">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 lg:px-10">
            <p className="max-w-2xl text-lg text-slate">
              Fees are the official totals per semester from the University prospectus and may be revised each year.
              Attendance, grading and promotion rules are in the student handbook.
            </p>
            <Link
              href="/handbook"
              className="rounded-full border border-ink/20 px-6 py-3 font-semibold hover:border-primary hover:text-primary"
            >
              Read the handbook
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}