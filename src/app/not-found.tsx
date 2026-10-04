import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 pt-44 pb-28 lg:px-10">
          <p className="font-display text-8xl font-semibold text-primary-light sm:text-9xl">404</p>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist">
            The link may be mistyped, or the page may have moved. These are the pages most people look for:
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {[
              { href: "/", label: "Home" },
              { href: "/#programs", label: "Programs" },
              { href: "/faculty", label: "Faculty" },
              { href: "/handbook", label: "Student handbook" },
            ].map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`inline-block rounded-full px-6 py-3 font-semibold transition-colors ${
                    i === 0 ? "bg-white text-ink hover:bg-primary-light" : "border border-white/30 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
