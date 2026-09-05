# Next Level East Academy – AI Workplace Productivity Assistant

**Tagline:** *Work Smarter. Think Better. Perform at Your Next Level.*

A modern, responsive web application that helps workplace teams and individuals boost productivity with AI-powered tools for email writing, meeting summaries, task planning, and prompt improvement — all wrapped in a clean, football-club-inspired design that communicates teamwork, strategy, discipline, and excellence.

## Live Demo

- **Preview URL:** https://id-preview--07e2fc8d-aa86-42b1-8c41-e77d434fa968.lovable.app
- **Published URL:** https://level-up-ai-work.lovable.app

## Features

### 1. Smart Email Generator
Generate professional emails from a brief:
- Audience, purpose, context, key points, tone, length, and desired outcome
- Tones: Formal, Professional, Friendly, Informal, Persuasive
- One-click actions: Copy, Edit, Regenerate, Make Shorter, Make More Formal, Make Friendlier, Clear
- Safety guardrails prevent invented names, dates, facts, or commitments

### 2. Meeting Notes Summarizer
Turn raw meeting notes into structured summaries:
- Objective, key points, decisions, action items, responsible person, deadlines, outstanding issues, next steps
- Missing information is clearly marked as **“Not specified”**
- One-click actions: Copy, Edit, Regenerate, Make Shorter, Clear

### 3. AI Task Planner
Build realistic daily/weekly schedules from your workload:
- Inputs: tasks, deadlines, available start/end time, commitments, planning period
- Tasks prioritized as High, Medium, or Low
- Output includes time-blocked schedule, Top 3 Priorities, time-optimization tips, and end-of-day review
- Refuses to create impossible schedules and explains overflow clearly

### 4. Prompt Coach
Analyze and improve any AI prompt:
- 0–100 prompt quality score
- Six-dimension analysis: Role, Objective, Context, Requirements, Output Format, Constraints
- Strengths, missing information, improved prompt, and rationale
- Side-by-side original vs. improved comparison with copy action

### 5. Responsible AI
An educational section covering:
- AI limitations and hallucinations
- Bias and fairness
- Privacy and data handling
- Fact-checking and verification
- Human oversight and accountability
- Pre-send checklist and an always-visible disclaimer

### Dashboard
A professional home screen with:
- Four feature cards (Smart Email, Meeting Summarizer, Task Planner, Prompt Coach)
- Today’s priorities, completed tasks, upcoming deadlines, and recent activity
- Sample data clearly marked for demonstration

## Design

- **Visual style:** Clean, premium, professional, football-club-inspired
- **Color palette:** Deep navy, emerald pitch green, championship gold, crisp white
- **Typography:** Barlow Condensed headings, Manrope body text
- **UI elements:** Modern cards, subtle pitch/grid textures, clear buttons, responsive spacing
- **Fully responsive:** Desktop, tablet, and mobile

## Tech Stack

- [TanStack Start](https://tanstack.com/start) – full-stack React framework
- [React 19](https://react.dev/) – UI library
- [TypeScript](https://www.typescriptlang.org/) – type-safe development
- [Tailwind CSS v4](https://tailwindcss.com/) – utility-first styling
- [Radix UI](https://www.radix-ui.com/) – accessible UI primitives
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway) – secure AI generation
- [Vite](https://vitejs.dev/) – build tool

## Project Structure

```text
src/
├── components/
│   ├── AppShell.tsx          # Responsive navigation and layout shell
│   └── ResultPanel.tsx       # Shared result display and action panel
├── lib/
│   ├── ai-gateway.server.ts  # Lovable AI gateway configuration
│   ├── ai.functions.ts       # Server functions for AI tools
│   ├── sample-data.ts        # Demo data for all tools and dashboard
│   └── utils.ts              # Utility helpers
├── routes/
│   ├── __root.tsx            # Root layout, fonts, metadata, toasts
│   ├── index.tsx             # Dashboard
│   ├── smart-email.tsx       # Smart Email Generator
│   ├── meeting-summarizer.tsx# Meeting Notes Summarizer
│   ├── task-planner.tsx      # AI Task Planner
│   ├── prompt-coach.tsx      # Prompt Coach
│   └── responsible-ai.tsx    # Responsible AI education page
├── router.tsx                # TanStack Router setup
├── start.ts                  # Start app entry
└── styles.css                # Global styles and design tokens
```

## Getting Started

### Prerequisites

- Node.js (recommended via [nvm](https://github.com/nvm-sh/nvm))
- npm or bun

### Install dependencies

```sh
npm install
# or
bun install
```

### Run the development server

```sh
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:8080`.

### Build for production

```sh
npm run build
# or
bun run build
```

## Environment Variables

The app uses the Lovable AI Gateway for secure, server-side AI generation. No API keys are exposed in the browser. Required environment variables are managed by Lovable Cloud when deployed.

## Learning Goals

This application demonstrates:

1. Introduction to AI in the workplace
2. AI productivity automation
3. Effective prompting techniques
4. Responsible AI usage
5. Innovative AI-powered workplace solutions

## License

This project is built and owned by the creator. All rights reserved.

---

Built with [Lovable](https://lovable.dev).
