"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Light / dark mode"
      className={`grid size-10 place-items-center rounded-full transition-colors ${className}`}
    >
      <Moon size={20} className="dark:hidden" aria-hidden />
      <Sun size={20} className="hidden dark:block" aria-hidden />
    </button>
  );
}
