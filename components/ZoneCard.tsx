'use client'

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

interface ZoneCardProps {
  id: string
  name: string
  carbonIntensity: number
  updatedAt: string
  isEstimated: boolean
  isActive: boolean
  onClick: () => void
}

export function ZoneCard({ name, carbonIntensity, isEstimated, isActive, onClick }: ZoneCardProps) {
  const level = getIntensity(carbonIntensity)
  const { value, label, dot } = intensityConfig[level]

  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-1.5 sm:gap-2 rounded-lg border p-3 sm:p-4 text-left transition-all w-full cursor-pointer
        ${isActive
          ? 'border-primary/60 bg-card shadow-[0_0_0_1px_rgba(255,185,116,0.15)]'
          : 'border-border bg-card hover:border-border/80 hover:bg-muted/60'
        }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">{name}</span>
        {isActive && <span className="shrink-0 text-[9px] sm:text-[10px] font-medium text-primary uppercase tracking-wider mt-0.5">active</span>}
      </div>
      <div className={`text-xl sm:text-2xl font-bold font-mono leading-none ${value}`}>
        {carbonIntensity}
        <span className="text-[10px] sm:text-xs font-normal text-muted-foreground ml-1">gCO₂/kWh</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className={value}>{label}</span>
        {isEstimated && <span>· est.</span>}
      </div>
    </button>
  )
}
