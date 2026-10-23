"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Icon, Wordmark, Avatar, Kbd, type IconName } from "@/components/ui";
import { useToast } from "@/components/toast";

interface AppUser {
  name: string;
  email: string;
  role: string;
}

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/leads", label: "Lead Board", icon: "target" },
  { href: "/deals", label: "Sales Board", icon: "briefcase" },
  { href: "/kyc", label: "KYC Board", icon: "shield" },
  { href: "/operations", label: "Operations", icon: "tool" },
  { href: "/reports", label: "Reports", icon: "chart" },
  { href: "/activity", label: "Activity", icon: "pulse" },
  { href: "/settings", label: "Settings", icon: "gear" },
];

function SidebarContent({
  user,
  onSignOut,
  onNavigate,
}: {
  user: AppUser | null;
  onSignOut: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-5 pt-6">
        <Wordmark dark />
      </div>
      <div className="mx-4 mb-4 rounded-lg border border-night-line bg-night-soft px-3 py-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
          Workspace
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-white">
          Meridian HQ
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand text-white shadow-sm"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={n.icon} className="h-[18px] w-[18px]" />
              {n.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-night-line p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name ?? "Demo User"} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "Demo User"}
            </p>
            <p className="truncate font-mono text-[10px] text-white/40">
              {user?.role ?? "Administrator"}
            </p>
          </div>
          <button
            onClick={onSignOut}
            title="Sign out"
            className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="logout" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("meridian.token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      setUser(JSON.parse(localStorage.getItem("meridian.user") ?? "null"));
    } catch {
      setUser(null);
    }
    setAuthed(true);
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (authed === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-night">
        <Wordmark dark />
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-night-line border-t-brand-soft" />
      </div>
    );
  }

  function signOut() {
    localStorage.removeItem("meridian.token");
    localStorage.removeItem("meridian.user");
    router.replace("/login");
  }

  const section =
    NAV.find((n) => n.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-night lg:block">
        <SidebarContent user={user} onSignOut={signOut} />
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-night/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            id="mobile-navigation"
            className="absolute inset-y-0 left-0 w-64 bg-night shadow-2xl"
          >
            <SidebarContent
              user={user}
              onSignOut={signOut}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ink-soft transition hover:bg-line-soft lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:block">
                Meridian OS
              </span>
              <span className="hidden text-ink-faint sm:block">/</span>
              <span className="truncate font-semibold text-ink">{section}</span>
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <div className="relative hidden md:block">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                />
                <input
                  ref={searchRef}
                  placeholder="Search…"
                  className="input w-60 rounded-full py-1.5 pl-9 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Kbd>/</Kbd>
                </span>
              </div>
              <button
                onClick={() => toast("You're all caught up — no new alerts.", "info")}
                className="relative rounded-lg p-2 text-ink-soft transition hover:bg-line-soft"
                aria-label="Notifications"
              >
                <Icon name="bell" className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold ring-2 ring-paper" />
              </button>
              <span className="hidden h-6 w-px bg-line sm:block" />
              <Link href="/settings" className="flex items-center gap-2">
                <Avatar name={user?.name ?? "Demo User"} size="sm" />
                <span className="hidden text-sm font-semibold sm:block">
                  {user?.name.split(" ")[0] ?? "Demo"}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="mx-auto max-w-[1440px] px-4 pb-6 lg:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint/70">
            Meridian OS · prototype build · sample data
          </p>
        </footer>
      </div>
    </div>
  );
}
