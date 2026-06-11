'use client'

import { useRouteWorkload } from '@/hooks/useRouteWorkload'
import { ZONE_NAMES } from '@/types'

const rankLabel: Record<number, { label: string; color: string }> = {
  1: { label: '1st', color: 'text-[#98e843]' },
  2: { label: '2nd', color: 'text-[#ffb974]' },
  3: { label: '3rd', color: 'text-muted-foreground' },
}

export function RouteWorkloadPanel() {
  const { route, recommendations, loading } = useRouteWorkload()

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">Workload Routing</p>
        <p className="text-xs text-muted-foreground">Top 3 lowest-carbon available nodes</p>
      </div>

      <button
        onClick={() => route(3)}
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? 'Routing…' : 'Route Workload'}
      </button>

      {recommendations.length > 0 && (
        <div className="flex flex-col gap-2">
          {recommendations.map(rec => {
            const { label, color } = rankLabel[rec.rank] ?? { label: `#${rec.rank}`, color: 'text-muted-foreground' }
            return (
              <div key={rec.node.id} className="rounded-md border border-border bg-muted/40 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-mono w-6 ${color}`}>{label}</span>
                    <span className="text-sm font-medium text-foreground">{rec.node.name}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    score {rec.score}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pl-8">
                  <span>{ZONE_NAMES[rec.zone.id]}</span>
                  <span className="font-mono">{rec.zone.carbonIntensity} gCO₂/kWh</span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-8 leading-relaxed border-t border-border pt-1.5">
                  {rec.reason}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
