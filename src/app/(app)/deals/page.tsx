"use client";

import { useCallback, useEffect, useState } from "react";
import { Kanban } from "@/components/kanban";
import {
  Icon,
  PageHeader,
  Modal,
  Field,
  Avatar,
  Loading,
} from "@/components/ui";
import { useToast } from "@/components/toast";
import { api, fmtMoney, fmtDate, isOverdue, toInputDate } from "@/lib/api";
import {
  DEAL_STAGES,
  DEAL_META,
  type Deal,
  type DealStage,
  type Member,
} from "@/lib/types";

export default function DealsPage() {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("20000");
  const [stage, setStage] = useState<DealStage>("discovery");
  const [owner, setOwner] = useState("Unassigned");
  const [closeDate, setCloseDate] = useState(toInputDate(new Date(Date.now() + 14 * 864e5)));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [d, m] = await Promise.all([
        api<Deal[]>("/api/deals"),
        api<Member[]>("/api/members"),
      ]);
      setDeals(d);
      setMembers(m);
      if (m.length) setOwner((o) => (o === "Unassigned" ? m[0].name : o));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load deals", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function move(id: string, next: string) {
    const deal = deals.find((d) => d.id === id);
    if (!deal || deal.stage === next) return;
    setDeals((p) =>
      p.map((d) => (d.id === id ? { ...d, stage: next as DealStage } : d))
    );
    api(`/api/deals/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ stage: next }),
    })
      .then(() =>
        toast(
          next === "won"
            ? `Deal won — ${deal.company} ${fmtMoney(deal.amount)} 🎉`
            : next === "lost"
              ? `${deal.company} marked as lost`
              : `Moved ${deal.company} to ${DEAL_META[next as DealStage].label}`
        )
      )
      .catch((e) => {
        toast(e instanceof Error ? e.message : "Move failed", "error");
        load();
      });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const row = await api<Deal>("/api/deals", {
        method: "POST",
        body: JSON.stringify({
          title,
          company,
          amount: Number(amount) || 0,
          stage,
          owner: members.some((m) => m.name === owner) ? owner : members[0]?.name ?? "Unassigned",
          closeDate: closeDate || null,
        }),
      });
      setDeals((p) => [row, ...p]);
      setModal(false);
      setTitle("");
      setCompany("");
      setAmount("20000");
      setStage("discovery");
      toast(`${row.title} added to the Sales Board`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add deal", "error");
    } finally {
      setSaving(false);
    }
  }

  const open = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const openTotal = open.reduce((a, d) => a + d.amount, 0);
  const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const wonMonth = deals
    .filter(
      (d) =>
        d.stage === "won" &&
        d.closeDate &&
        new Date(d.closeDate) >= startMonth
    )
    .reduce((a, d) => a + d.amount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Board 02"
        title="Sales Board"
        sub={`${open.length} open deals · ${fmtMoney(openTotal)} open pipeline · ${fmtMoney(wonMonth)} won this month.`}
        right={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            New deal
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : (
        <Kanban
          cols={DEAL_STAGES.map((s) => ({
            key: s.value,
            label: s.label,
            dotClass: DEAL_META[s.value].dot,
          }))}
          items={deals}
          stageOf={(d) => d.stage}
          onMove={move}
          colMeta={(_, inCol) => (
            <span className="font-mono text-[10px] font-bold text-ink-soft">
              {fmtMoney(inCol.reduce((a, d) => a + d.amount, 0))}
            </span>
          )}
          render={(deal) => {
            const closed = deal.stage === "won" || deal.stage === "lost";
            const late = !closed && isOverdue(deal.closeDate);
            return (
              <div className="card group p-3.5 transition hover:shadow-md">
                <p className="text-sm font-semibold leading-tight">
                  {deal.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">{deal.company}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">
                    {fmtMoney(deal.amount)}
                  </span>
                  {deal.closeDate && (
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] font-semibold ${
                        late ? "text-danger-deep" : "text-ink-faint"
                      }`}
                    >
                      <Icon name="clock" className="h-3 w-3" />
                      {late ? "close " : "closes "}
                      {fmtDate(deal.closeDate)}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2.5">
                  <span className="flex items-center gap-1.5">
                    <Avatar name={deal.owner} size="sm" />
                    <span className="text-[11px] font-medium text-ink-soft">
                      {deal.owner.split(" ")[0]}
                    </span>
                  </span>
                  {deal.stage === "won" && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-moss-deep">
                      <Icon name="check" className="h-3 w-3" />
                      Won
                    </span>
                  )}
                  {deal.stage === "lost" && (
                    <span className="text-[11px] font-bold text-ink-faint">
                      Lost
                    </span>
                  )}
                </div>
              </div>
            );
          }}
        />
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New deal">
        <form onSubmit={add} className="space-y-4">
          <Field label="Deal title *">
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Annual platform license"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company *">
              <input
                className="input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                required
              />
            </Field>
            <Field label="Amount (USD) *">
              <input
                type="number"
                min={0}
                step={1000}
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stage">
              <select
                className="input"
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
              >
                {DEAL_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Close date">
              <input
                type="date"
                className="input"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Owner">
            <select
              className="input"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id}>{m.name}</option>
              ))}
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Adding…" : "Add deal"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
