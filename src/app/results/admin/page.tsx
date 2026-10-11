import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ResultsAdmin from "@/components/results/ResultsAdmin";

export const metadata: Metadata = {
  title: "Results admin | Noon Business School",
  robots: { index: false },
};

export default function ResultsAdminPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-ink pt-28 pb-10 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Link href="/results" className="inline-flex items-center gap-2 text-sm text-mist hover:text-white">
              <ArrowLeft size={16} aria-hidden /> Results
            </Link>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Results office</h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <ResultsAdmin />
        </div>
      </main>
    </>
  );
}
