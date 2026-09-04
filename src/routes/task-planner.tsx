import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ErrorNote, LoadingCard, ResultPanel, SampleBadge } from "@/components/ResultPanel";
import type { RefineAction } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "./smart-email";
import { generateContent } from "@/lib/ai.functions";
import { samplePlanner } from "@/lib/sample-data";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Next Level East Academy" },
      {
        name: "description",
        content:
          "Turn a task list into a realistic prioritised schedule with time blocks, priorities and expected outcomes.",
      },
      { property: "og:title", content: "AI Task Planner | Next Level East Academy" },
      {
        property: "og:description",
        content: "Prioritised, achievable day plans with top 3 priorities and review questions.",
      },
    ],
  }),
  component: PlannerPage,
});

const EMPTY = {
  tasks: "",
  deadlines: "",
  startTime: "08:30",
  endTime: "17:00",
  commitments: "",
  period: "Single day",
};

function PlannerPage() {
  const generate = useServerFn(generateContent);
  const [form, setForm] = useState({ ...EMPTY });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [isSample, setIsSample] = useState(false);

  const run = async (refine: RefineAction | "none" = "none", previous = "") => {
    const next: Record<string, string> = {};
    if (form.tasks.trim().length < 5) next["tasks"] = "List at least one task to plan.";
    if (form.startTime && form.endTime && form.endTime <= form.startTime)
      next["endTime"] = "The end time must be after the start time.";
    setIssues(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setError("");
    try {
      const res = await generate({ data: { kind: "planner", payload: form, refine, previous } });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Feature 03"
        title="AI Task Planner"
        description="Match your workload to the hours you actually have. The planner never builds an impossible schedule — it tells you what has to move."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form
          className="surface-card space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-display text-base font-bold">Your Workload</h2>
            <SampleBadge
              onUse={() => {
                setForm({ ...samplePlanner });
                setIsSample(true);
                setIssues({});
              }}
            />
          </div>
          {isSample && (
            <p className="rounded-md bg-accent/20 px-3 py-2 text-xs font-semibold">
              Sample Data loaded — edit any field before planning.
            </p>
          )}

          <Field label="Tasks (with rough durations if known)" error={issues["tasks"]}>
            <Textarea
              value={form.tasks}
              onChange={(e) => setForm({ ...form, tasks: e.target.value })}
              placeholder="One task per line"
              className="min-h-40"
            />
          </Field>
          <Field label="Deadlines">
            <Textarea
              value={form.deadlines}
              onChange={(e) => setForm({ ...form, deadlines: e.target.value })}
              placeholder="e.g. Report due today 17:00"
              className="min-h-20"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Available from">
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </Field>
            <Field label="Available until" error={issues["endTime"]}>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Fixed commitments">
            <Textarea
              value={form.commitments}
              onChange={(e) => setForm({ ...form, commitments: e.target.value })}
              placeholder="Meetings, breaks, school run…"
              className="min-h-20"
            />
          </Field>

          <Field label="Planning period">
            <Select value={form.period} onValueChange={(v) => setForm({ ...form, period: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Single day", "Two days", "Full week"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              Build My Schedule
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm({ ...EMPTY });
                setResult("");
                setError("");
                setIssues({});
                setIsSample(false);
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {error && <ErrorNote message={error} />}
          {loading && !result && <LoadingCard label="Sequencing your day" />}
          {result && (
            <ResultPanel
              text={result}
              loading={loading}
              actions={["regenerate", "shorter"]}
              onRefine={(action, current) => void run(action, current)}
              onClear={() => setResult("")}
            />
          )}
          {!result && !loading && !error && (
            <div className="surface-card p-6 text-sm text-muted-foreground">
              You will get your Top 3 Priorities, a time-blocked schedule with priorities and
              expected outcomes, optimisation tips and an end-of-day review.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
