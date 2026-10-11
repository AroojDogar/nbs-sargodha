import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerifyResult from "@/components/results/VerifyResult";

export const metadata: Metadata = {
  title: "Verify a result | Noon Business School",
  robots: { index: false },
};

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-ink pt-28 pb-10 text-white print:hidden">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <span className="block h-[3px] w-12 rounded bg-gold" aria-hidden />
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Result verification</h1>
          </div>
        </div>
        <section className="bg-fog py-12 lg:py-16 print:bg-white print:py-0">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <VerifyResult code={decodeURIComponent(code).replace(/[^a-z0-9]/gi, "").slice(0, 32)} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
