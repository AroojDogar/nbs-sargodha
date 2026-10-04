"use client";

import { useState } from "react";
import { gradeFor } from "@/data/handbook";

export default function GradeCalculator() {
  const [value, setValue] = useState("72");
  const n = Number(value);
  const valid = value !== "" && !Number.isNaN(n) && n >= 0 && n <= 100;
  const result = valid ? gradeFor(n) : null;

  return (
    <div className="rounded-3xl bg-ink p-8 text-white lg:p-10">
      <label htmlFor="marks" className="font-display text-2xl font-semibold">
        Check your grade
      </label>
      <p className="mt-2 text-mist">Enter your percentage in a course to see its grade point and letter grade.</p>
      <div className="mt-8 flex flex-wrap items-end gap-8">
        <div>
          <input
            id="marks"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-describedby="marks-result"
            className="w-36 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 font-display text-4xl font-semibold outline-none focus:border-primary-light"
          />
          <span className="ml-2 text-2xl text-mist">%</span>
        </div>
        <div id="marks-result" aria-live="polite" className="flex gap-10">
          {result ? (
            <>
              <div>
                <p className="text-sm text-mist">Grade point</p>
                <p className="font-display text-5xl font-semibold text-primary-light">{result.gp.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-mist">Letter grade</p>
                <p className="font-display text-5xl font-semibold">{result.letter}</p>
              </div>
            </>
          ) : (
            <p className="text-mist">Enter a number from 0 to 100.</p>
          )}
        </div>
      </div>
    </div>
  );
}
