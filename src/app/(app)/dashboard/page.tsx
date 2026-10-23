"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, fmtMoney, fmtMoneyCompact, timeAgo } from "@/lib/api";
import { DEAL_META, type DashboardData } from "@/lib/types";
import {
  Icon,
  PageHeader,
  StatCard,
  Loading,
  type IconName,
} from "@/components/ui";

const KIND_ICON: Record<string, IconName> = {
  task: "tool",
  kyc: "shield",
  lead: "target",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await api<DashboardData>("/api/dashboard"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    }
  }, []);

  useEffect(() => {
    load();
    try {
      setUser(JSON.parse(localStorage.getItem("meridian.user") ?? "null"));
    } catch {
      setUser(null);
    }
  }, [load]);

  if (error) {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <Icon name="x" className="h-6 w-6 text-danger" />
        <p className="font-semibold">{error}</p>
        <button onClick={load} className="btn-ghost">
          Try again
        </button>
      </div>
    );
  }

  if (!data) return <Loading />;

  const h = new Date().getHours();
  const period = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const first = user?.name.split(" ")[0] ?? "there";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const maxPipe = Math.max(...data.pipeline.map((p) => p.total), 1);
  const openTotal = data.pipeline.reduce((a, p) => a + p.total, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={`${period}, ${first}.`}
        sub={`${today} · here's where the business stands.`}
        right={
          <Link href="/reports" className="btn-ghost">
            <Icon name="chart" className="h-4 w-4" />
            View reports
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open pipeline"
          value={fmtMoneyCompact(data.kpis.openPipeline)}
          icon="briefcase"
          tone="brand"
          sub="across all open deals"
        />
        <StatCard
          label="Won this month"
          value={fmtMoneyCompact(data.kpis.wonThisMonth)}
          icon="chart"
          tone="moss"
          sub="closed and invoiced"
        />
        <StatCard
          label="Open leads"
          value={String(data.kpis.openLeads)}
          icon="target"
          tone="gold"
          sub={`${data.kpis.qualifiedLeads} qualified`}
        />
        <StatCard
          label="KYC pending"
          value={String(data.kpis.kycPending)}
          icon="shield"
          tone={data.kpis.kycHighRisk > 0 ? "danger" : "brand"}
          sub={
            data.kpis.kycHighRisk > 0
              ? `${data.kpis.kycHighRisk} high risk — needs review`
              : "no high-risk records"
          }
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* pipeline */}
        <div className="card animate-rise p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold tracking-tight">
              Pipeline by stage
            </h2>
            <Link
              href="/deals"
              className="flex items-center gap-1 text-sm font-semibold text-brand-deep hover:underline"
            >
              Open board
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {data.pipeline.map((p) => (
              <div key={p.stage}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className={`h-2 w-2 rounded-full ${DEAL_META[p.stage].dot}`}
                    />
                    {DEAL_META[p.stage].label}
                    <span className="font-mono text-[10px] text-ink-faint">
                      {p.count} deals
                    </span>
                  </span>
                  <span className="font-mono text-xs font-bold">
                    {fmtMoney(p.total)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-line-soft">
                  <div
                    className={`h-full rounded-full transition-all ${DEAL_META[p.stage].dot}`}
                    style={{ width: `${Math.max(3, (p.total / maxPipe) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4">
            <span className="text-sm font-medium text-ink-soft">
              Total open pipeline
            </span>
            <span className="font-display text-lg font-semibold">
              {fmtMoney(openTotal)}
            </span>
          </div>
        </div>

        {/* attention */}
        <div className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Needs attention
          </h2>
          <div className="mt-4 space-y-2.5">
            {data.attention.length === 0 && (
              <div className="flex items-center gap-3 rounded-lg bg-moss-soft px-4 py-6">
                <Icon name="check" className="h-5 w-5 text-moss-deep" />
                <p className="text-sm font-medium text-moss-deep">
                  All clear. Nothing waiting on you.
                </p>
              </div>
            )}
            {data.attention.map((a) => (
              <div
                key={`${a.kind}-${a.id}`}
                className="flex items-start gap-3 rounded-lg border border-line-soft bg-paper px-3 py-2.5"
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    a.tone === "danger"
                      ? "bg-danger-soft text-danger-deep"
                      : a.tone === "gold"
                        ? "bg-gold-soft text-gold-deep"
                        : "bg-brand-soft text-brand-deep"
                  }`}
                >
                  <Icon name={KIND_ICON[a.kind]} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-ink-soft">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* activity */}
      <div className="card animate-rise mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Recent activity
          </h2>
          <Link
            href="/activity"
            className="flex items-center gap-1 text-sm font-semibold text-brand-deep hover:underline"
          >
            Full log
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line-soft">
          {data.activity.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <p className="min-w-0 flex-1 truncate text-sm">
                <span className="font-semibold">{a.actor}</span>{" "}
                <span className="text-ink-soft">{a.action}</span>
              </p>
              <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                {timeAgo(a.at)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
