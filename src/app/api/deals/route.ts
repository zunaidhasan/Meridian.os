import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { deals, activities } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db.select().from(deals).orderBy(desc(deals.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as {
    title?: string;
    company?: string;
    amount?: number;
    stage?: string;
    owner?: string;
    closeDate?: string | null;
  };
  if (!b.title?.trim() || !b.company?.trim()) {
    return NextResponse.json(
      { error: "Deal title and company are required." },
      { status: 400 }
    );
  }
  const [row] = await db
    .insert(deals)
    .values({
      title: b.title.trim(),
      company: b.company.trim(),
      amount: Number(b.amount) || 0,
      stage: (b.stage as never) ?? "discovery",
      owner: b.owner?.trim() || "Unassigned",
      closeDate: b.closeDate || null,
    })
    .returning();
  await db.insert(activities).values({
    actor: "You",
    action: `created deal “${row.title}” — ${row.company}`,
  });
  return NextResponse.json(row, { status: 201 });
}
