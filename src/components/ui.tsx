import type { ReactNode } from "react";
import { initials } from "@/lib/api";

/* ------------------------------ icons ------------------------------ */

const P = {
  logo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9" />
      <path d="M3.5 12h17" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.2c0 4.4-2.9 7.8-7 9.8-4.1-2-7-5.4-7-9.8V6z" />
      <path d="M9 11.8l2.1 2.1 3.9-3.9" />
    </>
  ),
  tool: (
    <>
      <path d="M14.7 6.3a4.2 4.2 0 0 0-5.6 5.5L4 17v3h3l5.2-5.1a4.2 4.2 0 0 0 5.5-5.6l-2.9 2.9-2.5-2.5z" />
    </>
  ),
  chart: (
    <>
      <path d="M5 20v-7M10 20V6M15 20v-10M20 20V9" />
      <path d="M3.5 20h17" />
    </>
  ),
  pulse: (
    <>
      <path d="M3 12h3.5l2-6 4 12 2-6H21" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20.5 20.5L16.2 16.2" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4.8 1.8 5.8 1.8 5.8H4.2S6 14.3 6 9.5" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5.5M14 11v5.5" />
    </>
  ),
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
  chevronLeft: <path d="M14.5 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  arrowRight: <path d="M4 12h16M14 6l6 6-6 6" />,
  spark: (
    <path d="M12 3.5l1.9 5.4 5.4 1.9-5.4 1.9L12 18.1l-1.9-5.4-5.4-1.9 5.4-1.9z" />
  ),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  logout: (
    <>
      <path d="M9.5 4H18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9.5" />
      <path d="M13.5 12H3.5M7 8.5L3.5 12 7 15.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7.5l8.5 6 8.5-6" />
    </>
  ),
  building: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M10.5 20.5V16h3v4.5" />
    </>
  ),
  filter: <path d="M4 5.5h16l-6.2 7.2v4.8l-3.6 2V12.7z" />,
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3.5 20c0-3.1 2.4-5 5.5-5s5.5 1.9 5.5 5" />
      <circle cx="17.5" cy="9.5" r="2.5" />
      <path d="M16.5 15.2c2.6.3 4 2 4 4.3" />
    </>
  ),
} as const;

export type IconName = keyof typeof P;

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {P[name]}
    </svg>
  );
}

/* ------------------------------ logo ------------------------------ */

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          dark ? "bg-brand text-white" : "bg-brand text-white"
        }`}
      >
        <Icon name="logo" className="h-5 w-5" />
      </span>
      <span
        className={`font-display text-lg font-semibold tracking-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        Meridian<span className={dark ? "text-brand-soft/60" : "text-ink-faint"}>.os</span>
      </span>
    </span>
  );
}

/* ------------------------------ chip ------------------------------ */

export function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`chip ${className}`}>{children}</span>;
}

/* ------------------------------ avatar ------------------------------ */

const AVATAR_TONES = [
  "bg-brand-soft text-brand-deep",
  "bg-gold-soft text-gold-deep",
  "bg-moss-soft text-moss-deep",
  "bg-danger-soft text-danger-deep",
  "bg-[#e9e5f0] text-[#65578f]",
];

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tone = AVATAR_TONES[hash % AVATAR_TONES.length];
  const cls =
    size === "sm"
      ? "h-6 w-6 text-[9px]"
      : size === "lg"
        ? "h-10 w-10 text-sm"
        : "h-8 w-8 text-[11px]";
  return (
    <span
      className={`flex ${cls} shrink-0 items-center justify-center rounded-full font-mono font-bold ${tone}`}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

/* ------------------------------ page header ------------------------------ */

export function PageHeader({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label-mono mb-1">{eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight lg:text-[28px]">
          {title}
        </h1>
        {sub && <p className="mt-1 text-sm text-ink-soft">{sub}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* ------------------------------ stat card ------------------------------ */

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  icon: IconName;
  tone?: "brand" | "gold" | "moss" | "danger";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-soft text-brand-deep",
    gold: "bg-gold-soft text-gold-deep",
    moss: "bg-moss-soft text-moss-deep",
    danger: "bg-danger-soft text-danger-deep",
  };
  const accents: Record<string, string> = {
    brand: "border-t-brand",
    gold: "border-t-gold",
    moss: "border-t-moss",
    danger: "border-t-danger",
  };
  return (
    <div className={`card animate-rise border-t-2 p-4 ${accents[tone]}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-ink-soft">{label}</p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}
        >
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-[26px] font-semibold tracking-tight">
        {value}
      </p>
      {sub && <div className="mt-1 text-xs text-ink-faint">{sub}</div>}
    </div>
  );
}

/* ------------------------------ modal ------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-night/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="card animate-toast relative w-full max-w-md p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-faint transition hover:bg-line-soft hover:text-ink"
            aria-label="Close"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

/* ------------------------------ progress ------------------------------ */

export function ProgressBar({
  value,
  className = "bg-brand",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
      <div
        className={`h-full rounded-full transition-all ${className}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ------------------------------ misc ------------------------------ */

export function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex items-center gap-3 text-ink-faint">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />
        <span className="font-mono text-xs uppercase tracking-[0.14em]">
          Loading…
        </span>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  sub,
}: {
  icon: IconName;
  title: string;
  sub?: string;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 border-dashed px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="font-display text-base font-semibold">{title}</p>
      {sub && <p className="max-w-xs text-sm text-ink-soft">{sub}</p>}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-white/70 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
      {children}
    </kbd>
  );
}
