import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads, activities } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as {
    company?: string;
    contact?: string;
    email?: string | null;
    source?: string;
    value?: number;
    stage?: string;
    owner?: string;
  };
  if (!b.company?.trim() || !b.contact?.trim()) {
    return NextResponse.json(
      { error: "Company and contact are required." },
      { status: 400 }
    );
  }
  const [row] = await db
    .insert(leads)
    .values({
      company: b.company.trim(),
      contact: b.contact.trim(),
      email: b.email?.trim() || null,
      source: b.source?.trim() || "Website",
      value: Number(b.value) || 0,
      stage: (b.stage as never) ?? "new",
      owner: b.owner?.trim() || "Unassigned",
    })
    .returning();
  await db.insert(activities).values({
    actor: "You",
    action: `added ${row.company} to the Lead Board`,
  });
  return NextResponse.json(row, { status: 201 });
}
