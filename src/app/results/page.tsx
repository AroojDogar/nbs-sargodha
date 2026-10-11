import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import StudentResults from "@/components/results/StudentResults";

export const metadata: Metadata = {
  title: "Results | Noon Business School",
  description: "Check your NBS semester result online with your roll number and CNIC.",
};

export default function ResultsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Results"
          intro="Semester results are published here by the Deputy Registrar's office. Enter your roll number and the last 4 digits of your CNIC."
          image="/images/graduates.jpg"
          className="print:hidden"
        />
        <section className="bg-fog py-16 lg:py-20 print:bg-white print:py-0">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <StudentResults />
            <p className="mt-12 text-center text-sm text-slate print:hidden">
              Deputy Registrar&apos;s office?{" "}
              <Link href="/results/admin" className="font-semibold text-primary hover:underline">
                Sign in to upload results
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
