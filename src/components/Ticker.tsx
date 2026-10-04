import { TrendingUp } from "lucide-react";
import { tickerStats } from "@/data/school";

export default function Ticker() {
  const items = [...tickerStats, ...tickerStats];

  return (
    <div className="overflow-hidden border-b border-ink/10 bg-white py-5">
      <ul className="animate-ticker flex w-max gap-16" aria-label="School at a glance">
        {items.map((s, i) => (
          <li key={i} className="flex items-center gap-3 whitespace-nowrap" aria-hidden={i >= tickerStats.length}>
            <TrendingUp size={18} className="text-accent" aria-hidden />
            <span className="font-display text-xl font-semibold text-primary">{s.value}</span>
            <span className="text-sm text-slate">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
