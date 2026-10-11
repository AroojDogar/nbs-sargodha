"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, Eye, EyeOff, FilePlus2, LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { parseSheet, type ResultRow } from "@/lib/results";
import { NotConfigured, SignIn } from "@/components/attendance/TeacherPortal";

interface SheetRow {
  id: string;
  title: string;
  session: string;
  columns: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  results: { count: number }[];
}

const input = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-primary";

function Preview({ columns, rows, limit = 50 }: { columns: string[]; rows: ResultRow[]; limit?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-fog text-slate">
          <tr>
            <th className="px-3 py-2 font-semibold whitespace-nowrap">Roll no</th>
            <th className="px-3 py-2 font-semibold whitespace-nowrap">CNIC (last 4)</th>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-semibold whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {rows.slice(0, limit).map((r) => (
            <tr key={r.roll_no}>
              <td className="px-3 py-2 font-mono whitespace-nowrap">{r.roll_no}</td>
              <td className="px-3 py-2 font-mono text-slate">••••{r.cnic_last4}</td>
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 whitespace-nowrap">
                  {r.data[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > limit && <p className="px-3 py-2 text-xs text-slate">…and {rows.length - limit} more</p>}
    </div>
  );
}

function NewSheet({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [session, setSession] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => (text.trim() ? parseSheet(text) : null), [text]);

  async function save() {
    if (!parsed || parsed.errors.length || !parsed.rows.length) return;
    setSaving(true);
    setError("");
    const { data: sheet, error } = await supabase!
      .from("result_sheets")
      .insert({ title: title.trim(), session: session.trim(), columns: parsed.columns })
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. BBA 3rd Semester" className={`mt-1 ${input}`} />
        </label>
        <label className="text-sm font-medium">
          Session
          <input value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. Fall 2026" className={`mt-1 ${input}`} />
        </label>
      </div>

      <div>
        <label htmlFor="sheet" className="text-sm font-medium">
          Paste the sheet from Excel
        </label>
        <p className="mt-1 text-sm text-slate">
          In Excel, select the whole table <strong>including the heading row</strong>, press Ctrl+C, then click below and press
          Ctrl+V. The headings must include <strong>Roll No</strong> and <strong>CNIC</strong>; every other column (Name, subjects,
          GPA, CGPA, Remarks…) is shown to the student as it is. Only the last 4 digits of the CNIC are saved.
        </p>
        <textarea
          id="sheet"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Roll No\tCNIC\tName\tMarketing\tFinance\tGPA\tRemarks"}
          className={`mt-3 font-mono text-sm ${input}`}
        />
      </div>

      {parsed && parsed.errors.length > 0 && (
        <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-800">
          <p className="font-semibold">Please fix these in Excel and paste again:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {parsed.errors.slice(0, 10).map((e) => (
              <li key={e}>{e}</li>
            ))}
            {parsed.errors.length > 10 && <li>…and {parsed.errors.length - 10} more</li>}
          </ul>
        </div>
      )}

      {parsed && parsed.rows.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold">
            Preview: {parsed.rows.length} students, {parsed.columns.length} columns
          </p>
          <Preview columns={parsed.columns} rows={parsed.rows} />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving || !title.trim() || !session.trim() || !parsed || parsed.errors.length > 0 || !parsed.rows.length}
        className="rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save as draft"}
      </button>
      <p className="text-sm text-slate">Students cannot see a sheet until you press Publish on it.</p>
    </div>
  );
}

function SheetView({ sheet, onBack }: { sheet: SheetRow; onBack: () => void }) {
  const [rows, setRows] = useState<ResultRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("results")
      .select("roll_no, cnic_last4, data")
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
      <h2 className="font-display text-3xl font-semibold">
        {sheet.title} · {sheet.session}
      </h2>
      {rows ? <Preview columns={sheet.columns} rows={rows} limit={1000} /> : <div className="h-40 animate-pulse rounded-2xl bg-fog" />}
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
      .select("id, title, session, columns, published, published_at, created_at, results(count)")
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
    const verb = publish ? "Publish" : "Unpublish";
    if (!confirm(`${verb} "${s.title} · ${s.session}"? ${publish ? "Students will be able to see it immediately." : "Students will no longer see it."}`)) return;
    const { error } = await supabase!
      .from("result_sheets")
      .update({ published: publish, published_at: publish ? new Date().toISOString() : null })
      .eq("id", s.id);
    if (error) return setError(error.message);
    reload();
  }

  async function remove(s: SheetRow) {
    if (!confirm(`Delete "${s.title} · ${s.session}" and all its results? This cannot be undone.`)) return;
    const { error } = await supabase!.from("result_sheets").delete().eq("id", s.id);
    if (error) return setError(error.message);
    reload();
  }

  const header = (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-fog px-4 py-3 text-sm">
      <span className="text-slate">
        Signed in as <strong className="text-ink">{session.user.email}</strong> (Deputy Registrar)
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
              <span className="block font-display text-lg font-semibold hover:text-primary">
                {s.title} · {s.session}
              </span>
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
            <button type="button" onClick={() => remove(s)} aria-label={`Delete ${s.title}`} className="rounded-lg p-2 text-slate hover:bg-red-50 hover:text-red-600">
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
  if (!session) return <SignIn title="Deputy Registrar sign in" />;
  if (isRegistrar === null) return <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl bg-fog" />;
  if (!isRegistrar)
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-fog p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Not allowed</h2>
        <p className="mt-3 text-slate">
          {session.user.email} is not a results account. Only the Deputy Registrar can upload results.
        </p>
        <button type="button" onClick={() => supabase!.auth.signOut()} className="mt-6 font-semibold text-primary">
          Sign out
        </button>
      </div>
    );
  return <Sheets session={session} />;
}
