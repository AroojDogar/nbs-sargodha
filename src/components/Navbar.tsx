"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#programs", label: "Programs" },
  { href: "/faculty", label: "Faculty" },
  { href: "/student-life", label: "Student life" },
  { href: "/events", label: "Events" },
  { href: "/attendance", label: "Attendance" },
  { href: "/handbook", label: "Handbook" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-white/95 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/nbs-logo.png" alt="" width={48} height={48} className="size-12 rounded-full bg-white" priority />
          <span className={`leading-tight whitespace-nowrap transition-colors ${solid ? "text-ink" : "text-white"}`}>
            <span className="block font-display text-base font-semibold">Noon Business School</span>
            <span className={`block text-xs ${solid ? "text-slate" : "text-white/70"}`}>University of Sargodha</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-7">
          {links.map((l) => {
            const active = pathname === l.href;
            const cls = `text-sm font-medium transition-colors ${
              solid
                ? active ? "text-primary" : "text-slate hover:text-primary"
                : active ? "text-white underline underline-offset-8" : "text-white/85 hover:text-white"
            }`;
            return (
              <li key={l.href}>
                {l.href.includes("#") ? (
                  <a href={l.href} className={cls}>
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} aria-current={active ? "page" : undefined} className={cls}>
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle className={solid ? "text-ink hover:bg-fog" : "text-white hover:bg-white/10"} />
          <a
            href="#contact"
            className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors xl:inline-block ${
              solid ? "bg-gold text-navy hover:bg-gold-light" : "bg-gold text-navy hover:bg-gold-light"
            }`}
          >
            Contact admissions
          </a>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={`lg:hidden ${solid ? "text-ink" : "text-white"}`}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="space-y-1 border-t border-ink/10 bg-white px-4 pt-2 pb-6 lg:hidden">
          {[...links, { href: "#contact", label: "Contact admissions" }].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 font-medium text-ink hover:bg-fog"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
