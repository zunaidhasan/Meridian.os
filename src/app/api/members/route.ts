import { NextResponse } from "next/server";
import { db } from "@/db";
import { members } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db.select().from(members);
  return NextResponse.json(rows);
}
