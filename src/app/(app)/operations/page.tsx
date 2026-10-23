"use client";

import { useCallback, useEffect, useState } from "react";
import { Kanban } from "@/components/kanban";
import {
  Icon,
  PageHeader,
  Modal,
  Field,
  Avatar,
  Chip,
  Loading,
} from "@/components/ui";
import { useToast } from "@/components/toast";
import { api, fmtDate, isOverdue, toInputDate } from "@/lib/api";
import {
  TASK_STATUSES,
  TASK_META,
  PRIORITY_META,
  type Task,
  type TaskStatus,
  type Priority,
  type Member,
} from "@/lib/types";

const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export default function OperationsPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("Unassigned");
  const [priority, setPriority] = useState<Priority>("medium");
  const [due, setDue] = useState(toInputDate(new Date(Date.now() + 3 * 864e5)));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, m] = await Promise.all([
        api<Task[]>("/api/tasks"),
        api<Member[]>("/api/members"),
      ]);
      setTasks(t);
      setMembers(m);
      if (m.length) setAssignee((a) => (a === "Unassigned" ? m[0].name : a));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function move(id: string, next: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === next) return;
    setTasks((p) =>
      p.map((t) => (t.id === id ? { ...t, status: next as TaskStatus } : t))
    );
    api(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    })
      .then(() =>
        toast(
          next === "done"
            ? `Shipped — ${task.title}`
            : `Moved “${task.title}” to ${TASK_META[next as TaskStatus].label}`
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
      const row = await api<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || null,
          assignee: members.some((m) => m.name === assignee)
            ? assignee
            : members[0]?.name ?? "Unassigned",
          priority,
          due: due || null,
          status: "backlog",
        }),
      });
      setTasks((p) => [row, ...p]);
      setModal(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
      toast(`${row.title} added to the backlog`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add task", "error");
    } finally {
      setSaving(false);
    }
  }

  const open = tasks.filter((t) => t.status !== "done");
  const overdue = open.filter((t) => isOverdue(t.due));

  return (
    <div>
      <PageHeader
        eyebrow="Board 04"
        title="Operations Board"
        sub={`${open.length} open tasks · ${overdue.length} overdue. Drag cards to update status.`}
        right={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            New task
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : (
        <Kanban
          cols={TASK_STATUSES.map((s) => ({
            key: s.value,
            label: s.label,
            dotClass: TASK_META[s.value].dot,
          }))}
          items={tasks}
          stageOf={(t) => t.status}
          onMove={move}
          render={(task) => {
            const done = task.status === "done";
            const late = !done && isOverdue(task.due);
            return (
              <div className="card group p-3.5 transition hover:shadow-md">
                <p
                  className={`text-sm font-semibold leading-tight ${
                    done ? "text-ink-faint line-through" : ""
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                    {task.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Chip className={PRIORITY_META[task.priority].chip}>
                    {PRIORITY_META[task.priority].label}
                  </Chip>
                  {task.due && (
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] font-semibold ${
                        late
                          ? "bg-danger-soft rounded-full px-2 py-0.5 text-danger-deep"
                          : "text-ink-faint"
                      }`}
                    >
                      <Icon name="clock" className="h-3 w-3" />
                      {late ? "overdue · " : "due "}
                      {fmtDate(task.due)}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2.5">
                  <span className="flex items-center gap-1.5">
                    <Avatar name={task.assignee} size="sm" />
                    <span className="text-[11px] font-medium text-ink-soft">
                      {task.assignee.split(" ")[0]}
                    </span>
                  </span>
                  {!done && (
                    <button
                      onClick={() => move(task.id, "done")}
                      className="rounded-md px-2 py-1 text-[11px] font-bold text-moss-deep opacity-0 transition hover:bg-moss-soft group-hover:opacity-100"
                    >
                      Mark done
                    </button>
                  )}
                </div>
              </div>
            );
          }}
        />
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New task">
        <form onSubmit={add} className="space-y-4">
          <Field label="Task *">
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reconcile February invoices"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-[70px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does done look like?"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assignee">
              <select
                className="input"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                {members.map((m) => (
                  <option key={m.id}>{m.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Due date">
              <input
                type="date"
                className="input"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Priority">
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`chip justify-center px-2 py-2 transition ${
                    priority === p
                      ? "bg-ink text-paper ring-ink"
                      : "bg-card text-ink-soft ring-line hover:bg-line-soft"
                  }`}
                >
                  {PRIORITY_META[p].label}
                </button>
              ))}
            </div>
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
              {saving ? "Adding…" : "Add task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
