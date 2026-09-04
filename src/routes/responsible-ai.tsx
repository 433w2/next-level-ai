import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Scale, Lock, SearchCheck, UserCheck, BookOpen } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | Next Level East Academy" },
      {
        name: "description",
        content:
          "Understand AI limitations, bias, privacy, fact-checking and human oversight before using AI at work.",
      },
      { property: "og:title", content: "Responsible AI | Next Level East Academy" },
      {
        property: "og:description",
        content: "A practical guide to using workplace AI safely and ethically.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const TOPICS = [
  {
    icon: AlertTriangle,
    title: "AI Limitations",
    body: "AI predicts likely text — it does not know the truth. It can state wrong facts with total confidence, misread nuance, and has no awareness of anything that happened outside its training or your input.",
    practice: "Treat every output as a first draft written by a fast, confident intern.",
  },
  {
    icon: Scale,
    title: "Bias and Fairness",
    body: "Models learn from human-created data, so they can reproduce stereotypes about gender, race, age, language and disability, and can favour dominant cultural norms.",
    practice: "Check who is represented, who is left out, and whether the tone would land well for everyone.",
  },
  {
    icon: Lock,
    title: "Privacy and Confidentiality",
    body: "Anything you paste into an AI tool leaves your device. Personal identifiers, ID numbers, health details, salaries, client contracts and unreleased strategy do not belong in a prompt.",
    practice: "Anonymise first: use roles and placeholders instead of real names and numbers.",
  },
  {
    icon: SearchCheck,
    title: "Fact-Checking",
    body: "Names, dates, statistics, legal references and quotes are the highest-risk items in any AI output. This assistant is instructed never to invent them and to mark gaps as “Not specified”.",
    practice: "Verify every figure and date against a source you trust before sending.",
  },
  {
    icon: UserCheck,
    title: "Human Oversight",
    body: "AI supports judgement; it does not replace accountability. A person must own every decision, message and plan that leaves this tool.",
    practice: "You sign it, you own it. Read the full output before you act on it.",
  },
  {
    icon: BookOpen,
    title: "Transparency",
    body: "Colleagues and clients deserve to know when AI helped produce something that affects them, especially in assessments, feedback and formal communication.",
    practice: "Be open about your AI use and keep the human reasoning visible.",
  },
];

const CHECKLIST = [
  "Did I remove confidential or personal information from my prompt?",
  "Did I supply the real facts instead of letting AI guess them?",
  "Have I verified every name, date, number and commitment?",
  "Would this output be fair and respectful to everyone it mentions?",
  "Am I comfortable being accountable for this exactly as written?",
];

function ResponsibleAiPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Feature 05"
        title="Responsible AI"
        description="Performance without discipline is risk. These are the ground rules for using AI well at work."
      />

      <div
        role="note"
        className="mb-8 flex items-start gap-3 rounded-xl border-2 border-accent bg-accent/15 p-4"
      >
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
        <p className="text-sm font-semibold">
          AI-generated content may contain errors. Review and validate important information before
          using it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOPICS.map(({ icon: Icon, title, body, practice }) => (
          <article key={title} className="surface-card flex flex-col p-5">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-3 text-lg font-bold uppercase tracking-wide">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
            <p className="mt-3 border-l-2 border-accent pl-3 text-sm font-semibold">{practice}</p>
          </article>
        ))}
      </div>

      <section className="surface-card mt-8 p-6">
        <h2 className="text-display text-xl font-bold">Pre-Send Checklist</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Run this five-point check before any AI-assisted output leaves your hands.
        </p>
        <ol className="mt-4 space-y-3">
          {CHECKLIST.map((item, i) => (
            <li key={item} className="flex gap-3 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-ink-foreground">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
