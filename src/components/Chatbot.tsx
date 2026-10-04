"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, Send, X } from "lucide-react";
import { answer, suggestions, type Reply } from "@/lib/chatbot";

type Message = { from: "bot" | "user"; text: string; link?: Reply["link"] };

const welcome: Message = {
  from: "bot",
  text: "Assalam o Alaikum! I'm the NBS Assistant. Ask me about programs, fees, admission, attendance, scholarships, faculty or student life.",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typing]);

  function ask(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    const reply = answer(q);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", ...reply }]);
      setTyping(false);
    }, 450);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="nbs-assistant"
        className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-primary py-3 pr-5 pl-4 font-semibold text-white shadow-xl transition-colors hover:bg-primary-dark"
      >
        {open ? <X size={22} aria-hidden /> : <MessageCircle size={22} aria-hidden />}
        <span>{open ? "Close" : "Ask NBS"}</span>
      </button>

      {open && (
        <div
          id="nbs-assistant"
          role="dialog"
          aria-label="NBS Assistant"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[min(640px,calc(100svh-7rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink/10 sm:inset-x-auto sm:right-5 sm:w-[400px]"
        >
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
            <Image src="/nbs-logo.png" alt="" width={40} height={40} className="size-10 rounded-full bg-white" />
            <div className="leading-tight">
              <p className="font-display font-semibold">NBS Assistant</p>
              <p className="text-xs text-mist">Answers from the official prospectus and orientation</p>
            </div>
          </div>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-fog p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    m.from === "user" ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-white text-ink"
                  }`}
                >
                  {m.text}
                  {m.link && (
                    <a
                      href={m.link.href}
                      onClick={() => setOpen(false)}
                      className="mt-3 block w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
                    >
                      {m.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
            {typing && (
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
                  className="shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-slate hover:border-primary hover:text-primary"
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
                placeholder="Ask about fees, admission, faculty…"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || typing}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white disabled:opacity-40"
              >
                <Send size={16} aria-hidden />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
