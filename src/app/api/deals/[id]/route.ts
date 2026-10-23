import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { deals, activities } from "@/db/schema";
import { DEAL_META, type DealStage } from "@/lib/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const b = (await req.json().catch(() => ({}))) as {
    stage?: DealStage;
    amount?: number;
    owner?: string;
    closeDate?: string | null;
  };
  const existing = await db.select().from(deals).where(eq(deals.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "Deal not found." }, { status: 404 });
  }
  const patch: {
    stage?: DealStage;
    amount?: number;
    owner?: string;
    closeDate?: string | null;
  } = {};
  if (b.stage && b.stage !== cur.stage) patch.stage = b.stage;
  if (b.amount !== undefined) patch.amount = Number(b.amount) || 0;
  if (b.owner) patch.owner = b.owner;
  if (b.closeDate !== undefined) patch.closeDate = b.closeDate || null;
  const [row] = await db
    .update(deals)
    .set(patch)
    .where(eq(deals.id, id))
    .returning();
  if (patch.stage) {
    const money = `$${cur.amount.toLocaleString("en-US")}`;
    const action =
      patch.stage === "won"
        ? `closed won “${cur.title}” — ${money}`
        : patch.stage === "lost"
          ? `marked “${cur.title}” as lost`
          : `moved ${cur.company} from ${DEAL_META[cur.stage].label} to ${DEAL_META[patch.stage].label}`;
    await db.insert(activities).values({ actor: "You", action });
  }
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await db.select().from(deals).where(eq(deals.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "Deal not found." }, { status: 404 });
  }
  await db.delete(deals).where(eq(deals.id, id));
  await db.insert(activities).values({
    actor: "You",
    action: `removed deal “${cur.title}”`,
  });
  return NextResponse.json({ ok: true });
}
