import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db.select().from(settings);
  const row = rows[0];
  if (!row) {
    return NextResponse.json({
      id: 1,
      workspaceName: "Meridian HQ",
      plan: "Growth",
      timezone: "Europe/London",
    });
  }
  return NextResponse.json(row);
}

export async function PUT(req: Request) {
  const b = (await req.json().catch(() => ({}))) as {
    workspaceName?: string;
    plan?: string;
    timezone?: string;
  };
  const payload = {
    workspaceName: b.workspaceName?.trim() || "Meridian HQ",
    plan: b.plan || "Growth",
    timezone: b.timezone || "Europe/London",
  };
  const existing = await db.select().from(settings);
  let row;
  if (existing.length > 0) {
    [row] = await db
      .update(settings)
      .set(payload)
      .where(eq(settings.id, existing[0].id))
      .returning();
  } else {
    [row] = await db.insert(settings).values(payload).returning();
  }
  return NextResponse.json(row);
}
