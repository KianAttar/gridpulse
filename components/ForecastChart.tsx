"use client";

import { useEnergyForecast } from "@/hooks/useEnergyForecast";
import { ZONE_NAMES } from "@/types";
import type { ZoneId } from "@/types";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface ForecastChartProps {
  zone: ZoneId;
}

export function ForecastChart({ zone }: ForecastChartProps) {
  const { forecast, loading } = useEnergyForecast(zone);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground">Energy Forecast</p>
        <p className="text-xs text-muted-foreground">
          {ZONE_NAMES[zone]} · next 24h
        </p>
      </div>

      {loading || !forecast ? (
        <div className="flex h-45 items-center justify-center text-xs text-muted-foreground">
          {loading ? "Loading…" : "No data"}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart
            data={forecast.points.map((p) => ({
              time: p.time.slice(11, 16),
              solar: Math.round(p.solarRadiation),
              wind: Math.round(p.windSpeed * 10) / 10,
            }))}
            margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#a1a1a1", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis
              yAxisId="solar"
              orientation="left"
              tick={{ fill: "#a1a1a1", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
              unit=" W"
            />
            <YAxis
              yAxisId="wind"
              orientation="right"
              tick={{ fill: "#a1a1a1", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
              unit=" m/s"
            />
            <Tooltip
              contentStyle={{
                background: "#171717",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
                color: "#fafafa",
              }}
              labelStyle={{ color: "#a1a1a1", marginBottom: 4 }}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11, color: "#a1a1a1", paddingTop: 8 }}
            />
            <Line
              yAxisId="solar"
              type="monotone"
              dataKey="solar"
              name="Solar (W/m²)"
              stroke="#f99c00"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: "#f99c00" }}
            />
            <Line
              yAxisId="wind"
              type="monotone"
              dataKey="wind"
              name="Wind (m/s)"
              stroke="#1447e6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: "#1447e6" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
