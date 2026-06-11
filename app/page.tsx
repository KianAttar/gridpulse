'use client'

import { useNodes } from '@/hooks/useNodes'
import { useGridZones } from '@/hooks/useGridZones'
import { useEnergyForecast } from '@/hooks/useEnergyForecast'
import { useRouteWorkload } from '@/hooks/useRouteWorkload'
import { useEffect } from 'react'

function DataProbe() {
  const { nodes, loading: nodesLoading } = useNodes()
  const { zones, loading: zonesLoading } = useGridZones()
  const { forecast, loading: forecastLoading } = useEnergyForecast('DE')
  const { route, recommendation, loading: routeLoading } = useRouteWorkload()

  useEffect(() => {
    if (!nodesLoading) console.log('[GridPulse] nodes:', nodes)
  }, [nodes, nodesLoading])

  useEffect(() => {
    if (!zonesLoading) console.log('[GridPulse] zones:', zones)
  }, [zones, zonesLoading])

  useEffect(() => {
    if (!forecastLoading) console.log('[GridPulse] forecast (DE):', forecast)
  }, [forecast, forecastLoading])

  useEffect(() => {
    if (!routeLoading && recommendation) console.log('[GridPulse] recommendation:', recommendation)
  }, [recommendation, routeLoading])

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="space-y-4 p-8 text-sm font-mono text-foreground/60">
        <p className="text-foreground text-xl font-semibold">GridPulse</p>
        <p>nodes: {nodesLoading ? 'loading…' : nodes.length}</p>
        <p>zones: {zonesLoading ? 'loading…' : zones.length}</p>
        <p>forecast points (DE): {forecastLoading ? 'loading…' : (forecast?.points.length ?? 'null')}</p>
        <button
          className="mt-4 rounded-md border border-foreground/20 px-4 py-2 text-foreground hover:border-foreground/60 transition-colors"
          onClick={() => route()}
        >
          Route workload
        </button>
        {recommendation && (
          <p className="max-w-sm text-foreground/80">{recommendation.reason}</p>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return <DataProbe />
}
