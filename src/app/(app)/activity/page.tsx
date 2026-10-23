"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon, PageHeader, Loading } from "@/components/ui";
import { api, timeAgo } from "@/lib/api";
import type { ActivityItem } from "@/lib/types";

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    try {
      setItems(await api<ActivityItem[]>("/api/activity"));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () =>
      q.trim()
        ? items.filter((i) =>
            `${i.actor} ${i.action}`.toLowerCase().includes(q.toLowerCase())
          )
        : items,
    [items, q]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Audit trail"
        title="Activity Log"
        sub="Every change on every board, in order. Exportable for audits and regulators."
        right={
          <button
            onClick={() => window.alert("CSV export is on the production roadmap. (demo)")}
            className="btn-ghost"
          >
            <Icon name="chart" className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        />
        <input
          className="input pl-9"
          placeholder="Filter by person or action…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="card p-2">
          <ul className="divide-y divide-line-soft">
            {visible.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-4 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand-deep">
                  {a.actor
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <p className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold">{a.actor}</span>{" "}
                  <span className="text-ink-soft">{a.action}</span>
                </p>
                <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                  {timeAgo(a.at)}
                </span>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="px-4 py-12 text-center text-sm text-ink-faint">
                Nothing matches “{q}”.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
