import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, Copy } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ErrorNote, LoadingCard, SampleBadge } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { coachPrompt, type CoachResult } from "@/lib/ai.functions";
import { samplePrompt } from "@/lib/sample-data";

export const Route = createFileRoute("/prompt-coach")({
  head: () => ({
    meta: [
      { title: "Prompt Coach | Next Level East Academy" },
      {
        name: "description",
        content:
          "Score your AI prompts out of 100 and get an improved version with role, objective, context, requirements, format and constraints.",
      },
      { property: "og:title", content: "Prompt Coach | Next Level East Academy" },
      {
        property: "og:description",
        content: "Learn effective prompting with a 0-100 score and a rewritten prompt.",
      },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const coach = useServerFn(coachPrompt);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [issue, setIssue] = useState("");
  const [isSample, setIsSample] = useState(false);

  const run = async () => {
    if (prompt.trim().length < 5) {
      setIssue("Enter a prompt of at least a few words to analyse.");
      return;
    }
    setIssue("");
    setLoading(true);
    setError("");
    try {
      setResult(await coach({ data: { prompt } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreTone = (s: number) =>
    s >= 75 ? "text-primary" : s >= 45 ? "text-accent-foreground" : "text-destructive";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Feature 04"
        title="Prompt Coach"
        description="Great output starts with a great prompt. Get a quality score, see what is missing, and learn the structure that consistently performs."
      />

      <div className="space-y-6">
        <section className="surface-card space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-display text-base font-bold">Your Prompt</h2>
            <SampleBadge
              onUse={() => {
                setPrompt(samplePrompt);
                setIsSample(true);
                setIssue("");
              }}
            />
          </div>
          {isSample && (
            <p className="rounded-md bg-accent/20 px-3 py-2 text-xs font-semibold">
              Sample Data loaded — a deliberately weak prompt to analyse.
            </p>
          )}
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste the prompt you would give an AI assistant…"
            className="min-h-32"
          />
          {issue && <p className="text-xs font-medium text-destructive">{issue}</p>}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void run()} disabled={loading}>
              Analyse Prompt
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPrompt("");
                setResult(null);
                setError("");
                setIssue("");
                setIsSample(false);
              }}
            >
              Clear
            </Button>
          </div>
        </section>

        {error && <ErrorNote message={error} />}
        {loading && <LoadingCard label="Scoring your prompt" />}

        {result && !loading && (
          <div className="space-y-6">
            <section className="surface-card p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Prompt Quality Score
                  </p>
                  <p className={`text-display text-5xl font-bold ${scoreTone(result.score)}`}>
                    {result.score}
                    <span className="text-xl text-muted-foreground">/100</span>
                  </p>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">{result.verdict}</p>
              </div>
              <Progress value={result.score} className="mt-4" />
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.dimensions.map((d) => (
                <div key={d.name} className="surface-card p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid size-6 place-items-center rounded-full ${d.present ? "bg-primary text-primary-foreground" : "bg-destructive/15 text-destructive"}`}
                    >
                      {d.present ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wide">{d.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{d.comment}</p>
                </div>
              ))}
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <ListCard title="Strengths" items={result.strengths} tone="primary" />
              <ListCard title="Missing Information" items={result.missing} tone="destructive" />
            </div>

            <section className="surface-card overflow-hidden">
              <div className="border-b bg-secondary/60 px-4 py-3">
                <h3 className="text-display text-base font-bold">Original vs Improved</h3>
              </div>
              <div className="grid gap-4 p-4 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Original
                  </p>
                  <pre className="whitespace-pre-wrap break-words rounded-md bg-muted p-3 font-sans text-sm">
                    {prompt}
                  </pre>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    Improved
                  </p>
                  <pre className="whitespace-pre-wrap break-words rounded-md border border-primary/30 bg-primary/5 p-3 font-sans text-sm">
                    {result.improvedPrompt}
                  </pre>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(result.improvedPrompt);
                        toast.success("Improved prompt copied");
                      } catch {
                        toast.error("Copying is blocked — select the text and copy manually.");
                      }
                    }}
                  >
                    <Copy className="size-4" /> Copy Improved Prompt
                  </Button>
                </div>
              </div>
            </section>

            <ListCard title="Why the Improved Prompt Works" items={result.whyBetter} tone="accent" />
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "primary" | "destructive" | "accent";
}) {
  const dot =
    tone === "primary" ? "bg-primary" : tone === "destructive" ? "bg-destructive" : "bg-accent";
  return (
    <section className="surface-card p-5">
      <h3 className="text-display text-base font-bold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
