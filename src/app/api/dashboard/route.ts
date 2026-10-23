import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads, deals, kyc, tasks, activities } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";
import { DEAL_STAGES, type DealStage } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const [dealRows, leadRows, kycRows, taskRows, actRows] = await Promise.all([
    db.select().from(deals),
    db.select().from(leads),
    db.select().from(kyc),
    db.select().from(tasks),
    db.select().from(activities).orderBy(desc(activities.at)).limit(8),
  ]);

  const now = new Date();
  const today0 = new Date(now);
  today0.setHours(0, 0, 0, 0);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const openDeals = dealRows.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  );
  const openPipeline = openDeals.reduce((a, d) => a + d.amount, 0);
  const wonThisMonth = dealRows
    .filter(
      (d) =>
        d.stage === "won" &&
        d.closeDate &&
        new Date(d.closeDate) >= startMonth
    )
    .reduce((a, d) => a + d.amount, 0);

  const pipeline = DEAL_STAGES.filter((s) => s.value !== "lost").map((s) => {
    const inStage = dealRows.filter((d) => d.stage === s.value);
    return {
      stage: s.value as DealStage,
      total: inStage.reduce((a, d) => a + d.amount, 0),
      count: inStage.length,
    };
  });

  const openLeads = leadRows.filter((l) => l.stage !== "disqualified");
  const qualifiedLeads = leadRows.filter((l) => l.stage === "qualified");
  const kycPending = kycRows.filter(
    (r) =>
      r.status === "docs_requested" ||
      r.status === "docs_received" ||
      r.status === "under_review"
  );
  const kycHighRisk = kycRows.filter(
    (r) =>
      r.risk === "high" && r.status !== "approved" && r.status !== "rejected"
  );

  const openTasks = taskRows.filter((t) => t.status !== "done");
  const overdueTasks = openTasks.filter(
    (t) => t.due && new Date(t.due) < today0
  );

  const attention: {
    kind: "task" | "kyc" | "lead";
    id: string;
    title: string;
    sub: string;
    tone: "danger" | "gold" | "brand";
  }[] = [
    ...overdueTasks.slice(0, 3).map((t) => ({
      kind: "task" as const,
      id: t.id,
      title: t.title,
      sub: `Overdue · was due ${new Date(t.due!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} · ${t.assignee}`,
      tone: "danger" as const,
    })),
    ...kycHighRisk.slice(0, 3).map((r) => ({
      kind: "kyc" as const,
      id: r.id,
      title: `${r.customer} — high risk`,
      sub: `${r.reference} · ${r.docsReceived}/${r.docsTotal} docs · ${
        r.status === "under_review" ? "in review" : "waiting on docs"
      }`,
      tone: "gold" as const,
    })),
    ...openLeads
      .filter(
        (l) => l.stage === "new" && l.createdAt.getTime() < Date.now() - 2 * 864e5
      )
      .slice(0, 3)
      .map((l) => ({
        kind: "lead" as const,
        id: l.id,
        title: l.company,
        sub: "New lead waiting on first touch",
        tone: "brand" as const,
      })),
  ];

  return NextResponse.json({
    kpis: {
      openPipeline,
      wonThisMonth,
      openLeads: openLeads.length,
      qualifiedLeads: qualifiedLeads.length,
      kycPending: kycPending.length,
      kycHighRisk: kycHighRisk.length,
      opsOpen: openTasks.length,
      opsOverdue: overdueTasks.length,
    },
    pipeline,
    attention: attention.slice(0, 6),
    activity: actRows,
  });
}
