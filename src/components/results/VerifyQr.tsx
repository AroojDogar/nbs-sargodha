"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// QR code that opens this website's verification page for one result.
export default function VerifyQr({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const link = `${window.location.origin}/verify/${code}`;
    let cancelled = false;
    QRCode.toString(link, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0a1430", light: "#ffffff" } }).then((s) => {
      if (cancelled) return;
      setSvg(s);
      setUrl(link);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="flex items-center gap-4">
      <div
        className="size-24 shrink-0 rounded-lg bg-white p-1.5 ring-1 ring-ink/10 [&>svg]:size-full"
        role="img"
        aria-label="QR code to verify this result"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="text-xs leading-relaxed text-slate">
        <p className="font-semibold text-ink">Verify this result</p>
        <p>Scan the QR code, or open</p>
        <p className="font-mono break-all text-ink">{url ? url.replace(/^https?:\/\//, "") : "…"}</p>
        <p className="mt-1">
          Code: <span className="font-mono font-semibold tracking-wider text-ink">{code.toUpperCase()}</span>
        </p>
      </div>
    </div>
  );
}
