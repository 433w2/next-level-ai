import { useEffect, useState } from "react";
import { Copy, Check, Pencil, RefreshCw, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export type RefineAction = "regenerate" | "shorter" | "formal" | "friendlier";

export function ResultPanel({
  text,
  loading,
  actions,
  onRefine,
  onClear,
}: {
  text: string;
  loading: boolean;
  actions: RefineAction[];
  onRefine: (action: RefineAction, current: string) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState(text);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(text);
    setEditing(false);
  }, [text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copying is blocked in this browser. Select the text and copy manually.");
    }
  };

  const labels: Record<RefineAction, string> = {
    regenerate: "Regenerate",
    shorter: "Make Shorter",
    formal: "Make More Formal",
    friendlier: "Make Friendlier",
  };

  return (
    <section className="surface-card overflow-hidden" aria-live="polite">
      <div className="flex items-center justify-between gap-3 border-b bg-secondary/60 px-4 py-3">
        <h2 className="text-display text-base font-bold">Generated Result</h2>
        {loading && (
          <span className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Loader2 className="size-4 animate-spin" /> AI is working…
          </span>
        )}
      </div>

      <div className="p-4">
        {editing ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[320px] font-sans text-sm"
          />
        ) : (
          <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
            {draft}
          </pre>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t bg-muted/40 px-4 py-3">
        <Button size="sm" onClick={copy} disabled={loading}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copy
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
          {editing ? <Save className="size-4" /> : <Pencil className="size-4" />}
          {editing ? "Done Editing" : "Edit"}
        </Button>
        {actions.map((a) => (
          <Button
            key={a}
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => onRefine(a, draft)}
          >
            {a === "regenerate" && <RefreshCw className="size-4" />}
            {labels[a]}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={onClear} disabled={loading}>
          Clear
        </Button>
      </div>
    </section>
  );
}

export function LoadingCard({ label }: { label: string }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <Loader2 className="size-7 animate-spin text-primary" />
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">Structuring a clear, factual response…</p>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}

export function SampleBadge({ onUse }: { onUse: () => void }) {
  return (
    <button
      type="button"
      onClick={onUse}
      className="rounded-full border border-accent bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/40"
    >
      Load Sample Data
    </button>
  );
}
