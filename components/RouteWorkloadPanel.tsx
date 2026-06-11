'use client'

import { useRouteWorkload } from '@/hooks/useRouteWorkload'
import { ZONE_NAMES } from '@/types'

export function RouteWorkloadPanel() {
  const { route, recommendation, loading } = useRouteWorkload()

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">Workload Routing</p>
        <p className="text-xs text-muted-foreground">Route to the lowest-carbon available node</p>
      </div>

      <button
        onClick={() => route()}
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? 'Routing…' : 'Route Workload'}
      </button>

      {recommendation && (
        <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{recommendation.node.name}</span>
            <span className="text-[11px] font-medium text-[#98e843]">
              {recommendation.node.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{ZONE_NAMES[recommendation.zone.id]}</span>
            <span className="font-mono">{recommendation.zone.carbonIntensity} gCO₂/kWh</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">
            {recommendation.reason}
          </p>
        </div>
      )}
    </div>
  )
}
