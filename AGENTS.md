<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# GridPulse — Agent Context

## Who I'm working with

Kian Attar — full-stack engineer (React/TypeScript/Node.js). He wants to understand what we're building at every step, not just have code generated for him. He learns by doing. Explain decisions when making them. Don't build ahead of where we are.

## What we're building

**GridPulse** — a real-time compute & energy intelligence dashboard. It demonstrates the GraphQL-over-REST architecture that LōD Technologies (clod.io) needs to build next. This is a portfolio/interview project.

See `BUSINESS_DOMAIN.md` for the domain explanation (carbon intensity, energy-aware routing, what the APIs actually mean).
See `PLAN.md` for the 7-stage build plan.

## Current state

- Stage 1 (Scaffold) is complete: Next.js 16, Tailwind v4, all deps installed, clod.io design tokens applied, dark mode locked, git initialized.
- Stage 2 is next: GraphQL schema + TypeScript types.

## Architecture rules — never violate these

- **Apollo cache** = server state (nodes, grid zones, forecasts). Never put API data in Zustand.
- **Zustand** = UI state only (selected node, active zone filter, sidebar open/closed).
- **Apollo Server** lives at `/api/graphql` (Next.js API route) — no separate server process.
- **React.memo** on NodeCard — nodes update independently in real-time.

## Tech stack

- Next.js 16, App Router, Turbopack
- TypeScript strict mode
- Tailwind CSS v4 with exact clod.io design tokens (see `app/globals.css`)
- shadcn/ui + Radix UI primitives
- Lucide React icons
- Recharts for all charts
- Zustand for UI state
- Apollo Client + Apollo Server for GraphQL
- pnpm as the package manager

## Design system

All design tokens are extracted from the live clod.io app and live in `app/globals.css`. Dark mode only (`class="dark"` on `<html>`). Geist font (sans + mono). Brand: amber/orange primary (`#ffb974`), secondary orange (`#fa9816`). Don't invent new colors — use the CSS variables.

## How Kian wants to work

- Build one stage at a time. Don't jump ahead.
- Don't create files or folders until they have real content to put in them.
- Explain what you're doing and why at key decision points.
- When making architectural decisions, state the tradeoff briefly.
- Keep commits clean and scoped to what was actually done.
- Use the browser (via claude-in-chrome tools) to verify UI changes before reporting them done.

## Data sources

- **Electricity Maps** — carbon intensity per zone. Sandbox key is configured. Zone codes: `CA-BC`, `CA-ON`, `DE`, `US-TEX-ERCO`.
- **Open-Meteo** — solar radiation (`shortwave_radiation`) + wind speed (`windspeed_10m`) for 24h forecast. No key needed.

## Key interview talking points (don't lose sight of these)

1. "CLoD is currently all REST. GridPulse demonstrates the GraphQL layer they're building next — resolvers wrap the REST calls, Apollo cache owns the client state."
2. "Apollo cache = server state. Zustand = UI state. They're not interchangeable."
3. "React.memo on NodeCard because nodes update independently — prevents cascade re-renders."
4. "The GraphQL schema is the contract. Frontend describes what it needs; resolvers handle the REST plumbing."
5. "SOLID is visible in the folder structure before you open a single file."
