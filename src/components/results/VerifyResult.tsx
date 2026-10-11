"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ResultCard, type PublishedResult } from "@/components/results/StudentResults";

export default function VerifyResult({ code }: { code: string }) {
  const [result, setResult] = useState<PublishedResult | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.rpc("verify_result", { p_code: code }).then(({ data }) => {
      if (!cancelled) setResult(((data ?? []) as PublishedResult[])[0] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!supabase || result === undefined) return <div className="h-64 animate-pulse rounded-3xl bg-white" />;

  if (!result)
    return (
      <div className="rounded-3xl bg-white p-8 text-center ring-2 ring-red-200">
        <ShieldAlert className="mx-auto text-red-600" size={48} aria-hidden />
        <h3 className="mt-4 font-display text-3xl font-semibold text-red-700">Not verified</h3>
        <p className="mx-auto mt-3 max-w-lg text-slate">
          No published result matches the code <strong className="font-mono text-ink">{code.toUpperCase()}</strong>. The result card may
          have been altered, or the result has been withdrawn. Please contact the examination office of Noon Business School.
        </p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-emerald-50 p-6 ring-2 ring-emerald-200">
        <ShieldCheck className="shrink-0 text-emerald-600" size={44} aria-hidden />
        <div>
          <h3 className="font-display text-2xl font-semibold text-emerald-800">Verified result</h3>
          <p className="mt-1 text-emerald-900">
            This result was published by Noon Business School, University of Sargodha. Compare it with the printed card: every mark and
            grade should match exactly.
          </p>
        </div>
      </div>
      <ResultCard r={result} studentId={result.roll_no ?? ""} />
    </div>
  );
}
