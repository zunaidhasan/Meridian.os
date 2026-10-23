import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, activities } from "@/db/schema";
import { LEAD_META, type LeadStage } from "@/lib/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const b = (await req.json().catch(() => ({}))) as {
    stage?: LeadStage;
    value?: number;
    owner?: string;
  };
  const existing = await db.select().from(leads).where(eq(leads.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  const patch: { stage?: LeadStage; value?: number; owner?: string } = {};
  if (b.stage && b.stage !== cur.stage) patch.stage = b.stage;
  if (b.value !== undefined) patch.value = Number(b.value) || 0;
  if (b.owner) patch.owner = b.owner;
  const [row] = await db
    .update(leads)
    .set(patch)
    .where(eq(leads.id, id))
    .returning();
  if (patch.stage) {
    await db.insert(activities).values({
      actor: "You",
      action: `moved ${cur.company} from ${LEAD_META[cur.stage].label} to ${LEAD_META[patch.stage].label}`,
    });
  }
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await db.select().from(leads).where(eq(leads.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  await db.delete(leads).where(eq(leads.id, id));
  await db.insert(activities).values({
    actor: "You",
    action: `removed ${cur.company} from the Lead Board`,
  });
  return NextResponse.json({ ok: true });
}
