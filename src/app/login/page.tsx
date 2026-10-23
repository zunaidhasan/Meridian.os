"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon, Wordmark, Field } from "@/components/ui";
import { useToast } from "@/components/toast";

const PERKS: [string, string][] = [
  ["Lead, sales, KYC & ops on four boards", "target"],
  ["Every change logged to a full audit trail", "pulse"],
  ["Reports your Monday meeting will actually finish on time", "chart"],
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("meridian.token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function submit(mail: string, pass: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mail, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sign in failed");
      localStorage.setItem("meridian.token", data.token);
      localStorage.setItem("meridian.user", JSON.stringify(data.user));
      toast(`Welcome back, ${data.user.name.split(" ")[0]}`);
      router.replace("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(email, password);
  }

  function demo() {
    setEmail("demo@meridian.io");
    setPassword("demo1234");
    submit("demo@meridian.io", "demo1234");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-night p-10 lg:flex">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden
        />
        <div className="relative">
          <Wordmark dark />
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white">
            One set of boards for the whole business.
          </h1>
          <ul className="mt-8 space-y-4">
            {PERKS.map(([text, icon]) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand-soft">
                  <Icon name={icon as "target"} className="h-4 w-4" />
                </span>
                <span className="text-sm leading-relaxed text-white/70">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Demo environment · sample data only
        </p>
      </div>

      {/* form panel */}
      <div className="flex items-center justify-center bg-paper p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Wordmark />
          </div>
          <p className="label-mono">Demo access</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Sign in to Meridian OS
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            This is a client prototype — any email and password will work.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <Field label="Email">
              <input
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            {error && (
              <p className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger-deep">
                <Icon name="x" className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? "Signing in…" : "Sign in"}
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              or
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button onClick={demo} disabled={busy} className="btn-ghost w-full">
            <Icon name="spark" className="h-4 w-4 text-gold" />
            Use the demo account
          </button>

          <p className="mt-6 text-center text-xs text-ink-faint">
            <Link href="/" className="underline-offset-4 hover:underline">
              ← Back to the website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
