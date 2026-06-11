"use client";

import { useNodes } from "@/hooks/useNodes";
import { useGridZones } from "@/hooks/useGridZones";
import { useDashboardStore } from "@/store/dashboardStore";
import { ZONE_NAMES } from "@/types";
import { ZoneCard } from "@/components/ZoneCard";
import { NodeCard } from "@/components/NodeCard";
import { ForecastChart } from "@/components/ForecastChart";
import { RouteWorkloadPanel } from "@/components/RouteWorkloadPanel";
import { Sidebar } from "@/components/Sidebar";
import { NodeDrawer } from "@/components/NodeDrawer";

export default function Dashboard() {
  const { nodes, loading: nodesLoading } = useNodes();
  const { zones, loading: zonesLoading } = useGridZones();
  const {
    activeZoneFilter,
    setActiveZoneFilter,
    selectedNodeId,
    setSelectedNodeId,
    setSidebarOpen,
  } = useDashboardStore();

  const filteredNodes = activeZoneFilter
    ? nodes.filter((n) => n.zone === activeZoneFilter)
    : nodes;

  const forecastZone = activeZoneFilter ?? "DE";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <NodeDrawer />

      <div className="flex flex-1 flex-col overflow-auto">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger — visible on < lg where sidebar is hidden by default */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <span className="text-sm font-semibold text-foreground">
                Dashboard
              </span>
              {activeZoneFilter && (
                <span className="ml-2 text-sm text-muted-foreground">
                  · {ZONE_NAMES[activeZoneFilter]}
                </span>
              )}
            </div>
          </div>
          <span className="hidden sm:block text-xs text-muted-foreground">
            Zones poll every 60s
          </span>
        </header>

        <main className="flex-1 space-y-6 p-4 sm:p-6">
          {/* Zone cards */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Grid Zones
            </h2>
            {zonesLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg border border-border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {zones.map((zone) => (
                  <ZoneCard
                    key={zone.id}
                    {...zone}
                    isActive={activeZoneFilter === zone.id}
                    onClick={() =>
                      setActiveZoneFilter(
                        activeZoneFilter === zone.id ? null : zone.id,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* Node grid */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Compute Nodes
              {activeZoneFilter && (
                <span className="ml-1 normal-case font-normal">
                  · {ZONE_NAMES[activeZoneFilter]}
                </span>
              )}
            </h2>
            {nodesLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg border border-border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredNodes.map((node) => (
                  <NodeCard
                    key={node.id}
                    {...node}
                    isSelected={selectedNodeId === node.id}
                    onClick={() =>
                      setSelectedNodeId(
                        selectedNodeId === node.id ? null : node.id,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* Forecast + routing */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ForecastChart zone={forecastZone} />
            <RouteWorkloadPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
