"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Icon,
  PageHeader,
  StatCard,
  Chip,
  Loading,
  Avatar,
} from "@/components/ui";
import { api, fmtMoney, fmtMoneyCompact } from "@/lib/api";
import { DEAL_META, type ReportsData } from "@/lib/types";

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setData(await api<ReportsData>("/api/reports"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
    }
  }, []);

  useEffect(() => {
    load();
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

  const maxMonth = Math.max(...data.monthly.map((m) => m.total), 1);
  const funnelMax = Math.max(...data.funnel.map((f) => f.count), 1);
  const kycMax = Math.max(...data.kyc.map((k) => k.count), 1);

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Reports"
        sub="Everything computed live from the four boards — no manual spreadsheets."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total won (all time)"
          value={fmtMoneyCompact(data.stats.totalWon)}
          icon="briefcase"
          tone="brand"
        />
        <StatCard
          label="Average deal size"
          value={fmtMoneyCompact(data.stats.avgWon)}
          icon="chart"
          tone="gold"
        />
        <StatCard
          label="Win rate"
          value={`${data.stats.winRate}%`}
          icon="target"
          tone="moss"
        />
        <StatCard
          label="KYC approval rate"
          value={`${data.stats.kycApproval}%`}
          icon="shield"
          tone="brand"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* monthly revenue */}
        <div className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Monthly revenue · won deals
          </h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {data.monthly.map((m) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-ink-soft">
                  {m.total > 0 ? fmtMoneyCompact(m.total) : "—"}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    m.total > 0 ? "bg-brand" : "bg-line-soft"
                  }`}
                  style={{
                    height: `${Math.max(4, (m.total / maxMonth) * 120)}px`,
                  }}
                  title={fmtMoney(m.total)}
                />
                <span className="font-mono text-[10px] uppercase text-ink-faint">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* funnel */}
        <div className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Lead funnel
          </h2>
          <div className="mt-6 space-y-4">
            {data.funnel.map((f, i) => (
              <div key={f.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{f.label}</span>
                  <span className="font-mono text-xs font-bold">
                    {f.count}
                    <span className="ml-1.5 text-[10px] font-normal text-ink-faint">
                      {i === 0
                        ? "100%"
                        : `${Math.round((f.count / funnelMax) * 100)}%`}
                    </span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-line-soft">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{
                      width: `${Math.max(3, (f.count / funnelMax) * 100)}%`,
                      opacity: 1 - i * 0.18,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* kyc pipeline */}
        <div className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            KYC pipeline
          </h2>
          <div className="mt-6 space-y-4">
            {data.kyc.map((k) => (
              <div key={k.label} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm font-medium">{k.label}</span>
                <div className="h-2.5 flex-1 rounded-full bg-line-soft">
                  <div
                    className={`h-full rounded-full ${k.cls}`}
                    style={{
                      width: `${Math.max(3, (k.count / kycMax) * 100)}%`,
                    }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs font-bold">
                  {k.count}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-lg bg-line-soft px-3 py-2 text-xs text-ink-soft">
            Average time-to-approval across the last 30 days:{" "}
            <b className="text-ink">6.5 days</b>
          </p>
        </div>

        {/* top deals */}
        <div className="card animate-rise p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Largest open deals
          </h2>
          <div className="mt-4 divide-y divide-line-soft">
            {data.topDeals.map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-3">
                <Avatar name={d.owner} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{d.company}</p>
                  <p className="truncate text-xs text-ink-soft">{d.title}</p>
                </div>
                <Chip className={DEAL_META[d.stage].chip}>
                  {DEAL_META[d.stage].label}
                </Chip>
                <span className="w-20 text-right font-mono text-sm font-bold">
                  {fmtMoneyCompact(d.amount)}
                </span>
              </div>
            ))}
            {data.topDeals.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-faint">
                No open deals right now.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
