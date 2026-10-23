import Link from "next/link";
import { Icon, Wordmark, Chip, type IconName } from "@/components/ui";

const GRID_BG = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

/* ------------------------------ mock window ------------------------------ */

function MiniCard({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="rounded-lg border border-night-line bg-night p-2">
      <p className="truncate text-[10px] font-semibold text-white/80">{name}</p>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-brand-soft">
          {amount}
        </span>
        <span className="h-3.5 w-3.5 rounded-full bg-brand/50" />
      </div>
    </div>
  );
}

function MockWindow() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        className="absolute -inset-8 rounded-[40px] bg-brand/20 blur-3xl"
        aria-hidden
      />
      <div className="relative rounded-2xl border border-night-line bg-night-soft shadow-2xl">
        <div className="flex items-center gap-2 border-b border-night-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            meridian.os — pipeline
          </span>
          <span className="ml-auto rounded-full bg-brand/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-brand-soft">
            Live
          </span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Open pipeline", "$189.8k"],
              ["Won this month", "$12.8k"],
              ["KYC pending", "6 records"],
            ].map(([l, v]) => (
              <div
                key={l}
                className="rounded-lg border border-night-line bg-night px-3 py-2"
              >
                <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/35">
                  {l}
                </p>
                <p className="mt-0.5 font-display text-[13px] font-semibold text-white">
                  {v}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(
              [
                ["Proposal", [
                  ["Northwind Retail", "$34.0k"],
                  ["Helios Analytics", "$24.0k"],
                ]],
                ["Negotiation", [
                  ["Granite Capital", "$72.0k"],
                  ["Bluepeak Logistics", "$18.0k"],
                ]],
                ["Won", [
                  ["Apex Freight", "$12.8k"],
                  ["Marlow Legal", "$15.4k"],
                ]],
              ] as [string, [string, string][]][]
            ).map(([label, cards]) => (
              <div key={label} className="rounded-lg bg-white/[0.03] p-2">
                <p className="mb-2 flex items-center gap-1.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {label}
                </p>
                <div className="space-y-1.5">
                  {cards.map(([n, a]) => (
                    <MiniCard key={n} name={n} amount={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="animate-float absolute -left-4 top-16 hidden rounded-xl border border-night-line bg-night-soft px-3 py-2 shadow-xl sm:block">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-white/85">
          <Icon name="shield" className="h-3.5 w-3.5 text-brand-soft" />
          KYC approved
        </p>
        <p className="mt-0.5 font-mono text-[9px] text-white/45">
          Northwind Retail
        </p>
      </div>
      <div className="animate-float-slow absolute -right-3 bottom-10 hidden rounded-xl border border-night-line bg-night-soft px-3 py-2 shadow-xl sm:block">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-white/85">
          <Icon name="check" className="h-3.5 w-3.5 text-moss-soft" />
          Deal won
        </p>
        <p className="mt-0.5 font-mono text-[9px] text-white/45">
          $48,000 · Granite Capital
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ sections ------------------------------ */

const NAV = [
  { href: "#product", label: "Product" },
  { href: "#boards", label: "Boards" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const BOARDS: {
  n: string;
  icon: IconName;
  title: string;
  desc: string;
  stages: string[];
  href: string;
}[] = [
  {
    n: "01",
    icon: "target",
    title: "Lead Board",
    desc: "Every inbound signal lands in one place. Capture, contact and qualify without losing a name.",
    stages: ["New", "Contacted", "Qualified", "Nurture"],
    href: "/leads",
  },
  {
    n: "02",
    icon: "briefcase",
    title: "Sales Board",
    desc: "Pipeline by stage with live values, owners and close dates. The number you quote is the number you bank.",
    stages: ["Discovery", "Proposal", "Negotiation", "Won"],
    href: "/deals",
  },
  {
    n: "03",
    icon: "shield",
    title: "KYC Board",
    desc: "Documents, risk flags and approvals in a single compliance workflow — with a full audit trail.",
    stages: ["Docs requested", "Under review", "Approved"],
    href: "/kyc",
  },
  {
    n: "04",
    icon: "tool",
    title: "Operations Board",
    desc: "Invoicing, onboarding and delivery work tracked against owners, priorities and due dates.",
    stages: ["Backlog", "In progress", "Done"],
    href: "/operations",
  },
];

const FEATURES = [
  {
    eyebrow: "Sales pipeline",
    title: "Pipeline you can see end to end",
    copy: "Lead to close in one motion. Values, owners and close dates roll up automatically, so the Monday forecast takes seconds — not an hour of spreadsheet gymnastics.",
    points: ["Stage totals update live", "Weighted open pipeline", "Win rate & avg. deal size"],
    mock: "funnel" as const,
  },
  {
    eyebrow: "Compliance",
    title: "KYC without the chasing",
    copy: "Each customer carries their own record: documents collected, risk level, reviewer and decision. Nothing lives in a shared drive anymore.",
    points: ["Document checklist per customer", "Risk flags & review steps", "Approve / reject with audit trail"],
    mock: "kyc" as const,
  },
  {
    eyebrow: "Delivery",
    title: "Ops that actually ship",
    copy: "Onboarding, invoicing and account work sit on one board with owners, priorities and due dates. Overdue items surface on the dashboard before the customer asks.",
    points: ["Assign & prioritise in seconds", "Overdue alerts on the dashboard", "Weekly ops digest by email"],
    mock: "tasks" as const,
  },
];

function FeatureMock({ kind }: { kind: "funnel" | "kyc" | "tasks" }) {
  if (kind === "funnel") {
    return (
      <div className="card space-y-3 p-5">
        {[
          ["Qualified leads", 92, "bg-brand-soft"],
          ["Proposals out", 61, "bg-brand"],
          ["Negotiation", 38, "bg-gold"],
          ["Closed won", 24, "bg-moss"],
        ].map(([label, w, cls]) => (
          <div key={label as string}>
            <div className="mb-1 flex justify-between text-[11px] font-semibold text-ink-soft">
              <span>{label}</span>
              <span className="font-mono">{w}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-line-soft">
              <div
                className={`h-full rounded-full ${cls}`}
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "kyc") {
    return (
      <div className="card divide-y divide-line-soft p-2">
        {[
          ["Northwind Retail", "Approved", "bg-moss-soft text-moss-deep"],
          ["Granite Capital", "Under review", "bg-brand-soft text-brand-deep"],
          ["Cobalt Health", "Docs requested", "bg-gold-soft text-gold-deep"],
        ].map(([name, status, cls]) => (
          <div key={name as string} className="flex items-center gap-3 px-3 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-line-soft font-mono text-[10px] font-bold text-ink-soft">
              {(name as string).slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="font-mono text-[10px] text-ink-faint">
                4/4 documents
              </p>
            </div>
            <Chip className={cls as string}>{status}</Chip>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="card divide-y divide-line-soft p-2">
      {[
        ["Reconcile January invoices", "Due today", true],
        ["Onboard Granite Capital", "Due tomorrow", true],
        ["Publish KYC checklist v2", "Done", false],
      ].map(([title, due, done]) => (
        <div key={title as string} className="flex items-center gap-3 px-3 py-3">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
              done
                ? "border-moss bg-moss text-white"
                : "border-line bg-white"
            }`}
          >
            {done && <Icon name="check" className="h-3 w-3" />}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-sm font-semibold ${done ? "text-ink-faint line-through" : ""}`}
            >
              {title}
            </p>
          </div>
          <span
            className={`font-mono text-[10px] ${done ? "text-moss-deep" : "text-gold-deep"}`}
          >
            {due}
          </span>
        </div>
      ))}
    </div>
  );
}

const METRICS = [
  ["38%", "faster lead response"],
  ["2.4×", "more deals in negotiation"],
  ["11 days", "average KYC turnaround"],
  ["4 boards", "one source of truth"],
];

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    unit: "/ seat / month",
    desc: "For small teams replacing the spreadsheet.",
    items: ["Lead + Sales boards", "Up to 5 members", "Basic reports", "Email support"],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Growth",
    price: "$89",
    unit: "/ seat / month",
    desc: "The full operating system, end to end.",
    items: [
      "All four boards",
      "Unlimited members",
      "KYC workflow + audit trail",
      "Reports & exports",
      "Priority support",
    ],
    cta: "Launch the demo",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    unit: "annual",
    desc: "For multi-entity, multi-market operations.",
    items: ["SSO & roles", "API access", "Dedicated success manager", "Custom onboarding"],
    cta: "Talk to us",
    featured: false,
  },
];

const FAQS = [
  {
    q: "How long does onboarding take?",
    a: "Most teams are live in under a week. We import your contacts and deals from your current CRM or spreadsheet, map your pipeline stages, and run one working session with each board.",
  },
  {
    q: "Does Meridian replace our CRM?",
    a: "For most SMB and mid-market teams, yes — the Lead and Sales boards cover what a lightweight CRM does, plus the KYC and operations workflows a CRM never touches. You can also keep your CRM and sync the two.",
  },
  {
    q: "How is KYC data handled?",
    a: "Documents are stored encrypted, access is role-based, and every action — from document receipt to approval — is written to an immutable audit log you can export for regulators.",
  },
  {
    q: "Can we try it before buying?",
    a: "Yes. This site is a fully working demo seeded with sample data. Sign in with any email, move cards around, approve a KYC record — nothing here is a slide.",
  },
];

/* ------------------------------ page ------------------------------ */

export default function LandingPage() {
  return (
    <div className="bg-night">
      {/* top strip */}
      <div className="border-b border-white/5 py-2 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Interactive prototype · all data is sample ·{" "}
          <Link href="/login" className="text-brand-soft underline-offset-4 hover:underline">
            sign in with any email
          </Link>
        </p>
      </div>

      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Icon name="logo" className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              Meridian<span className="text-white/40">.os</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-white/60 transition hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:text-white sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep"
            >
              Launch app
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0" style={GRID_BG} aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="chip border-0 bg-brand/15 text-brand-soft ring-1 ring-inset ring-brand/40">
              <Icon name="spark" className="h-3.5 w-3.5" />
              The Business Operating System
            </span>
            <h1 className="mt-5 max-w-[12ch] font-display text-[40px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[54px]">
              Run the whole business on{" "}
              <span className="text-brand-soft">one set of boards.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60">
              Meridian OS puts leads, sales, KYC and operations on four
              connected boards — so your team works from one source of truth
              instead of five spreadsheets and a whiteboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep"
              >
                Launch the demo app
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a
                href="#boards"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
              >
                See the four boards
              </a>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
              Leads · Sales · KYC · Operations
            </p>
          </div>
          <MockWindow />
        </div>
      </section>

      {/* trusted by */}
      <section className="border-t border-white/10 bg-night">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            Piloting at
          </span>
          {["Northwind Retail", "Granite Capital", "Helios Analytics", "Apex Freight", "Marlow Legal"].map(
            (n) => (
              <span
                key={n}
                className="font-display text-sm font-semibold tracking-tight text-white/40"
              >
                {n}
              </span>
            )
          )}
        </div>
      </section>

      {/* boards */}
      <section id="boards" className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="label-mono">The product</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Four boards. One operating system.
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            Each board is a working view of the business — not a report about
            it. Drag a card and the numbers, the audit log and the dashboard
            update with it.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {BOARDS.map((b) => (
              <div
                key={b.n}
                className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
                    <Icon name={b.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-ink-faint">
                    {b.n}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {b.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {b.stages.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-line-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-soft"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href={b.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep transition group-hover:gap-2.5"
                >
                  Open in the demo
                  <Icon name="arrowRight" className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section id="product" className="border-t border-line bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-6xl space-y-20 px-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="label-mono">{f.eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {f.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  {f.copy}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm font-medium">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-moss-soft text-moss-deep">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <FeatureMock kind={f.mock} />
            </div>
          ))}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Drag & drop boards", "Move work, watch the metrics follow"],
              ["Full audit trail", "Every change logged, filterable, exportable"],
              ["Roles & permissions", "Sales sees sales; compliance sees compliance"],
              ["One-click exports", "CSV anywhere, reports on demand"],
              ["API & CSV import", "Bring your data in, keep it flowing out"],
              ["Mobile-ready", "Approve KYC from the train"],
            ].map(([t, s]) => (
              <div key={t} className="rounded-xl border border-line bg-paper p-4">
                <p className="text-sm font-semibold">{t}</p>
                <p className="mt-1 text-xs text-ink-soft">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* metrics */}
      <section className="border-y border-night-line bg-night py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 lg:grid-cols-4">
          {METRICS.map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {v}
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                {l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* testimonial */}
      <section className="bg-paper py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Icon name="spark" className="mx-auto h-6 w-6 text-gold" />
          <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-[28px]">
            “We replaced five spreadsheets and two whiteboards with Meridian.
            For the first time, the number we quote and the number we bank are
            the same number.”
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft font-mono text-xs font-bold text-gold-deep">
              SO
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold">Sarah Osei</p>
              <p className="text-xs text-ink-soft">
                COO, Northwind Retail · Growth plan customer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="border-t border-line bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="label-mono">Pricing</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple, per-seat pricing
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-soft">
              Every plan includes all four boards, unlimited records and the
              audit trail. No setup fees.
            </p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-6 ${
                  p.featured
                    ? "border-brand bg-night text-white shadow-xl"
                    : "border-line bg-paper"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                    Most popular
                  </span>
                )}
                <p
                  className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
                    p.featured ? "text-brand-soft" : "text-ink-faint"
                  }`}
                >
                  {p.name}
                </p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-tight">
                  {p.price}
                  <span
                    className={`ml-1.5 text-sm font-normal ${
                      p.featured ? "text-white/50" : "text-ink-faint"
                    }`}
                  >
                    {p.unit}
                  </span>
                </p>
                <p
                  className={`mt-2 text-sm ${
                    p.featured ? "text-white/60" : "text-ink-soft"
                  }`}
                >
                  {p.desc}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-2.5 text-sm">
                      <Icon
                        name="check"
                        className={`h-4 w-4 shrink-0 ${
                          p.featured ? "text-brand-soft" : "text-moss"
                        }`}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                    p.featured
                      ? "bg-brand text-white hover:bg-brand-deep"
                      : "border border-line bg-card text-ink hover:border-ink-faint/50"
                  }`}
                >
                  {p.cta}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="border-t border-line bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <p className="label-mono text-center">FAQ</p>
          <h2 className="mt-2 text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-card">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon
                    name="chevronDown"
                    className="h-4 w-4 shrink-0 text-ink-faint transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-night-line bg-night py-20">
        <div className="absolute inset-0" style={GRID_BG} aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            See your business on one screen.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-white/55">
            The demo is fully interactive — seeded with a realistic sample
            company you can move, approve and reset at will.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep"
            >
              Sign in to the demo
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <a
              href="#boards"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
            >
              Back to the boards
            </a>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10 bg-night py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-xs">
              <Wordmark dark />
              <p className="mt-3 text-sm leading-relaxed text-white/40">
                The Business Operating System. Four boards, one source of
                truth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {(
                [
                  ["Product", ["Lead Board", "Sales Board", "KYC Board", "Operations"]],
                  ["Company", ["About", "Careers", "Press kit", "Contact"]],
                  ["Resources", ["Documentation", "Security", "Status", "Changelog"]],
                ] as [string, string[]][]
              ).map(([h, links]) => (
                <div key={h}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {h}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {links.map((l) => (
                      <li key={l}>
                        <a
                          href="#top"
                          className="text-sm text-white/55 transition hover:text-white"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
            <p className="text-xs text-white/30">
              © 2026 Meridian Labs. Prototype build — all data shown is sample.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
              v0.1 · demo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
