import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  ClipboardList,
  CalendarClock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flag,
  History,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { dashboardData } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Next Level East Academy | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work Smarter. Think Better. Perform at Your Next Level. Draft emails, summarise meetings, plan your day and sharpen your prompts with AI.",
      },
      {
        property: "og:title",
        content: "Next Level East Academy | AI Workplace Productivity Assistant",
      },
      {
        property: "og:description",
        content:
          "An AI assistant for professional emails, meeting summaries, task planning and prompt coaching.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/smart-email",
    label: "Smart Email",
    icon: Mail,
    copy: "Draft professional emails with the right tone, length and outcome.",
  },
  {
    to: "/meeting-summarizer",
    label: "Meeting Summarizer",
    icon: ClipboardList,
    copy: "Turn raw notes into decisions, action items, owners and deadlines.",
  },
  {
    to: "/task-planner",
    label: "Task Planner",
    icon: CalendarClock,
    copy: "Build a realistic, prioritised schedule around the time you have.",
  },
  {
    to: "/prompt-coach",
    label: "Prompt Coach",
    icon: Sparkles,
    copy: "Score your prompts out of 100 and learn what makes them stronger.",
  },
] as const;

const LEVEL_STYLES = {
  High: "bg-destructive/15 text-destructive",
  Medium: "bg-accent/30 text-accent-foreground",
  Low: "bg-primary/10 text-primary",
} as const;

function Dashboard() {
  return (
    <AppShell>
      <section className="gradient-pitch pitch-grid relative overflow-hidden rounded-2xl px-6 py-10 text-ink-foreground sm:px-10 sm:py-14">
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Next Level East Academy
          </p>
          <h1 className="mt-3 text-4xl font-bold uppercase leading-[1.05] sm:text-6xl">
            Work Smarter.
            <br />
            Think Better.
            <br />
            <span className="text-accent">Perform at Your Next Level.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-ink-foreground/80 sm:text-base">
            Your AI workplace productivity assistant — built for teamwork, strategy and disciplined
            execution. Four tools, one game plan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/smart-email"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Start with Smart Email <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/responsible-ai"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white/10"
            >
              <ShieldCheck className="size-4" /> Responsible AI
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map(({ to, label, icon: Icon, copy }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex flex-col p-5 transition-transform hover:-translate-y-1"
          >
            <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-lg font-bold uppercase tracking-wide">{label}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{copy}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-8 flex items-center gap-3">
        <span className="rounded-full border border-accent bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          Sample Data
        </span>
        <p className="text-xs text-muted-foreground">
          The panels below are illustrative demo content for training purposes.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Panel title="Today's Priorities" icon={Flag}>
          <ul className="space-y-3">
            {dashboardData.priorities.map((p) => (
              <li key={p.task} className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium">{p.task}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${LEVEL_STYLES[p.level]}`}
                >
                  {p.level}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Completed Tasks" icon={CheckCircle2}>
          <ul className="space-y-3">
            {dashboardData.completed.map((c) => (
              <li key={c} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground line-through">{c}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming Deadlines" icon={CalendarClock}>
          <ul className="space-y-3">
            {dashboardData.deadlines.map((d) => (
              <li key={d.label} className="border-l-2 border-accent pl-3">
                <p className="text-sm font-medium">{d.label}</p>
                <p className="text-xs text-muted-foreground">{d.when}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent Activity" icon={History}>
          <ul className="space-y-3">
            {dashboardData.activity.map((a) => (
              <li key={a.detail}>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{a.tool}</p>
                <p className="text-sm">{a.detail}</p>
                <p className="text-xs text-muted-foreground">{a.when}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <div className="mb-4 flex items-center gap-2 border-b pb-3">
        <Icon className="size-4 text-primary" />
        <h2 className="text-display text-sm font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
