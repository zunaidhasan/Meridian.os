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
import { api, fmtMoney, timeAgo } from "@/lib/api";
import {
  LEAD_STAGES,
  LEAD_META,
  type Lead,
  type LeadStage,
  type Member,
} from "@/lib/types";

const SOURCES = ["Website", "Referral", "Outbound", "Trade show", "LinkedIn", "Webinar"];

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  // form
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState(SOURCES[0]);
  const [value, setValue] = useState("10000");
  const [stage, setStage] = useState<LeadStage>("new");
  const [owner, setOwner] = useState("Unassigned");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [l, m] = await Promise.all([
        api<Lead[]>("/api/leads"),
        api<Member[]>("/api/members"),
      ]);
      setLeads(l);
      setMembers(m);
      if (m.length) setOwner((o) => (o === "Unassigned" ? m[0].name : o));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function move(id: string, next: string) {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.stage === next) return;
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, stage: next as LeadStage } : l)));
    api(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ stage: next }),
    })
      .then(() =>
        toast(`Moved ${lead.company} to ${LEAD_META[next as LeadStage].label}`)
      )
      .catch((e) => {
        toast(e instanceof Error ? e.message : "Move failed", "error");
        load();
      });
  }

  async function remove(lead: Lead) {
    setLeads((p) => p.filter((l) => l.id !== lead.id));
    api(`/api/leads/${lead.id}`, { method: "DELETE" })
      .then(() => toast(`Removed ${lead.company} from the board`))
      .catch((e) => {
        toast(e instanceof Error ? e.message : "Delete failed", "error");
        load();
      });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const row = await api<Lead>("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          company,
          contact,
          email: email || null,
          source,
          value: Number(value) || 0,
          stage,
          owner: members.some((m) => m.name === owner) ? owner : members[0]?.name ?? "Unassigned",
        }),
      });
      setLeads((p) => [row, ...p]);
      setModal(false);
      setCompany("");
      setContact("");
      setEmail("");
      setValue("10000");
      setStage("new");
      toast(`${row.company} added to the Lead Board`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add lead", "error");
    } finally {
      setSaving(false);
    }
  }

  const open = leads.filter((l) => l.stage !== "disqualified");
  const estValue = open.reduce((a, l) => a + l.value, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Board 01"
        title="Lead Board"
        sub={`${open.length} open leads · ${fmtMoney(estValue)} estimated value. Drag cards between stages.`}
        right={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            Add lead
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : (
        <Kanban
          cols={LEAD_STAGES.map((s) => ({
            key: s.value,
            label: s.label,
            dotClass: LEAD_META[s.value].dot,
          }))}
          items={leads}
          stageOf={(l) => l.stage}
          onMove={move}
          render={(lead) => (
            <div className="card group p-3.5 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-tight">
                  {lead.company}
                </p>
                <button
                  onClick={() => remove(lead)}
                  className="shrink-0 text-ink-faint opacity-0 transition hover:text-danger group-hover:opacity-100"
                  title="Delete lead"
                >
                  <Icon name="trash" className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-0.5 truncate text-xs text-ink-soft">
                {lead.contact}
                {lead.email ? ` · ${lead.email}` : ""}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-xs font-bold">
                  {fmtMoney(lead.value)}
                </span>
                <span className="rounded-full bg-line-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-soft">
                  {lead.source}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2.5">
                <span className="flex items-center gap-1.5">
                  <Avatar name={lead.owner} size="sm" />
                  <span className="text-[11px] font-medium text-ink-soft">
                    {lead.owner.split(" ")[0]}
                  </span>
                </span>
                <span className="text-[11px] text-ink-faint">
                  {timeAgo(lead.createdAt)}
                </span>
              </div>
            </div>
          )}
        />
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add a lead">
        <form onSubmit={add} className="space-y-4">
          <Field label="Company *">
            <input
              className="input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact *">
              <input
                className="input"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@acme.com"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source">
              <select
                className="input"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Est. value (USD)">
              <input
                type="number"
                min={0}
                step={500}
                className="input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stage">
              <select
                className="input"
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
              >
                {LEAD_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
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
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Adding…" : "Add lead"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
