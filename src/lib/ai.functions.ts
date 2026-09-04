import { createServerFn } from "@tanstack/react-start";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.7-flash";

const GUARDRAIL = `You are the Next Level East Academy AI Workplace Productivity Assistant.
Absolute rules:
- NEVER invent names, dates, numbers, facts, commitments or outcomes that were not supplied.
- If information is missing, write "Not specified" instead of guessing.
- Be concise, professional and immediately usable.
- Output clean plain text with clear headings and bullet lists. Do not use markdown asterisks for bold.`;

const GenerateInput = z.object({
  kind: z.enum(["email", "meeting", "planner"]),
  payload: z.record(z.string()),
  refine: z
    .enum(["none", "shorter", "formal", "friendlier", "regenerate"])
    .optional()
    .default("none"),
  previous: z.string().optional().default(""),
});

function buildPrompt(data: z.infer<typeof GenerateInput>) {
  const fields = Object.entries(data.payload)
    .map(([k, v]) => `${k}: ${v?.trim() ? v.trim() : "Not specified"}`)
    .join("\n");

  let task = "";
  if (data.kind === "email") {
    task = `Write a workplace email based ONLY on the details below.
Format exactly:
SUBJECT: <one line>

<email body with greeting, 1-3 short paragraphs or bullets, and a sign-off>
If the sender or recipient name is not specified, use a neutral greeting/sign-off rather than inventing names.`;
  } else if (data.kind === "meeting") {
    task = `Summarise the meeting notes below into this exact structure with these headings:
MEETING OVERVIEW
OBJECTIVE
KEY POINTS
DECISIONS
ACTION ITEMS (one line each: task — responsible person — deadline)
OUTSTANDING ISSUES
NEXT STEPS
Use "Not specified" for anything missing. Do not infer owners or deadlines.`;
  } else {
    task = `Build a realistic, achievable schedule from the details below.
Format with these headings:
TOP 3 PRIORITIES
SCHEDULE (one line each: time range — task — priority (High/Medium/Low) — expected outcome)
TIME OPTIMISATION TIPS
END OF DAY REVIEW (3 short reflection questions)
Never schedule work outside the available start/end time, never overlap blocks, include short breaks, and if the workload does not fit, say clearly which tasks must move and why.`;
  }

  const refineMap: Record<string, string> = {
    none: "",
    regenerate: "Produce a fresh alternative version with different phrasing and structure.",
    shorter: "Rewrite the previous output to be significantly shorter while keeping all facts.",
    formal: "Rewrite the previous output in a more formal, executive tone.",
    friendlier: "Rewrite the previous output in a warmer, friendlier tone.",
  };

  const refine = refineMap[data.refine ?? "none"];
  const prev =
    data.previous && data.refine && data.refine !== "none"
      ? `\n\nPREVIOUS OUTPUT:\n${data.previous}`
      : "";

  return `${task}\n\nDETAILS:\n${fields}${prev}${refine ? `\n\nREVISION INSTRUCTION: ${refine}` : ""}`;
}

function gateway(options?: { structuredOutputs?: boolean }) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");
  return createLovableAiGatewayProvider(key, undefined, options ?? {});
}

function friendlyError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("402")) {
    throw new Error("AI credits are exhausted for this workspace. Please add credits to continue.");
  }
  if (message.includes("429")) {
    throw new Error("The AI service is busy right now. Please wait a moment and try again.");
  }
  if (message.includes("403") || message.includes("401")) {
    throw new Error("AI access is blocked for this workspace. Please check the AI settings.");
  }
  throw new Error("The AI request failed. Please try again.");
}

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const provider = gateway();
      const result = streamText({
        model: provider(MODEL),
        system: GUARDRAIL,
        prompt: buildPrompt(data),
      });
      return { text: (await result.text).trim() };
    } catch (error) {
      friendlyError(error);
    }
  });

const CoachSchema = z.object({
  score: z.number(),
  verdict: z.string(),
  dimensions: z.array(
    z.object({
      name: z.string(),
      present: z.boolean(),
      comment: z.string(),
    }),
  ),
  strengths: z.array(z.string()),
  missing: z.array(z.string()),
  improvedPrompt: z.string(),
  whyBetter: z.array(z.string()),
});

export type CoachResult = z.infer<typeof CoachSchema>;

export const coachPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ prompt: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<CoachResult> => {
    try {
      const provider = gateway({ structuredOutputs: true });
      const result = streamText({
        model: provider(MODEL),
        system: `${GUARDRAIL}\nYou are an expert prompt engineering coach.`,
        output: Output.object({ schema: CoachSchema }),
        prompt: `Analyse this user prompt for quality.
Evaluate exactly these six dimensions in this order: Role, Objective, Context, Requirements, Output Format, Constraints.
Give an overall quality score from 0 to 100, a one sentence verdict, concrete strengths, concrete missing information, a rewritten improved prompt that adds structure without inventing facts (use bracketed placeholders like [your team] for unknown details), and reasons why the improved prompt is better.

USER PROMPT:
"""${data.prompt}"""`,
      });
      const output = (await result.output) as CoachResult;
      return {
        ...output,
        improvedPrompt: output.improvedPrompt.replace(/\\n/g, "\n").trim(),
        score: Math.max(0, Math.min(100, Math.round(output.score))),
      };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("The AI could not analyse that prompt. Please try rephrasing it.");
      }
      friendlyError(error);
    }
  });
