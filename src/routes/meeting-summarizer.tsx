import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ErrorNote, LoadingCard, ResultPanel, SampleBadge } from "@/components/ResultPanel";
import type { RefineAction } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "./smart-email";
import { generateContent } from "@/lib/ai.functions";
import { sampleMeeting } from "@/lib/sample-data";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Next Level East Academy" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into objectives, decisions, action items, owners and deadlines in seconds.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Next Level East Academy" },
      {
        property: "og:description",
        content: "Structured meeting summaries with owners, deadlines and next steps.",
      },
    ],
  }),
  component: MeetingPage,
});

const EMPTY = { meetingName: "", date: "", participants: "", notes: "" };

function MeetingPage() {
  const generate = useServerFn(generateContent);
  const [form, setForm] = useState({ ...EMPTY });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [isSample, setIsSample] = useState(false);

  const run = async (refine: RefineAction | "none" = "none", previous = "") => {
    const next: Record<string, string> = {};
    if (form.notes.trim().length < 30)
      next["notes"] = "Paste at least a few lines of meeting notes to summarise.";
    setIssues(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setError("");
    try {
      const res = await generate({ data: { kind: "meeting", payload: form, refine, previous } });
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
        eyebrow="Feature 02"
        title="Meeting Notes Summarizer"
        description="Paste messy notes and get a structured record. Anything not stated in your notes is marked “Not specified” — nothing is assumed."
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
            <h2 className="text-display text-base font-bold">Meeting Details</h2>
            <SampleBadge
              onUse={() => {
                setForm({ ...sampleMeeting });
                setIsSample(true);
                setIssues({});
              }}
            />
          </div>
          {isSample && (
            <p className="rounded-md bg-accent/20 px-3 py-2 text-xs font-semibold">
              Sample Data loaded — edit any field before summarising.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meeting name">
              <Input
                value={form.meetingName}
                onChange={(e) => setForm({ ...form, meetingName: e.target.value })}
                placeholder="e.g. Quarterly Programme Review"
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Participants">
            <Input
              value={form.participants}
              onChange={(e) => setForm({ ...form, participants: e.target.value })}
              placeholder="Comma separated names and roles"
            />
          </Field>

          <Field label="Meeting notes" error={issues["notes"]}>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Paste raw notes, bullet points or a transcript"
              className="min-h-64"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              Summarize Notes
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
          {loading && !result && <LoadingCard label="Structuring your meeting summary" />}
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
              Your summary will include objective, key points, decisions, action items, owners,
              deadlines, outstanding issues and next steps.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
