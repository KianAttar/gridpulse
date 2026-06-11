'use client'

import { useState, useMemo, useEffect } from 'react'
import { useEnergyForecast } from '@/hooks/useEnergyForecast'
import { ZONE_IDS, ZONE_NAMES } from '@/types'
import type { ZoneId } from '@/types'
import { ZoneComparisonChart } from './ZoneComparisonChart'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

const ZONE_SHORT: Record<ZoneId, string> = {
  CA_BC:       'BC',
  CA_ON:       'ON',
  DE:          'DE',
  US_TEX_ERCO: 'TX',
}

interface ForecastChartProps {
  zone: ZoneId
  compareByDefault?: boolean
}

export function ForecastChart({ zone, compareByDefault = false }: ForecastChartProps) {
  const [selectedZone, setSelectedZone] = useState<ZoneId>(zone)
  const [tab, setTab] = useState<'forecast' | 'compare'>(compareByDefault ? 'compare' : 'forecast')

  // Sync tab and zone when parent switches between all-zones and a specific zone
  useEffect(() => {
    setTab(compareByDefault ? 'compare' : 'forecast')
    if (!compareByDefault) setSelectedZone(zone)
  }, [compareByDefault, zone])

  const { forecast, loading } = useEnergyForecast(selectedZone)

  const stats = useMemo(() => {
    if (!forecast?.points.length) return null
    const pts = forecast.points
    const peak = pts.reduce((m, p) => p.solarRadiation > m.solarRadiation ? p : m, pts[0])
    return {
      peakSolar: Math.round(peak.solarRadiation),
      peakAt:    peak.time.slice(11, 16),
      avgWind:   Math.round(pts.reduce((s, p) => s + p.windSpeed, 0) / pts.length * 10) / 10,
      avgCloud:  Math.round(pts.reduce((s, p) => s + p.cloudCover, 0) / pts.length),
      tempNow:   Math.round(pts[0].temperature),
    }
  }, [forecast])

  const chartData = useMemo(() => {
    if (!forecast) return []
    return forecast.points.map(p => ({
      time:  p.time.slice(11, 16),
      solar: Math.round(p.solarRadiation),
      wind:  Math.round(p.windSpeed * 10) / 10,
    }))
  }, [forecast])

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">Energy Forecast</p>
          <p className="text-xs text-muted-foreground">next 24h</p>
        </div>
        <div className="flex shrink-0 gap-0.5 rounded-md bg-muted p-0.5">
          {(['forecast', 'compare'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap
                ${tab === t
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t === 'forecast' ? 'Single Zone' : 'All Zones'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'forecast' && (
        <>
          {/* Zone selector */}
          <div className="flex items-center gap-1 flex-wrap">
            {ZONE_IDS.map(id => (
              <button
                key={id}
                onClick={() => setSelectedZone(id)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer
                  ${selectedZone === id
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                {ZONE_SHORT[id]}
              </button>
            ))}
            <span className="text-xs text-muted-foreground ml-1">{ZONE_NAMES[selectedZone]}</span>
          </div>

          {/* Summary stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: 'Peak Solar', value: stats.peakSolar, unit: 'W/m²', sub: `at ${stats.peakAt}` },
                { label: 'Avg Wind',   value: stats.avgWind,   unit: 'm/s',   sub: null },
                { label: 'Cloud Cover',value: stats.avgCloud,  unit: '%',     sub: '24h avg' },
                { label: 'Temp Now',   value: stats.tempNow,   unit: '°C',    sub: null },
              ].map(s => (
                <div key={s.label} className="rounded-md bg-muted/40 px-2.5 py-2">
                  <p className="text-[10px] text-muted-foreground leading-none mb-1.5">{s.label}</p>
                  <p className="font-mono text-sm font-semibold text-foreground leading-none">
                    {s.value}
                    <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{s.unit}</span>
                  </p>
                  {s.sub && (
                    <p className="text-[10px] text-muted-foreground mt-1 leading-none">{s.sub}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          {loading || !forecast ? (
            <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
              {loading ? 'Loading…' : 'No data'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <ComposedChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#a1a1a1', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                />
                <YAxis
                  yAxisId="solar"
                  orientation="left"
                  tick={{ fill: '#a1a1a1', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  unit=" W"
                />
                <YAxis
                  yAxisId="wind"
                  orientation="right"
                  tick={{ fill: '#a1a1a1', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  unit=" m/s"
                />
                <Tooltip
                  contentStyle={{
                    background: '#171717',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#fafafa',
                  }}
                  labelStyle={{ color: '#a1a1a1', marginBottom: 4 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 11, color: '#a1a1a1', paddingTop: 8 }}
                />
                <Line
                  yAxisId="solar"
                  type="monotone"
                  dataKey="solar"
                  name="Solar (W/m²)"
                  stroke="#f99c00"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: '#f99c00' }}
                />
                <Line
                  yAxisId="wind"
                  type="monotone"
                  dataKey="wind"
                  name="Wind (m/s)"
                  stroke="#1447e6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: '#1447e6' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </>
      )}

      {tab === 'compare' && <ZoneComparisonChart />}
    </div>
  )
}
