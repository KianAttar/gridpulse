'use client'

import { useState, useMemo } from 'react'
import { useEnergyForecast } from '@/hooks/useEnergyForecast'
import { ZONE_IDS } from '@/types'
import type { ZoneId } from '@/types'
import {
  ResponsiveContainer,
  LineChart,
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

const ZONE_COLOR: Record<ZoneId, string> = {
  CA_BC:       '#4ade80',
  CA_ON:       '#f59e0b',
  DE:          '#f87171',
  US_TEX_ERCO: '#60a5fa',
}

type Metric = 'solar' | 'wind' | 'cloud'

const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: 'solar', label: 'Solar',  unit: 'W/m²' },
  { key: 'wind',  label: 'Wind',   unit: 'm/s'  },
  { key: 'cloud', label: 'Cloud',  unit: '%'    },
]

export function ZoneComparisonChart() {
  const [metric, setMetric] = useState<Metric>('solar')

  const { forecast: bcF  } = useEnergyForecast('CA_BC')
  const { forecast: onF  } = useEnergyForecast('CA_ON')
  const { forecast: deF  } = useEnergyForecast('DE')
  const { forecast: txF  } = useEnergyForecast('US_TEX_ERCO')

  const forecasts: Record<ZoneId, typeof bcF> = useMemo(() => ({
    CA_BC:       bcF,
    CA_ON:       onF,
    DE:          deF,
    US_TEX_ERCO: txF,
  }), [bcF, onF, deF, txF])

  const refF = bcF ?? onF ?? deF ?? txF

  const chartData = useMemo(() => {
    if (!refF) return []
    return refF.points.map((p, i) => {
      const row: Record<string, number | string> = { time: p.time.slice(11, 16) }
      for (const id of ZONE_IDS) {
        const f = forecasts[id]
        const pt = f?.points[i]
        if (!pt) continue
        row[ZONE_SHORT[id]] =
          metric === 'solar' ? Math.round(pt.solarRadiation)
          : metric === 'wind'  ? Math.round(pt.windSpeed * 10) / 10
          :                      Math.round(pt.cloudCover)
      }
      return row
    })
  }, [refF, forecasts, metric])

  const unit = METRICS.find(m => m.key === metric)!.unit

  if (!refF) {
    return <div className="h-56 rounded-lg bg-muted/40 animate-pulse" />
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer
              ${metric === m.key
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#a1a1a1', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fill: '#a1a1a1', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={44}
            unit={` ${unit}`}
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
            formatter={(v: unknown) => [`${v} ${unit}`, undefined]}
          />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, color: '#a1a1a1', paddingTop: 8 }}
          />
          {ZONE_IDS.map(id => (
            <Line
              key={id}
              type="monotone"
              dataKey={ZONE_SHORT[id]}
              stroke={ZONE_COLOR[id]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: ZONE_COLOR[id] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
