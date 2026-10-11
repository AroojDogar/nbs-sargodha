"use client";

import dynamic from "next/dynamic";
import type { Step } from "@/components/AcademicPath3D";

// three.js only runs in the browser, so load the 3D scene on the client after the page is ready.
const AcademicPath3D = dynamic(() => import("@/components/AcademicPath3D"), {
  ssr: false,
  loading: () => <div className="h-[360px] animate-pulse rounded-3xl bg-fog sm:h-[440px]" />,
});

const steps: Step[] = [
  {
    label: "BBA",
    title: "Bachelor of Business Administration",
    text: "Four years and eight semesters, with AI in Business, Fintech and E-Commerce, a professional certification and a field internship. A 2-year BBA is offered after 14 years of education.",
  },
  {
    label: "BS",
    title: "Five specialised BS programs",
    text: "Islamic Banking and Finance, Entrepreneurship, Commerce, Business Analytics, and Accounting and Finance: four years each, for students who already know their field.",
  },
  {
    label: "MBA",
    title: "MBA and Executive MBA",
    text: "A 1.5-year MBA for business graduates, a 2-year MBA for other fields, and a weekend Executive MBA for professionals with three years of experience.",
  },
  {
    label: "MS",
    title: "MS Management Sciences",
    text: "A weekend research degree that prepares graduates for teaching, research and senior roles in industry.",
  },
  {
    label: "PhD",
    title: "PhD Management Sciences",
    text: "The top of the ladder: doctoral research under the school's PhD faculty, also run on weekends.",
  },
];

export default function AcademicPathSection() {
  return (
    <section id="path" className="scroll-mt-20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">One school, every step</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
          Climb from your first bachelor&apos;s class to a doctorate without changing institutions. Turn the model and
          pick a step to see what it offers.
        </p>
        <div className="mt-12">
          <AcademicPath3D steps={steps} />
        </div>
      </div>
    </section>
  );
}
