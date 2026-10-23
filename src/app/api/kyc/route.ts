import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { kyc, activities } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db
    .select()
    .from(kyc)
    .orderBy(desc(kyc.updatedAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as {
    customer?: string;
    reference?: string;
    country?: string;
    risk?: string;
    note?: string | null;
  };
  if (!b.customer?.trim()) {
    return NextResponse.json(
      { error: "Customer name is required." },
      { status: 400 }
    );
  }
  const [row] = await db
    .insert(kyc)
    .values({
      customer: b.customer.trim(),
      reference:
        b.reference?.trim() ||
        `KYC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      country: b.country?.trim() || "—",
      risk: (b.risk as never) ?? "medium",
      docsTotal: 4,
      docsReceived: 0,
      status: "docs_requested",
      note: b.note ?? null,
    })
    .returning();
  await db.insert(activities).values({
    actor: "You",
    action: `opened KYC record ${row.reference} for ${row.customer}`,
  });
  return NextResponse.json(row, { status: 201 });
}
