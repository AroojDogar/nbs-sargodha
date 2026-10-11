"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, Eye, EyeOff, FilePlus2, LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { parseSheet, summaryLabel, type Layout, type ResultRow } from "@/lib/results";
import { NotConfigured, SignIn } from "@/components/attendance/TeacherPortal";
import { ResultCard, type PublishedResult } from "@/components/results/StudentResults";

interface SheetRow {
  id: string;
  title: string;
  session: string;
  semester: string | null;
  declared_on: string | null;
  columns: Layout;
  published: boolean;
  published_at: string | null;
  created_at: string;
  results: { count: number }[];
}

type Meta = Pick<PublishedResult, "title" | "session" | "semester" | "declared_on">;

const input = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-primary";
const sheetName = (s: { title: string; semester: string | null; session: string }) =>
  `${s.title}${s.semester ? ` · Semester ${s.semester}` : ""} · ${s.session}`;

// All students in a sheet; click one to see exactly what that student will see.
function Students({ layout, rows, meta }: { layout: Layout; rows: ResultRow[]; meta: Meta }) {
  const [open, setOpen] = useState<string | null>(null);
  const pick = (label: string) => layout.summary.find((s) => summaryLabel(s) === label);
  const cols = ["GPA", "CGPA", "Result status"].map((l) => ({ label: l, key: pick(l) })).filter((c) => c.key);
  const selected = rows.find((r) => r.roll_no === open);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <div className="max-h-[640px] overflow-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-fog text-slate">
            <tr>
              <th className="px-3 py-2 font-semibold">Student ID</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              {cols.map((c) => (
                <th key={c.label} className="px-3 py-2 font-semibold whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((r) => (
              <tr
                key={r.roll_no}
                onClick={() => setOpen(r.roll_no)}
                className={`cursor-pointer hover:bg-fog ${open === r.roll_no ? "bg-primary/10" : ""}`}
              >
                <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{r.roll_no}</td>
                <td className="px-3 py-2">{r.data.name}</td>
                {cols.map((c) => (
                  <td key={c.label} className="px-3 py-2 whitespace-nowrap">
                    {r.data.summary[c.key!] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {selected ? (
          <ResultCard
            r={{ ...meta, published_at: null, layout, data: selected.data }}
            studentId={selected.roll_no}
          />
        ) : (
          <div className="grid h-full min-h-[240px] place-items-center rounded-2xl bg-fog p-8 text-center text-slate">
            Click a student to see their result card exactly as they will see it.
          </div>
        )}
      </div>
    </div>
  );
}

function NewSheet({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("");
  const [declared, setDeclared] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => (text.trim() ? parseSheet(text) : null), [text]);
  const ok = !!parsed && !parsed.errors.length && parsed.rows.length > 0;

  async function save() {
    if (!ok) return;
    setSaving(true);
    setError("");
    const { data: sheet, error } = await supabase!
      .from("result_sheets")
      .insert({
        title: title.trim(),
        semester: semester.trim() || null,
        session: session.trim(),
        declared_on: declared || null,
        columns: parsed.layout,
      })
      .select("id")
      .single();
    if (error) {
      setSaving(false);
      return setError(error.message);
    }
    for (let i = 0; i < parsed.rows.length; i += 500) {
      const chunk = parsed.rows.slice(i, i + 500).map((r) => ({ ...r, sheet_id: sheet.id }));
      const { error } = await supabase!.from("results").insert(chunk);
      if (error) {
        await supabase!.from("result_sheets").delete().eq("id", sheet.id);
        setSaving(false);
        return setError(error.message);
      }
    }
    setSaving(false);
    onDone();
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={onDone} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={16} aria-hidden /> All result sheets
      </button>
      <h2 className="font-display text-3xl font-semibold">Upload a result sheet</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium">
          Program
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. BS-Commerce" className={`mt-1 ${input}`} />
        </label>
        <label className="text-sm font-medium">
          Semester
          <input value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="e.g. IV" className={`mt-1 ${input}`} />
        </label>
        <label className="text-sm font-medium">
          Session
          <input value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2024-2028" className={`mt-1 ${input}`} />
        </label>
        <label className="text-sm font-medium">
          Result declaration date
          <input type="date" value={declared} onChange={(e) => setDeclared(e.target.value)} className={`mt-1 ${input}`} />
        </label>
      </div>

      <div>
        <label htmlFor="sheet" className="text-sm font-medium">
          Paste the consolidated result from Excel
        </label>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate">
          <li>
            In Excel, select from the <strong>subject names row</strong> (above &quot;Credit Hours&quot;) down to the{" "}
            <strong>last student</strong>, across to the <strong>RESULT STATUS</strong> column.
          </li>
          <li>Press Ctrl+C, click in the box below and press Ctrl+V.</li>
          <li>Check the preview: click a few students and compare with the sheet.</li>
        </ol>
        <textarea
          id="sheet"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste here…"
          className={`mt-3 font-mono text-xs ${input}`}
        />
      </div>

      {parsed && parsed.errors.length > 0 && (
        <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-800">
          <p className="font-semibold">This doesn&apos;t look right yet:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {parsed.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {parsed && parsed.warnings.length > 0 && (
        <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">
          <ul className="list-disc space-y-1 pl-5">
            {parsed.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {ok && (
        <div className="space-y-4">
          <p className="text-sm">
            <strong>{parsed.rows.length} students</strong> and <strong>{parsed.layout.subjects.length} subjects</strong> found:{" "}
            <span className="text-slate">
              {parsed.layout.subjects.map((s) => `${s.name} (${s.code}, ${s.credits || "?"} cr)`).join(" · ")}
            </span>
          </p>
          <Students
            layout={parsed.layout}
            rows={parsed.rows}
            meta={{ title: title || "Program", semester: semester || null, session: session || "Session", declared_on: declared || null }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving || !title.trim() || !session.trim() || !ok}
          className="rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save as draft"}
        </button>
        <p className="text-sm text-slate">Students cannot see a sheet until you press Publish on it.</p>
      </div>
    </div>
  );
}

function SheetView({ sheet, onBack }: { sheet: SheetRow; onBack: () => void }) {
  const [rows, setRows] = useState<ResultRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("results")
      .select("roll_no, data")
      .eq("sheet_id", sheet.id)
      .order("roll_no")
      .then(({ data }) => !cancelled && setRows((data ?? []) as ResultRow[]));
    return () => {
      cancelled = true;
    };
  }, [sheet.id]);

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={16} aria-hidden /> All result sheets
      </button>
      <h2 className="font-display text-3xl font-semibold">{sheetName(sheet)}</h2>
      {rows ? <Students layout={sheet.columns} rows={rows} meta={sheet} /> : <div className="h-40 animate-pulse rounded-2xl bg-fog" />}
    </div>
  );
}

function Sheets({ session }: { session: Session }) {
  const [sheets, setSheets] = useState<SheetRow[]>([]);
  const [view, setView] = useState<"list" | "new" | string>("list");
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const reload = () => setVersion((v) => v + 1);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("result_sheets")
      .select("id, title, session, semester, declared_on, columns, published, published_at, created_at, results(count)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) return setError(error.message);
        setSheets((data ?? []) as SheetRow[]);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  async function togglePublish(s: SheetRow) {
    const publish = !s.published;
    if (
      !confirm(
        `${publish ? "Publish" : "Unpublish"} "${sheetName(s)}"? ${publish ? "Students will be able to see it immediately." : "Students will no longer see it."}`,
      )
    )
      return;
    const { error } = await supabase!
      .from("result_sheets")
      .update({ published: publish, published_at: publish ? new Date().toISOString() : null })
      .eq("id", s.id);
    if (error) return setError(error.message);
    reload();
  }

  async function remove(s: SheetRow) {
    if (!confirm(`Delete "${sheetName(s)}" and all its results? This cannot be undone.`)) return;
    const { error } = await supabase!.from("result_sheets").delete().eq("id", s.id);
    if (error) return setError(error.message);
    reload();
  }

  const header = (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-fog px-4 py-3 text-sm">
      <span className="text-slate">
        Signed in as <strong className="text-ink">{session.user.email}</strong> (results office)
      </span>
      <button type="button" onClick={() => supabase!.auth.signOut()} className="inline-flex items-center gap-1 font-semibold text-primary">
        <LogOut size={14} aria-hidden /> Sign out
      </button>
    </div>
  );

  if (view === "new")
    return (
      <>
        {header}
        <NewSheet
          onDone={() => {
            setView("list");
            reload();
          }}
        />
      </>
    );

  const open = sheets.find((s) => s.id === view);
  if (open)
    return (
      <>
        {header}
        <SheetView sheet={open} onBack={() => setView("list")} />
      </>
    );

  return (
    <>
      {header}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold">Result sheets</h2>
        <button
          type="button"
          onClick={() => setView("new")}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
        >
          <FilePlus2 size={18} aria-hidden /> Upload result sheet
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <ul className="mt-8 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
        {sheets.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
            <button type="button" onClick={() => setView(s.id)} className="min-w-0 flex-1 text-left">
              <span className="block font-display text-lg font-semibold hover:text-primary">{sheetName(s)}</span>
              <span className="text-sm text-slate">
                {s.results[0]?.count ?? 0} students · uploaded {new Date(s.created_at).toLocaleDateString("en-GB", { dateStyle: "medium" })}
              </span>
            </button>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                s.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {s.published ? "Published" : "Draft"}
            </span>
            <button
              type="button"
              onClick={() => togglePublish(s)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                s.published ? "border border-ink/15 hover:border-primary hover:text-primary" : "bg-gold text-navy hover:bg-gold-light"
              }`}
            >
              {s.published ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
              {s.published ? "Unpublish" : "Publish"}
            </button>
            <button type="button" onClick={() => remove(s)} aria-label={`Delete ${sheetName(s)}`} className="rounded-lg p-2 text-slate hover:bg-red-50 hover:text-red-600">
              <Trash2 size={18} aria-hidden />
            </button>
          </li>
        ))}
        {!sheets.length && <li className="px-6 py-10 text-center text-slate">No result sheets yet. Upload the first one.</li>}
      </ul>
    </>
  );
}

export default function ResultsAdmin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isRegistrar, setIsRegistrar] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    supabase.rpc("is_registrar").then(({ data }) => !cancelled && setIsRegistrar(data === true));
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!supabase) return <NotConfigured />;
  if (session === undefined) return <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl bg-fog" />;
  if (!session) return <SignIn title="Results office sign in" />;
  if (isRegistrar === null) return <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl bg-fog" />;
  if (!isRegistrar)
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-fog p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Not allowed</h2>
        <p className="mt-3 text-slate">{session.user.email} is not a results account. Only the Deputy Registrar&apos;s office can upload results.</p>
        <button type="button" onClick={() => supabase!.auth.signOut()} className="mt-6 font-semibold text-primary">
          Sign out
        </button>
      </div>
    );
  return <Sheets session={session} />;
}
