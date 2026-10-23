"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Icon,
  PageHeader,
  Modal,
  Field,
  Chip,
  ProgressBar,
  Loading,
} from "@/components/ui";
import { useToast } from "@/components/toast";
import { api, timeAgo } from "@/lib/api";
import {
  KYC_STATUSES,
  KYC_META,
  RISK_META,
  type KycRecord,
  type KycStatus,
  type Risk,
} from "@/lib/types";

const ACTIONS: Partial<
  Record<KycStatus, { label: string; next: KycStatus; cls: string; icon: "check" | "shield" | "x" | "chevronRight" }[]>
> = {
  docs_requested: [
    { label: "Docs received", next: "docs_received", cls: "btn-primary", icon: "check" },
  ],
  docs_received: [
    { label: "Start review", next: "under_review", cls: "btn-primary", icon: "shield" },
  ],
  under_review: [
    { label: "Approve", next: "approved", cls: "btn-primary", icon: "check" },
    { label: "Reject", next: "rejected", cls: "btn-danger", icon: "x" },
  ],
  rejected: [
    { label: "Reopen review", next: "under_review", cls: "btn-ghost", icon: "chevronRight" },
  ],
};

export default function KycPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<KycStatus | "all">("all");
  const [modal, setModal] = useState(false);

  const [customer, setCustomer] = useState("");
  const [reference, setReference] = useState("");
  const [country, setCountry] = useState("");
  const [risk, setRisk] = useState<Risk>("medium");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await api<KycRecord[]>("/api/kyc"));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load KYC records", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const pending = rows.filter(
    (r) =>
      r.status === "docs_requested" ||
      r.status === "docs_received" ||
      r.status === "under_review"
  ).length;

  function transition(row: KycRecord, next: KycStatus) {
    setRows((p) =>
      p.map((r) =>
        r.id === row.id
          ? {
              ...r,
              status: next,
              docsReceived: next === "docs_received" ? r.docsTotal : r.docsReceived,
            }
          : r
      )
    );
    api(`/api/kyc/${row.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    })
      .then(() =>
        toast(`${row.customer} → ${KYC_META[next].label}`, next === "rejected" ? "info" : "success")
      )
      .catch((e) => {
        toast(e instanceof Error ? e.message : "Update failed", "error");
        load();
      });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const ref =
      reference.trim() ||
      `KYC-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;
    try {
      const row = await api<KycRecord>("/api/kyc", {
        method: "POST",
        body: JSON.stringify({
          customer,
          reference: ref,
          country: country || "—",
          risk,
          status: "docs_requested",
        }),
      });
      setRows((p) => [row, ...p]);
      setModal(false);
      setCustomer("");
      setReference("");
      setCountry("");
      setRisk("medium");
      toast(`KYC record opened for ${row.customer}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add record", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Board 03"
        title="KYC Board"
        sub={`${pending} records in flight · every decision is written to the audit trail.`}
        right={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            New record
          </button>
        }
      />

      {/* filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={`chip px-3 py-1.5 transition ${
            filter === "all"
              ? "bg-ink text-paper ring-ink"
              : "bg-card text-ink-soft ring-line hover:bg-line-soft"
          }`}
        >
          All · {counts.all ?? 0}
        </button>
        {KYC_STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`chip px-3 py-1.5 transition ${
              filter === s.value
                ? "bg-ink text-paper ring-ink"
                : "bg-card text-ink-soft ring-line hover:bg-line-soft"
            }`}
          >
            {s.label} · {counts[s.value] ?? 0}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="thead pl-5">Customer</th>
                <th className="thead">Country</th>
                <th className="thead">Risk</th>
                <th className="thead">Documents</th>
                <th className="thead">Status</th>
                <th className="thead">Updated</th>
                <th className="thead pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-line-soft last:border-0 hover:bg-paper/70"
                >
                  <td className="py-3.5 pl-5">
                    <p className="font-semibold">{r.customer}</p>
                    <p className="font-mono text-[10px] text-ink-faint">
                      {r.reference}
                      {r.note ? ` · ${r.note}` : ""}
                    </p>
                  </td>
                  <td className="text-ink-soft">{r.country}</td>
                  <td>
                    <Chip className={RISK_META[r.risk].chip}>
                      {RISK_META[r.risk].label} risk
                    </Chip>
                  </td>
                  <td className="w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar
                          value={(r.docsReceived / r.docsTotal) * 100}
                          className={
                            r.docsReceived >= r.docsTotal
                              ? "bg-moss"
                              : "bg-gold"
                          }
                        />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-ink-soft">
                        {r.docsReceived}/{r.docsTotal}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Chip className={KYC_META[r.status].chip}>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${KYC_META[r.status].dot}`}
                      />
                      {KYC_META[r.status].label}
                    </Chip>
                  </td>
                  <td className="whitespace-nowrap font-mono text-[11px] text-ink-faint">
                    {timeAgo(r.updatedAt)}
                  </td>
                  <td className="pr-5">
                    <div className="flex justify-end gap-1.5">
                      {(ACTIONS[r.status] ?? []).map((a) => (
                        <button
                          key={a.label}
                          onClick={() => transition(r, a.next)}
                          className={`${a.cls} !px-3 !py-1.5 !text-xs`}
                        >
                          <Icon name={a.icon} className="h-3.5 w-3.5" />
                          {a.label}
                        </button>
                      ))}
                      {r.status === "approved" && (
                        <span className="flex items-center gap-1 text-xs font-bold text-moss-deep">
                          <Icon name="check" className="h-4 w-4" />
                          Cleared
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-ink-faint">
                    No records in this state.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New KYC record">
        <form onSubmit={add} className="space-y-4">
          <Field label="Customer *">
            <input
              className="input"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Acme Corp"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reference">
              <input
                className="input"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={`KYC-${new Date().getFullYear()}-000`}
              />
            </Field>
            <Field label="Country">
              <input
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Germany"
              />
            </Field>
          </div>
          <Field label="Initial risk level">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(RISK_META) as Risk[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRisk(r)}
                  className={`chip justify-center px-3 py-2 transition ${
                    risk === r
                      ? "bg-ink text-paper ring-ink"
                      : "bg-card text-ink-soft ring-line hover:bg-line-soft"
                  }`}
                >
                  {RISK_META[r].label}
                </button>
              ))}
            </div>
          </Field>
          <p className="rounded-lg bg-line-soft px-3 py-2 text-xs text-ink-soft">
            New records start in <b>Docs requested</b> with a 4-document
            checklist (ID, proof of address, ownership, sanctions check).
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Creating…" : "Open record"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
