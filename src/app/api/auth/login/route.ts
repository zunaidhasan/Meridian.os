import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function nameFromEmail(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(/[._\-+\d]+/).filter(Boolean);
  if (parts.length === 0) return "Demo User";
  return parts
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters." },
      { status: 400 }
    );
  }

  const user =
    email.toLowerCase() === "demo@meridian.io"
      ? { name: "Alex Kim", email, role: "Administrator" }
      : { name: nameFromEmail(email), email, role: "Administrator" };

  return NextResponse.json({
    token: crypto.randomUUID(),
    user,
  });
}
