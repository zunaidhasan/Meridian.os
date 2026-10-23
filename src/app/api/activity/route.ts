import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.at))
    .limit(60);
  return NextResponse.json(rows);
}
