"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { answer, suggestions, type Reply } from "@/lib/chatbot";

type Message = { from: "bot" | "user"; text: string; link?: Reply["link"] };

const welcome: Message = {
  from: "bot",
  text: "Assalam o Alaikum! I'm the **NBS Assistant**. Ask me anything about programs, fees, admission, attendance, scholarships, faculty, events or student life. You can write in English or Roman Urdu.",
};

// Tiny, safe markdown: **bold**, [links](/page) and "- " / "• " bullets.
function inline(text: string, close: () => void): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(\s*[^)\s]+\s*\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(\s*([^)\s]+)\s*\)$/);
    if (link) {
      const href = link[2];
      if (!/[a-z]/i.test(link[1])) return null; // e.g. "[/](/)": no readable label
      const external = /^https?:\/\//.test(href);
      if (!external && !href.startsWith("/") && !href.startsWith("#")) return link[1];
      return (
        <a
          key={i}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: close })}
          className="font-semibold text-primary underline underline-offset-2"
        >
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Rich({ text, close }: { text: string; close: () => void }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={blocks.length} className="my-1 list-disc space-y-1 pl-5">
        {bullets.map((b, i) => <li key={i}>{inline(b, close)}</li>)}
      </ul>,
    );
    bullets = [];
  };
  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length}>{inline(line, close)}</p>);
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiReady, setAiReady] = useState<boolean | null>(null); // null = not tried yet
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]);

  function replyLocally(q: string) {
    const reply = answer(q);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", ...reply }]);
      setBusy(false);
    }, 350);
  }

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history = [...messages.slice(1), { from: "user" as const, text: q }];
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setBusy(true);

    if (aiReady === false) return replyLocally(q);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.from === "user" ? "user" : "assistant", text: m.text })),
        }),
      });
      if (!res.ok || !res.body) {
        if (res.status === 503) setAiReady(false);
        return replyLocally(q);
      }
      setAiReady(true);

      // Show the answer as it arrives.
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let started = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        if (!started) {
          started = true;
          setMessages((m) => [...m, { from: "bot", text: value }]);
        } else {
          setMessages((m) => {
            const last = m[m.length - 1];
            return [...m.slice(0, -1), { ...last, text: last.text + value }];
          });
        }
      }
      if (!started) return replyLocally(q);
      setBusy(false);
    } catch {
      replyLocally(q);
    }
  }

  const waiting = busy && messages[messages.length - 1]?.from === "user";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="nbs-assistant"
        className="group fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-primary py-3 pr-5 pl-4 font-semibold text-white shadow-xl ring-4 ring-gold/30 transition-all hover:bg-primary-dark hover:ring-gold/50"
      >
        {open ? <X size={22} aria-hidden /> : <MessageCircle size={22} aria-hidden />}
        <span>{open ? "Close" : "Ask NBS AI"}</span>
        {!open && (
          <span className="absolute -top-1 -right-1 flex size-3" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-gold" />
          </span>
        )}
      </button>

      {open && (
        <div
          id="nbs-assistant"
          role="dialog"
          aria-label="NBS Assistant"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[min(680px,calc(100svh-7rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink/10 sm:inset-x-auto sm:right-5 sm:w-[420px]"
        >
          <div className="flex items-center gap-3 border-b-2 border-gold bg-ink px-5 py-4 text-white">
            <Image src="/nbs-logo.png" alt="" width={40} height={40} className="size-10 rounded-full bg-white" />
            <div className="flex-1 leading-tight">
              <p className="flex items-center gap-2 font-display font-semibold">
                NBS Assistant
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gold-light uppercase">
                  <Sparkles size={10} aria-hidden /> AI
                </span>
              </p>
              <p className="mt-0.5 text-xs text-mist">
                {aiReady === false ? "Answers from the official prospectus" : "Powered by Google Gemini · trained on NBS data"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMessages([welcome])}
              aria-label="Start a new chat"
              title="New chat"
              disabled={busy}
              className="grid size-9 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <RotateCcw size={16} aria-hidden />
            </button>
          </div>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-fog p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.from === "user" ? "rounded-br-md bg-primary text-white whitespace-pre-line" : "rounded-bl-md bg-white text-ink shadow-sm"
                  }`}
                >
                  {m.from === "user" ? m.text : <Rich text={m.text} close={close} />}
                  {m.link && (
                    <a
                      href={m.link.href}
                      onClick={close}
                      className="mt-3 block w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
                    >
                      {m.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
            {waiting && (
              <div className="flex gap-1 px-2" aria-label="NBS Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-2 animate-bounce rounded-full bg-slate/50" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-ink/10 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  disabled={busy}
                  className="shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-slate hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex gap-2"
            >
              <label htmlFor="nbs-question" className="sr-only">
                Your question
              </label>
              <input
                id="nbs-question"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about NBS…"
                maxLength={1000}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || busy}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white disabled:opacity-40"
              >
                <Send size={16} aria-hidden />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-slate">AI can make mistakes. Please confirm fees and dates with the NBS office.</p>
          </div>
        </div>
      )}
    </>
  );
}
