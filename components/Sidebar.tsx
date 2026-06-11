'use client'

import { X, Zap } from 'lucide-react'
import { useDashboardStore } from '@/store/dashboardStore'
import { ZONE_IDS, ZONE_NAMES } from '@/types'
import type { ZoneId } from '@/types'

export function Sidebar() {
  const { activeZoneFilter, setActiveZoneFilter, sidebarOpen, setSidebarOpen } = useDashboardStore()

  function toggle(zone: ZoneId) {
    setActiveZoneFilter(activeZoneFilter === zone ? null : zone)
  }

  function closeOnMobile() {
    // only close the overlay on small screens — on lg+ sidebar is always visible
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar
          transition-transform duration-300 ease-in-out
          lg:relative lg:w-56 lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground tracking-tight">GridPulse</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Grid Zones
          </p>

          <button
            onClick={() => { setActiveZoneFilter(null); closeOnMobile() }}
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
              onClick={() => { toggle(id); closeOnMobile() }}
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
    </>
  )
}
