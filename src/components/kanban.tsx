"use client";

import { useState, type ReactNode } from "react";

export interface KanbanCol {
  key: string;
  label: string;
  dotClass: string;
}

export function Kanban<T extends { id: string }>({
  cols,
  items,
  stageOf,
  render,
  onMove,
  colMeta,
}: {
  cols: KanbanCol[];
  items: T[];
  stageOf: (item: T) => string;
  render: (item: T) => ReactNode;
  onMove: (id: string, stage: string) => void;
  colMeta?: (key: string, inCol: T[]) => ReactNode;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-4">
      {cols.map((col) => {
        const inCol = items.filter((i) => stageOf(i) === col.key);
        const isOver = overCol === col.key;
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== col.key) setOverCol(col.key);
            }}
            onDragLeave={() =>
              setOverCol((c) => (c === col.key ? null : c))
            }
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain") || dragId;
              setOverCol(null);
              setDragId(null);
              if (id) onMove(id, col.key);
            }}
            className={`w-[290px] min-w-[270px] shrink-0 rounded-xl border p-3 transition-all ${
              isOver
                ? "border-brand bg-brand-soft/50 ring-2 ring-brand/25"
                : "border-line bg-white/45"
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.dotClass}`} />
                <span className="font-display text-sm font-semibold tracking-tight">
                  {col.label}
                </span>
                <span className="rounded-full bg-line-soft px-2 py-0.5 font-mono text-[10px] font-bold text-ink-soft">
                  {inCol.length}
                </span>
              </div>
              {colMeta && colMeta(col.key, inCol)}
            </div>
            <div className="mt-3 min-h-[90px] space-y-2.5">
              {inCol.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDragId(item.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverCol(null);
                  }}
                  className={`cursor-grab transition active:cursor-grabbing ${
                    dragId === item.id ? "rotate-1 opacity-40" : ""
                  }`}
                >
                  {render(item)}
                </div>
              ))}
              {inCol.length === 0 && (
                <div
                  className={`rounded-lg border border-dashed px-3 py-6 text-center text-xs transition ${
                    isOver
                      ? "border-brand text-brand-deep"
                      : "border-line text-ink-faint"
                  }`}
                >
                  {isOver ? "Release to move" : "Drop cards here"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
