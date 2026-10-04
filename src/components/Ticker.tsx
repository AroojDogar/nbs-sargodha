import { TrendingUp } from "lucide-react";
import { tickerStats } from "@/data/school";

export default function Ticker() {
  const items = [...tickerStats, ...tickerStats];

  return (
    <div className="overflow-hidden border-y border-gold/20 bg-ink py-5 text-white">
      <ul className="animate-ticker flex w-max gap-16" aria-label="School at a glance">
        {items.map((s, i) => (
          <li key={i} className="flex items-center gap-3 whitespace-nowrap" aria-hidden={i >= tickerStats.length}>
            <TrendingUp size={18} className="text-gold" aria-hidden />
            <span className="font-display text-xl font-semibold text-gold-light">{s.value}</span>
            <span className="text-sm text-mist">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
