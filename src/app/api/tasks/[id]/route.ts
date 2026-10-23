import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks, activities } from "@/db/schema";
import { TASK_META, type TaskStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const b = (await req.json().catch(() => ({}))) as {
    status?: TaskStatus;
    priority?: string;
    assignee?: string;
    due?: string | null;
  };
  const existing = await db.select().from(tasks).where(eq(tasks.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }
  const patch: {
    status?: TaskStatus;
    priority?: (typeof cur.priority);
    assignee?: string;
    due?: string | null;
  } = {};
  if (b.status && b.status !== cur.status) patch.status = b.status;
  if (b.priority) patch.priority = b.priority as never;
  if (b.assignee) patch.assignee = b.assignee;
  if (b.due !== undefined) patch.due = b.due || null;
  const [row] = await db
    .update(tasks)
    .set(patch)
    .where(eq(tasks.id, id))
    .returning();
  if (patch.status) {
    const action =
      patch.status === "done"
        ? `shipped “${cur.title}”`
        : patch.status === "in_progress"
          ? `started “${cur.title}”`
          : `moved “${cur.title}” back to ${TASK_META[patch.status].label}`;
    await db.insert(activities).values({ actor: "You", action });
  }
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await db.select().from(tasks).where(eq(tasks.id, id));
  const cur = existing[0];
  if (!cur) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }
  await db.delete(tasks).where(eq(tasks.id, id));
  await db.insert(activities).values({
    actor: "You",
    action: `deleted task “${cur.title}”`,
  });
  return NextResponse.json({ ok: true });
}
