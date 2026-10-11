"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BookOpen, LogOut, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ClassRow } from "@/lib/attendance";
import ClassWorkspace from "@/components/attendance/ClassWorkspace";

const input = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-primary";

function NotConfigured() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-fog p-8 text-center">
      <h2 className="font-display text-2xl font-semibold">Portal not set up yet</h2>
      <p className="mt-3 text-slate">
        The attendance database has not been connected. Please ask the website admin to add the Supabase settings.
      </p>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) setError(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">
      <h2 className="font-display text-2xl font-semibold">Teacher sign in</h2>
      <p className="mt-2 text-sm text-slate">Use the email and password given to you by the NBS office.</p>
      <label className="mt-6 block text-sm font-medium" htmlFor="t-email">
        Email
      </label>
      <input id="t-email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 ${input}`} />
      <label className="mt-4 block text-sm font-medium" htmlFor="t-pass">
        Password
      </label>
      <input
        id="t-pass"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`mt-1 ${input}`}
      />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [version, setVersion] = useState(0);
  const load = () => setVersion((v) => v + 1);

  useEffect(() => {
    let cancelled = false;
    supabase!
      .from("classes")
      .select("id, name, course")
      .order("created_at")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) return setError(error.message);
        setClasses(data);
        setSelected((s) => (s && data.some((c) => c.id === s) ? s : (data[0]?.id ?? null)));
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  async function addClass(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase!.from("classes").insert({ name: name.trim(), course: course.trim() }).select("id").single();
    if (error) return setError(error.message);
    setName("");
    setCourse("");
    setAdding(false);
    setSelected(data.id);
    load();
  }

  async function removeClass(c: ClassRow) {
    if (!confirm(`Delete "${c.course}" (${c.name}) with all its students and attendance? This cannot be undone.`)) return;
    const { error } = await supabase!.from("classes").delete().eq("id", c.id);
    if (error) return setError(error.message);
    load();
  }

  const current = classes.find((c) => c.id === selected);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-fog px-4 py-3 text-sm">
          <span className="truncate text-slate" title={session.user.email}>
            {session.user.email}
          </span>
          <button type="button" onClick={() => supabase!.auth.signOut()} className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary">
            <LogOut size={14} aria-hidden /> Sign out
          </button>
        </div>

        <h2 className="pt-2 text-sm font-semibold tracking-wide text-slate uppercase">My classes</h2>
        <ul className="space-y-2">
          {classes.map((c) => (
            <li key={c.id} className="group flex items-stretch gap-1">
              <button
                type="button"
                onClick={() => setSelected(c.id)}
                className={`flex-1 rounded-2xl px-4 py-3 text-left transition-colors ${
                  c.id === selected ? "bg-primary text-white" : "bg-white ring-1 ring-ink/10 hover:bg-fog"
                }`}
              >
                <span className="block font-semibold">{c.course}</span>
                <span className={`block text-xs ${c.id === selected ? "text-white/75" : "text-slate"}`}>{c.name}</span>
              </button>
              <button
                type="button"
                onClick={() => removeClass(c)}
                aria-label={`Delete ${c.course}`}
                className="rounded-xl px-2 text-slate opacity-60 hover:bg-red-50 hover:text-red-600 hover:opacity-100"
              >
                <Trash2 size={16} aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        {adding ? (
          <form onSubmit={addClass} className="space-y-3 rounded-2xl bg-fog p-4">
            <input required placeholder="Course, e.g. Principles of Marketing" value={course} onChange={(e) => setCourse(e.target.value)} className={input} />
            <input required placeholder="Class, e.g. BBA 3rd (Morning)" value={name} onChange={(e) => setName(e.target.value)} className={input} />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                Add class
              </button>
              <button type="button" onClick={() => setAdding(false)} className="rounded-full px-4 text-sm font-semibold text-slate">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 py-3 font-semibold text-primary hover:border-primary"
          >
            <Plus size={18} aria-hidden /> New class
          </button>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </aside>

      <div className="min-w-0">
        {current ? (
          <ClassWorkspace key={current.id} cls={current} />
        ) : (
          <div className="grid h-full min-h-[320px] place-items-center rounded-3xl bg-fog p-10 text-center">
            <div>
              <BookOpen className="mx-auto text-primary" size={36} aria-hidden />
              <p className="mt-4 font-display text-2xl font-semibold">Add your first class</p>
              <p className="mt-2 text-slate">Create a class, add its students, then start marking attendance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeacherPortal() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) return <NotConfigured />;
  if (session === undefined) return <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl bg-fog" />;
  if (!session) return <SignIn />;
  return <Dashboard session={session} />;
}
