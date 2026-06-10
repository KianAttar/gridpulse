# GridPulse

A real-time compute & energy intelligence dashboard built to demonstrate energy-aware compute routing — the core pattern behind [CLoD](https://clod.io) (LōD Technologies).

## What it does

GridPulse reads live carbon intensity data across four grid zones (BC, Ontario, Germany, Texas) and routes simulated AI compute workloads to the lowest-carbon available node. It visualizes the next 24h of solar and wind energy availability so operators can plan workload scheduling around renewable peaks.

## Why it exists

LōD Technologies' CLoD platform is currently all REST. This project demonstrates the exact architecture they're building next: a GraphQL layer wrapping external REST APIs, with Apollo Client managing server state and Zustand managing UI state.

## Architecture

```
Open-Meteo REST API    ─┐
                         ├──→  Apollo Server (/api/graphql)  ──→  React frontend
Electricity Maps REST  ─┘
```

- **Apollo Server** lives in a Next.js API route — resolvers call Electricity Maps and Open-Meteo, shape responses to the GraphQL schema
- **Apollo Client** owns all server state on the frontend — queries, polling, cache
- **Zustand** owns only UI state — selected node, active zone filter, sidebar toggle
- **React.memo** on NodeCard — nodes update independently, no cascade re-renders

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + clod.io design tokens |
| Components | shadcn/ui + Radix UI primitives |
| Icons | Lucide React |
| Charts | Recharts |
| UI State | Zustand |
| Server State | Apollo Client |
| GraphQL Server | Apollo Server |
| Data Sources | Electricity Maps API, Open-Meteo API |

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The Electricity Maps key is configured via `.env.local`:

```
ELECTRICITY_MAPS_API_KEY=your_key_here
```

Open-Meteo requires no key.

## Design system

Dark mode only. Design tokens are extracted verbatim from the live clod.io app — same CSS variables, same Geist font, same border radius scale, same component patterns.
