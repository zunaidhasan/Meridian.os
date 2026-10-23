import { NextResponse } from "next/server";
import { resetAndSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await resetAndSeed();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Reset failed" },
      { status: 500 }
    );
  }
}
