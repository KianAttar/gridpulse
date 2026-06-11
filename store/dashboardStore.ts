import { create } from 'zustand'
import type { ZoneId } from '@/types'

interface DashboardState {
  selectedNodeId: string | null
  activeZoneFilter: ZoneId | null
  sidebarOpen: boolean

  setSelectedNodeId: (id: string | null) => void
  setActiveZoneFilter: (zone: ZoneId | null) => void
  setSidebarOpen: (open: boolean) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedNodeId: null,
  activeZoneFilter: null,
  sidebarOpen: false,

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setActiveZoneFilter: (zone) => set({ activeZoneFilter: zone }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
