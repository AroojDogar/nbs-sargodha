// The NBS Assistant's AI endpoint. It sends the conversation to Google Gemini together with
// the school's data (see lib/assistantContext.ts) and streams the reply back as plain text.
// Needs GEMINI_API_KEY in .env.local (and in the Vercel project settings).
// Without a key it answers 503 and the chat falls back to the built-in answers.

import { systemPrompt } from "@/lib/assistantContext";

// Tried in order until one answers. GEMINI_MODEL, if set, is tried first.
const MODELS = [process.env.GEMINI_MODEL, "gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.1-flash-lite"].filter(
  (m, i, all): m is string => !!m && all.indexOf(m) === i,
);
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;

type ChatMessage = { role: "user" | "assistant"; text: string };

function isChat(body: unknown): body is { messages: ChatMessage[] } {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return false;
  return (body as { messages: unknown[] }).messages.every(
    (m) =>
      !!m &&
      typeof m === "object" &&
      ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
      typeof (m as ChatMessage).text === "string",
  );
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "AI is not configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!isChat(body) || !body.messages.length) return Response.json({ error: "Bad request" }, { status: 400 });

  // Keep only the recent conversation, trim long messages, and make sure it starts with the visitor.
  let history = body.messages.slice(-MAX_MESSAGES).map((m) => ({ ...m, text: m.text.slice(0, MAX_CHARS) }));
  while (history.length && history[0].role !== "user") history = history.slice(1);
  if (!history.length) return Response.json({ error: "Bad request" }, { status: 400 });

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: history.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024, thinkingConfig: { thinkingLevel: "low" } },
  });

  // Free-tier models are sometimes busy (503) or rate-limited (429); try the next one.
  let upstream: Response | null = null;
  for (const model of MODELS) {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
      { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: payload },
    ).catch(() => null);
    if (upstream?.ok && upstream.body) break;
    console.error(`Gemini ${model} failed`, upstream?.status, (await upstream?.text().catch(() => ""))?.slice(0, 300));
    upstream = null;
  }

  if (!upstream?.body) return Response.json({ error: "AI is unavailable" }, { status: 502 });

  // Gemini sends server-sent events; pass on just the text.
  const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += value;
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? "";
        let sent = false;
        for (const event of events) {
          const data = event.replace(/^data:\s?/, "");
          try {
            const json = JSON.parse(data);
            const text = (json.candidates?.[0]?.content?.parts ?? [])
              .map((p: { text?: string }) => p.text ?? "")
              .join("");
            if (text) {
              controller.enqueue(encoder.encode(text));
              sent = true;
            }
          } catch {
            // ignore keep-alives and partial lines
          }
        }
        if (sent) return;
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
