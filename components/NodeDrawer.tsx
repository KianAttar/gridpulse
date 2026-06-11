'use client'

import { useNodes } from '@/hooks/useNodes'
import { useGridZones } from '@/hooks/useGridZones'
import { useDashboardStore } from '@/store/dashboardStore'
import { ZONE_NAMES } from '@/types'
import { ForecastChart } from './ForecastChart'

const MAX_POWER_W = 600

type Intensity = 'low' | 'medium' | 'high'

function getIntensity(v: number): Intensity {
  if (v < 100) return 'low'
  if (v < 300) return 'medium'
  return 'high'
}

const intensityConfig: Record<Intensity, { value: string; label: string; dot: string }> = {
  low:    { value: 'text-[#98e843]', label: 'Low',    dot: 'bg-[#98e843]' },
  medium: { value: 'text-[#ffb974]', label: 'Medium', dot: 'bg-[#ffb974]' },
  high:   { value: 'text-[#bf000f]', label: 'High',   dot: 'bg-[#bf000f]' },
}

const statusConfig = {
  ONLINE:  { dot: 'bg-[#98e843]', text: 'text-[#98e843]',         label: 'Online'  },
  IDLE:    { dot: 'bg-[#ffb974]', text: 'text-[#ffb974]',         label: 'Idle'    },
  OFFLINE: { dot: 'bg-muted-foreground/50', text: 'text-muted-foreground', label: 'Offline' },
}

export function NodeDrawer() {
  const { selectedNodeId, setSelectedNodeId } = useDashboardStore()
  const { nodes } = useNodes()
  const { zones } = useGridZones()

  const node = nodes.find(n => n.id === selectedNodeId) ?? null
  const zone = node ? zones.find(z => z.id === node.zone) ?? null : null

  const isOpen = node !== null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSelectedNodeId(null)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-border bg-sidebar
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {node && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border p-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-foreground">{node.name}</h2>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[node.status].dot}`} />
                  <span className={statusConfig[node.status].text}>{statusConfig[node.status].label}</span>
                  <span>·</span>
                  <span>{ZONE_NAMES[node.zone]}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5 overflow-y-auto p-5">

              {/* Power draw */}
              <section>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Power Draw
                </p>
                {node.status === 'OFFLINE' ? (
                  <p className="text-sm text-muted-foreground">Node is offline</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold font-mono text-foreground">{node.powerDraw}</span>
                      <span className="text-xs text-muted-foreground">/ {MAX_POWER_W} W max</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min((node.powerDraw / MAX_POWER_W) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((node.powerDraw / MAX_POWER_W) * 100)}% of reference capacity
                    </p>
                  </div>
                )}
              </section>

              {/* Zone carbon intensity */}
              <section>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Grid Zone
                </p>
                {zone ? (() => {
                  const level = getIntensity(zone.carbonIntensity)
                  const { value, label, dot } = intensityConfig[level]
                  return (
                    <div className="rounded-lg border border-border bg-card p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{zone.name}</span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                          <span className={value}>{label}</span>
                        </div>
                      </div>
                      <div className={`text-xl font-bold font-mono ${value}`}>
                        {zone.carbonIntensity}
                        <span className="text-xs font-normal text-muted-foreground ml-1.5">gCO₂/kWh</span>
                      </div>
                      {zone.isEstimated && (
                        <p className="text-[11px] text-muted-foreground">Estimated value</p>
                      )}
                    </div>
                  )
                })() : (
                  <p className="text-sm text-muted-foreground">Loading zone data…</p>
                )}
              </section>

              {/* Forecast */}
              <section>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Energy Forecast
                </p>
                <ForecastChart zone={node.zone} />
              </section>

            </div>
          </>
        )}
      </aside>
    </>
  )
}
