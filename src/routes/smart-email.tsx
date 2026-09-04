import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ErrorNote, LoadingCard, ResultPanel, SampleBadge } from "@/components/ResultPanel";
import type { RefineAction } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateContent } from "@/lib/ai.functions";
import { sampleEmail } from "@/lib/sample-data";

export const Route = createFileRoute("/smart-email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Next Level East Academy" },
      {
        name: "description",
        content:
          "Draft clear, professional workplace emails with tone, length and outcome control — without inventing facts.",
      },
      { property: "og:title", content: "Smart Email Generator | Next Level East Academy" },
      {
        property: "og:description",
        content: "Generate professional emails with subject and body, then refine the tone.",
      },
    ],
  }),
  component: SmartEmailPage,
});

const EMPTY = {
  audience: "",
  purpose: "",
  context: "",
  keyPoints: "",
  tone: "Professional",
  length: "Medium",
  outcome: "",
};

function SmartEmailPage() {
  const generate = useServerFn(generateContent);
  const [form, setForm] = useState({ ...EMPTY });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [isSample, setIsSample] = useState(false);

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.audience.trim().length < 3) next["audience"] = "Tell us who this email is for.";
    if (form.purpose.trim().length < 5) next["purpose"] = "Add a short purpose (at least a few words).";
    if (form.keyPoints.trim().length < 5) next["keyPoints"] = "Add at least one key point to include.";
    setIssues(next);
    return Object.keys(next).length === 0;
  };

  const run = async (refine: RefineAction | "none" = "none", previous = "") => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const res = await generate({ data: { kind: "email", payload: form, refine, previous } });
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
        eyebrow="Feature 01"
        title="Smart Email Generator"
        description="Give the assistant the facts and it will shape a professional email. It will never invent names, dates or commitments you did not provide."
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
            <h2 className="text-display text-base font-bold">Email Brief</h2>
            <SampleBadge
              onUse={() => {
                setForm({ ...sampleEmail });
                setIsSample(true);
                setIssues({});
              }}
            />
          </div>
          {isSample && (
            <p className="rounded-md bg-accent/20 px-3 py-2 text-xs font-semibold">
              Sample Data loaded — edit any field before generating.
            </p>
          )}

          <Field label="Audience" error={issues["audience"]}>
            <Input
              value={form.audience}
              onChange={(e) => set("audience")(e.target.value)}
              placeholder="e.g. Line manager, external client"
            />
          </Field>
          <Field label="Purpose" error={issues["purpose"]}>
            <Input
              value={form.purpose}
              onChange={(e) => set("purpose")(e.target.value)}
              placeholder="e.g. Request approval for a project extension"
            />
          </Field>
          <Field label="Context (optional)">
            <Textarea
              value={form.context}
              onChange={(e) => set("context")(e.target.value)}
              placeholder="Background the reader needs"
              className="min-h-24"
            />
          </Field>
          <Field label="Key points to include" error={issues["keyPoints"]}>
            <Textarea
              value={form.keyPoints}
              onChange={(e) => set("keyPoints")(e.target.value)}
              placeholder="One point per line"
              className="min-h-28"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tone">
              <Select value={form.tone} onValueChange={set("tone")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Formal", "Professional", "Friendly", "Informal", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Length">
              <Select value={form.length} onValueChange={set("length")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Detailed"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Desired outcome (optional)">
            <Input
              value={form.outcome}
              onChange={(e) => set("outcome")(e.target.value)}
              placeholder="e.g. A written approval by Friday"
            />
          </Field>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={loading}>
              Generate Email
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
          {loading && !result && <LoadingCard label="Drafting your email" />}
          {result && (
            <ResultPanel
              text={result}
              loading={loading}
              actions={["regenerate", "shorter", "formal", "friendlier"]}
              onRefine={(action, current) => void run(action, current)}
              onClear={() => setResult("")}
            />
          )}
          {!result && !loading && !error && (
            <div className="surface-card p-6 text-sm text-muted-foreground">
              Your generated email will appear here with copy, edit and refine controls.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase tracking-wider">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
