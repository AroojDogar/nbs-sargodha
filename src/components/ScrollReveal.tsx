"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Gently slides content into view as you scroll. Content already on screen is never hidden,
// and nothing moves for visitors who have "reduce motion" turned on.
const SELECTOR = [
  "main section h2",
  "main section h2 + p",
  "main section figure",
  "main section table",
  "main section blockquote",
  "main section li",
  "main section .divide-y > div",
].join(", ");

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("reveal-in");
          io.unobserve(el);
          // Clean up afterwards so hover effects keep their normal speed.
          window.setTimeout(() => {
            el.classList.remove("reveal", "reveal-in");
            el.style.transitionDelay = "";
          }, 1000);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      if (el.closest("nav, header, footer, [role=dialog]")) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) return; // already visible
      const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
      el.classList.add("reveal");
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
