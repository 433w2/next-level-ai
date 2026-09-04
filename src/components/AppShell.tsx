import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  ClipboardList,
  CalendarClock,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/smart-email", label: "Smart Email", icon: Mail },
  { to: "/meeting-summarizer", label: "Meeting Summarizer", icon: ClipboardList },
  { to: "/task-planner", label: "Task Planner", icon: CalendarClock },
  { to: "/prompt-coach", label: "Prompt Coach", icon: Sparkles },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 gradient-pitch pitch-grid text-ink-foreground shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Crest />
            <span className="leading-tight">
              <span className="block text-display text-lg font-bold sm:text-xl">
                Next Level East Academy
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-accent">
                AI Workplace Productivity
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-white/10 px-4 pb-4 lg:hidden">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>

      <footer className="mt-8 border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-display text-sm font-bold text-primary">
            Work Smarter. Think Better. Perform at Your Next Level.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            AI-generated content may contain errors. Review and validate important information
            before using it.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function Crest() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-[10px_10px_14px_14px] border-2 border-accent bg-ink text-accent shadow-md">
      <span className="text-display text-base font-bold leading-none">NL</span>
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 border-l-4 border-accent pl-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold uppercase tracking-wide sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
