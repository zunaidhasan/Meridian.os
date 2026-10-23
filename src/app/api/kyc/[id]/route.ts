import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { kyc, activities } from "@/db/schema";
import { KYC_META, type KycStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const ACTIONS: Record<KycStatus, string> = {
  docs_requested: "sent the document request for",
  docs_received: "marked docs received for",
  under_review: "started KYC review for",
  approved: "approved KYC for",
  rejected: "rejected KYC for",
};

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const b = (await req.json().catch(() => ({}))) as {
    status?: KycStatus;
    risk?: string;
    note?: string | null;
  };
  const existing = await db.select().from(kyc).where(eq(kyc.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "KYC record not found." }, { status: 404 });
  }
  const patch: {
    status?: KycStatus;
    risk?: (typeof cur.risk);
    note?: string | null;
    docsReceived?: number;
    updatedAt?: Date;
  } = { updatedAt: new Date() };
  if (b.status && b.status !== cur.status) {
    patch.status = b.status;
    if (b.status === "docs_received") patch.docsReceived = cur.docsTotal;
  }
  if (b.risk) patch.risk = b.risk as never;
  if (b.note !== undefined) patch.note = b.note;
  const [row] = await db
    .update(kyc)
    .set(patch)
    .where(eq(kyc.id, id))
    .returning();
  if (patch.status) {
    await db.insert(activities).values({
      actor: "You",
      action: `${ACTIONS[patch.status]} ${cur.customer} (${cur.reference})`,
    });
  }
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await db.select().from(kyc).where(eq(kyc.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "KYC record not found." }, { status: 404 });
  }
  await db.delete(kyc).where(eq(kyc.id, id));
  await db.insert(activities).values({
    actor: "You",
    action: `closed KYC record ${cur.reference} — ${cur.customer}`,
  });
  return NextResponse.json({ ok: true });
}
