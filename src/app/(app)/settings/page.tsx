"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Icon,
  PageHeader,
  Field,
  Avatar,
  Chip,
  Loading,
} from "@/components/ui";
import { useToast } from "@/components/toast";
import { api } from "@/lib/api";
import type { Member, WorkspaceSettings } from "@/lib/types";

const TIMEZONES = [
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

function Toggle({
  on,
  onChange,
  label,
  sub,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-ink-soft">{sub}</p>
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          on ? "bg-brand" : "bg-line"
        }`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [ws, setWs] = useState<WorkspaceSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    digest: true,
    weekly: true,
    twofa: false,
  });

  const load = useCallback(async () => {
    try {
      const [w, m] = await Promise.all([
        api<WorkspaceSettings>("/api/settings"),
        api<Member[]>("/api/members"),
      ]);
      setWs(w);
      setMembers(m);
    } catch {
      /* non-fatal */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    try {
      const saved = localStorage.getItem("meridian.prefs");
      if (saved) setPrefs(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, [load]);

  useEffect(() => {
    localStorage.setItem("meridian.prefs", JSON.stringify(prefs));
  }, [prefs]);

  async function saveWs(e: React.FormEvent) {
    e.preventDefault();
    if (!ws) return;
    setSaving(true);
    try {
      const row = await api<WorkspaceSettings>("/api/settings", {
        method: "PUT",
        body: JSON.stringify({
          workspaceName: ws.workspaceName,
          plan: ws.plan,
          timezone: ws.timezone,
        }),
      });
      setWs(row);
      toast("Workspace settings saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!resetArmed) {
      setResetArmed(true);
      setTimeout(() => setResetArmed(false), 4000);
      return;
    }
    setResetting(true);
    try {
      await api("/api/reset", { method: "POST" });
      toast("Demo data reset — fresh sample company loaded");
      window.location.href = "/dashboard";
    } catch (err) {
      toast(err instanceof Error ? err.message : "Reset failed", "error");
      setResetting(false);
      setResetArmed(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        sub="Workspace, team and demo controls."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* workspace */}
        <form onSubmit={saveWs} className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Workspace
          </h2>
          <div className="mt-5 space-y-4">
            <Field label="Workspace name">
              <input
                className="input"
                value={ws?.workspaceName ?? ""}
                onChange={(e) =>
                  setWs((w) => (w ? { ...w, workspaceName: e.target.value } : w))
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Plan">
                <select
                  className="input"
                  value={ws?.plan ?? "Growth"}
                  onChange={(e) =>
                    setWs((w) => (w ? { ...w, plan: e.target.value } : w))
                  }
                >
                  <option>Starter</option>
                  <option>Growth</option>
                  <option>Scale</option>
                </select>
              </Field>
              <Field label="Timezone">
                <select
                  className="input"
                  value={ws?.timezone ?? TIMEZONES[0]}
                  onChange={(e) =>
                    setWs((w) => (w ? { ...w, timezone: e.target.value } : w))
                  }
                >
                  {TIMEZONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>

        {/* preferences */}
        <div className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Notifications
          </h2>
          <div className="mt-2 divide-y divide-line-soft">
            <Toggle
              on={prefs.digest}
              onChange={(v) => setPrefs((p) => ({ ...p, digest: v }))}
              label="Email digest"
              sub="Daily summary of board changes at 8:00"
            />
            <Toggle
              on={prefs.weekly}
              onChange={(v) => setPrefs((p) => ({ ...p, weekly: v }))}
              label="Weekly ops report"
              sub="Monday morning report to the leadership group"
            />
            <Toggle
              on={prefs.twofa}
              onChange={(v) => setPrefs((p) => ({ ...p, twofa: v }))}
              label="Two-step sign-in"
              sub="Require a code from your phone app"
            />
          </div>
        </div>

        {/* team */}
        <div className="card animate-rise p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold tracking-tight">
              Team · {members.length} members
            </h2>
            <button
              onClick={() => toast("Invitation sent to teammate@meridianhq.io (demo)", "info")}
              className="btn-ghost !px-3 !py-1.5 !text-xs"
            >
              <Icon name="plus" className="h-3.5 w-3.5" />
              Invite
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg border border-line-soft bg-paper px-3 py-2.5"
              >
                <Avatar name={m.name} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold">
                    {m.name}
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        m.active ? "bg-moss" : "bg-line"
                      }`}
                      title={m.active ? "Active" : "Invited"}
                    />
                  </p>
                  <p className="truncate font-mono text-[10px] text-ink-faint">
                    {m.email}
                  </p>
                </div>
                <Chip className="bg-line-soft text-ink-soft ring-line">{m.role}</Chip>
              </div>
            ))}
          </div>
        </div>

        {/* demo data */}
        <div className="card animate-rise border-danger/30 p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-danger-deep">
            <Icon name="spark" className="h-4 w-4" />
            Demo data
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ink-soft">
            Everything you've moved, added or approved can be wiped and the
            original sample company reloaded — useful when you show this to a
            new audience.
          </p>
          <button
            onClick={reset}
            disabled={resetting}
            className={`mt-4 ${resetArmed ? "btn-danger" : "btn-ghost"}`}
          >
            {resetting
              ? "Resetting…"
              : resetArmed
                ? "Click again to confirm reset"
                : "Reset demo data"}
          </button>
        </div>
      </div>
    </div>
  );
}
