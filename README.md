# GridPulse

A real-time compute & energy intelligence dashboard for energy-aware compute routing.

## What it does

GridPulse reads live carbon intensity data across four grid zones (BC, Ontario, Germany, Texas) and routes simulated AI compute workloads to the lowest-carbon available node. It visualizes the next 24h of solar and wind energy availability so operators can plan workload scheduling around renewable peaks.

## Why it exists

Built to explore what a GraphQL layer over external REST APIs looks like in practice — Apollo Client managing server state, Zustand managing UI state.

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
| Styling | Tailwind CSS v4 |
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
cp .env.example .env.local  # then fill in your Electricity Maps API key
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Get a free Electricity Maps API key at https://www.electricitymaps.com/free-tier-api. Open-Meteo requires no key.

### Regenerating GraphQL types

Run this whenever the schema changes (requires the dev server to be running):

```bash
pnpm codegen
```

Generated files live in `graphql/__generated__/` and are committed to the repo. For IDE autocomplete and validation install the **GraphQL: Language Feature Support** extension in VS Code.

## Design system

Dark mode only. Uses Geist font, CSS custom properties for theming, and shadcn/ui component patterns.
