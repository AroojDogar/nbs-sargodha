"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCheck, Download, Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  byRoll,
  downloadCsv,
  percent,
  REQUIRED_PERCENT,
  statusLabel,
  today,
  type ClassRow,
  type Status,
  type StudentRow,
  type Totals,
} from "@/lib/attendance";

const tabs = ["Mark attendance", "Students", "Report"] as const;
type Tab = (typeof tabs)[number];
type Entry = { student_id: string; date: string; status: Status };

const input = "rounded-xl border border-ink/15 bg-white px-4 py-2.5 outline-none focus:border-primary";

const statusStyle: Record<Status, string> = {
  P: "bg-emerald-600 text-white",
  A: "bg-red-600 text-white",
  L: "bg-amber-500 text-white",
};

function Mark({ cls, students }: { cls: ClassRow; students: StudentRow[] }) {
  const [date, setDate] = useState(today());
  const [marks, setMarks] = useState<Record<string, Status>>({});
  const [existing, setExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("attendance")
      .select("student_id, status")
      .eq("class_id", cls.id)
      .eq("date", date)
      .then(({ data }) => {
        if (cancelled) return;
        const saved = Object.fromEntries((data ?? []).map((r) => [r.student_id, r.status as Status]));
        setExisting((data ?? []).length > 0);
        setMarks(Object.fromEntries(students.map((s) => [s.id, saved[s.id] ?? "P"])));
        setMessage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [cls.id, date, students]);

  async function save() {
    setSaving(true);
    setMessage(null);
    const rows = students.map((s) => ({ class_id: cls.id, student_id: s.id, date, status: marks[s.id] ?? "P" }));
    const { error } = await supabase!.from("attendance").upsert(rows, { onConflict: "student_id,date" });
    setSaving(false);
    if (error) return setMessage({ ok: false, text: error.message });
    setExisting(true);
    setMessage({ ok: true, text: `Attendance saved for ${new Date(date + "T00:00").toLocaleDateString("en-GB", { dateStyle: "medium" })}.` });
  }

  if (!students.length) return <p className="rounded-2xl bg-fog p-6 text-slate">Add students to this class first (Students tab).</p>;

  const counts = { P: 0, A: 0, L: 0 } as Record<Status, number>;
  for (const s of students) counts[marks[s.id] ?? "P"]++;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm font-medium">
          Date
          <input type="date" value={date} max={today()} onChange={(e) => e.target.value && setDate(e.target.value)} className={`mt-1 block ${input}`} />
        </label>
        <button
          type="button"
          onClick={() => setMarks(Object.fromEntries(students.map((s) => [s.id, "P"])))}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          <CheckCheck size={16} aria-hidden /> All present
        </button>
        <p className="text-sm text-slate">
          <span className="font-semibold text-emerald-700">{counts.P} present</span> ·{" "}
          <span className="font-semibold text-red-600">{counts.A} absent</span> ·{" "}
          <span className="font-semibold text-amber-600">{counts.L} leave</span>
        </p>
      </div>
      {existing && <p className="mt-3 text-sm text-accent">Attendance for this date was already saved. Changes will update it.</p>}

      <ul className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
        {students.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <span>
              <span className="mr-3 font-mono text-sm text-slate">{s.roll_no}</span>
              <span className="font-medium">{s.name}</span>
            </span>
            <span className="flex gap-1.5" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
              {(Object.keys(statusLabel) as Status[]).map((st) => {
                const on = (marks[s.id] ?? "P") === st;
                return (
                  <button
                    key={st}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    title={statusLabel[st]}
                    onClick={() => setMarks((m) => ({ ...m, [s.id]: st }))}
                    className={`size-10 rounded-xl text-sm font-bold transition-colors ${on ? statusStyle[st] : "bg-fog text-slate hover:bg-mist/40"}`}
                  >
                    {st}
                  </button>
                );
              })}
            </span>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : existing ? "Update attendance" : "Save attendance"}
        </button>
        {message && <p className={`text-sm font-medium ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>}
      </div>
    </div>
  );
}

function Students({ cls, students, reload }: { cls: ClassRow; students: StudentRow[]; reload: () => void }) {
  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");
  const [bulk, setBulk] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function add(rows: { roll_no: string; name: string }[]) {
    setError("");
    setInfo("");
    const { error } = await supabase!
      .from("students")
      .upsert(rows.map((r) => ({ ...r, class_id: cls.id })), { onConflict: "class_id,roll_no" });
    if (error) {
      setError(error.message);
      return false;
    }
    reload();
    return true;
  }

  async function addOne(e: React.FormEvent) {
    e.preventDefault();
    if (await add([{ roll_no: roll.trim(), name: name.trim() }])) {
      setRoll("");
      setName("");
    }
  }

  async function addBulk() {
    const rows = bulk
      .split(/\r?\n/)
      .map((line) => line.split(/\t|,/).map((x) => x.trim()))
      .filter(([r, n]) => r && n)
      .map(([roll_no, ...rest]) => ({ roll_no, name: rest.join(" ").trim() }));
    if (!rows.length) return setError("Write one student per line: roll number, name");
    if (await add(rows)) {
      setBulk("");
      setInfo(`${rows.length} students added or updated.`);
    }
  }

  async function remove(s: StudentRow) {
    if (!confirm(`Remove ${s.name} (${s.roll_no}) and all their attendance from this class?`)) return;
    const { error } = await supabase!.from("students").delete().eq("id", s.id);
    if (error) return setError(error.message);
    reload();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
      <div>
        <p className="text-sm text-slate">{students.length} students</p>
        <ul className="mt-3 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span>
                <span className="mr-3 font-mono text-sm text-slate">{s.roll_no}</span>
                <span className="font-medium">{s.name}</span>
              </span>
              <button type="button" onClick={() => remove(s)} aria-label={`Remove ${s.name}`} className="rounded-lg p-2 text-slate hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} aria-hidden />
              </button>
            </li>
          ))}
          {!students.length && <li className="px-4 py-6 text-slate">No students yet.</li>}
        </ul>
      </div>

      <div className="space-y-6">
        <form onSubmit={addOne} className="space-y-3 rounded-2xl bg-fog p-5">
          <p className="font-semibold">Add a student</p>
          <input required placeholder="Roll number" value={roll} onChange={(e) => setRoll(e.target.value)} className={`w-full ${input}`} />
          <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={`w-full ${input}`} />
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark">
            <UserPlus size={16} aria-hidden /> Add
          </button>
        </form>

        <div className="space-y-3 rounded-2xl bg-fog p-5">
          <p className="font-semibold">Add many at once</p>
          <p className="text-sm text-slate">Paste from Excel, or write one per line: roll number, name</p>
          <textarea
            rows={6}
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={"BBA-001, Ayesha Khan\nBBA-002, Ali Raza"}
            className={`w-full font-mono text-sm ${input}`}
          />
          <button type="button" onClick={addBulk} className="w-full rounded-full border border-primary py-2.5 font-semibold text-primary hover:bg-primary hover:text-white">
            Add all
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-emerald-700">{info}</p>}
      </div>
    </div>
  );
}

function Report({ cls, students }: { cls: ClassRow; students: StudentRow[] }) {
  const [rows, setRows] = useState<Entry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("attendance")
      .select("student_id, date, status")
      .eq("class_id", cls.id)
      .then(({ data }) => !cancelled && setRows((data ?? []) as Entry[]));
    return () => {
      cancelled = true;
    };
  }, [cls.id]);

  const report = useMemo(() => {
    const totals = new Map<string, Totals>(students.map((s) => [s.id, { present: 0, absent: 0, leave: 0, total: 0 }]));
    for (const r of rows ?? []) {
      const t = totals.get(r.student_id);
      if (!t) continue;
      t.total++;
      if (r.status === "P") t.present++;
      else if (r.status === "A") t.absent++;
      else t.leave++;
    }
    return students.map((s) => {
      const t = totals.get(s.id)!;
      return { ...s, ...t, pct: percent(t) };
    });
  }, [rows, students]);

  if (!rows) return <div className="h-40 animate-pulse rounded-2xl bg-fog" />;

  const lectures = new Set(rows.map((r) => r.date)).size;
  const short = report.filter((r) => r.total > 0 && r.pct < REQUIRED_PERCENT);
  const average = report.length ? Math.round(report.reduce((n, r) => n + r.pct, 0) / report.length) : 0;

  function exportCsv() {
    downloadCsv(`${cls.course} - ${cls.name} attendance.csv`, [
      ["Roll number", "Name", "Present", "Absent", "Leave", "Lectures", "Percentage", "Status"],
      ...report.map((r) => [r.roll_no, r.name, r.present, r.absent, r.leave, r.total, `${r.pct}%`, r.total && r.pct < REQUIRED_PERCENT ? "Short" : "OK"]),
    ]);
  }

  return (
    <div>
      <dl className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Lectures marked", value: lectures },
          { label: "Class average", value: `${average}%` },
          { label: `Below ${REQUIRED_PERCENT}%`, value: short.length, warn: short.length > 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-fog p-5">
            <dt className="text-sm text-slate">{s.label}</dt>
            <dd className={`mt-1 font-display text-3xl font-semibold ${s.warn ? "text-red-600" : "text-primary"}`}>{s.value}</dd>
          </div>
        ))}
      </dl>

      {short.length > 0 && (
        <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-800">
          <p className="font-semibold">Short of attendance ({short.length})</p>
          <p className="mt-1 text-sm">{short.map((s) => `${s.name} (${s.pct}%)`).join(", ")}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          <Download size={16} aria-hidden /> Download Excel (CSV)
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-fog text-slate">
            <tr>
              {["Roll", "Name", "P", "A", "L", "Lectures", "Attendance"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {report.map((r) => {
              const low = r.total > 0 && r.pct < REQUIRED_PERCENT;
              return (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono text-slate">{r.roll_no}</td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{r.present}</td>
                  <td className="px-4 py-3">{r.absent}</td>
                  <td className="px-4 py-3">{r.leave}</td>
                  <td className="px-4 py-3">{r.total}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-20 overflow-hidden rounded-full bg-fog">
                        <span className={`block h-full ${low ? "bg-red-500" : "bg-emerald-600"}`} style={{ width: `${r.pct}%` }} />
                      </span>
                      <span className={`font-semibold ${low ? "text-red-600" : ""}`}>{r.total ? `${r.pct}%` : "—"}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ClassWorkspace({ cls }: { cls: ClassRow }) {
  const [tab, setTab] = useState<Tab>("Mark attendance");
  const [students, setStudents] = useState<StudentRow[]>([]);

  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("students")
      .select("id, roll_no, name")
      .eq("class_id", cls.id)
      .then(({ data }) => !cancelled && setStudents((data ?? []).sort(byRoll)));
    return () => {
      cancelled = true;
    };
  }, [cls.id, version]);

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 lg:p-8">
      <p className="text-sm text-slate">{cls.name}</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight">{cls.course}</h2>

      <div role="tablist" className="mt-6 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t ? "bg-ink text-white" : "text-slate hover:bg-fog hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Mark attendance" && <Mark cls={cls} students={students} />}
        {tab === "Students" && <Students cls={cls} students={students} reload={reload} />}
        {tab === "Report" && <Report cls={cls} students={students} />}
      </div>
    </div>
  );
}
