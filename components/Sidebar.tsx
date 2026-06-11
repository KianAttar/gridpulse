'use client'

import { useDashboardStore } from '@/store/dashboardStore'
import { ZONE_IDS, ZONE_NAMES } from '@/types'
import type { ZoneId } from '@/types'

export function Sidebar() {
  const { activeZoneFilter, setActiveZoneFilter } = useDashboardStore()

  function toggle(zone: ZoneId) {
    setActiveZoneFilter(activeZoneFilter === zone ? null : zone)
  }

  return (
    <aside className="flex w-56 flex-none flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="text-primary text-lg font-bold leading-none">⚡</span>
        <span className="text-sm font-semibold text-foreground tracking-tight">GridPulse</span>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Grid Zones
        </p>

        <button
          onClick={() => setActiveZoneFilter(null)}
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left cursor-pointer
            ${activeZoneFilter === null
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
        >
          All zones
        </button>

        {ZONE_IDS.map(id => (
          <button
            key={id}
            onClick={() => toggle(id)}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left cursor-pointer
              ${activeZoneFilter === id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
          >
            {ZONE_NAMES[id]}
          </button>
        ))}
      </nav>
    </aside>
  )
}
