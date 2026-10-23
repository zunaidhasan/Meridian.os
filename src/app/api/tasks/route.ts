import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { tasks, activities } from "@/db/schema";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await seedIfEmpty();
  const rows = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as {
    title?: string;
    description?: string | null;
    assignee?: string;
    priority?: string;
    due?: string | null;
  };
  if (!b.title?.trim()) {
    return NextResponse.json(
      { error: "Task title is required." },
      { status: 400 }
    );
  }
  const [row] = await db
    .insert(tasks)
    .values({
      title: b.title.trim(),
      description: b.description?.trim() || null,
      assignee: b.assignee?.trim() || "Unassigned",
      priority: (b.priority as never) ?? "medium",
      due: b.due || null,
      status: "backlog",
    })
    .returning();
  await db.insert(activities).values({
    actor: "You",
    action: `created task “${row.title}”`,
  });
  return NextResponse.json(row, { status: 201 });
}
