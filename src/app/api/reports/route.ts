import { NextResponse } from "next/server";
import { db } from "@/db";
import { deals, leads, kyc } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";
import {
  LEAD_STAGES,
  KYC_STATUSES,
  KYC_META,
  DEAL_META,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const [dealRows, leadRows, kycRows] = await Promise.all([
    db.select().from(deals),
    db.select().from(leads),
    db.select().from(kyc),
  ]);

  const won = dealRows.filter((d) => d.stage === "won" && d.closeDate);
  const lost = dealRows.filter((d) => d.stage === "lost");

  // last 6 months (closeDate arrives as 'YYYY-MM-DD' strings)
  const now = new Date();
  const monthly: { key: string; label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const total = won
      .filter((w) => w.closeDate && w.closeDate.slice(0, 7) === key)
      .reduce((a, w) => a + w.amount, 0);
    monthly.push({
      key,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      total,
    });
  }

  const funnel = LEAD_STAGES.slice(0, 4).map((s) => ({
    label: s.label,
    count: leadRows.filter((l) => l.stage === s.value).length,
  }));

  const kycPipeline = KYC_STATUSES.map((s) => ({
    label: s.label,
    count: kycRows.filter((r) => r.status === s.value).length,
    cls: KYC_META[s.value].dot,
  }));

  const topDeals = dealRows
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)
    .map((d) => ({
      ...d,
      createdAt: d.createdAt.toISOString(),
    }));

  const totalWon = won.reduce((a, d) => a + d.amount, 0);
  const approved = kycRows.filter((r) => r.status === "approved").length;

  return NextResponse.json({
    monthly,
    funnel,
    kyc: kycPipeline,
    topDeals,
    stats: {
      totalWon,
      avgWon: won.length ? Math.round(totalWon / won.length) : 0,
      winRate:
        won.length + lost.length > 0
          ? Math.round((won.length / (won.length + lost.length)) * 100)
          : 0,
      kycApproval:
        kycRows.length > 0 ? Math.round((approved / kycRows.length) * 100) : 0,
    },
  });
}
