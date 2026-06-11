"use client";

import { useState } from "react";
import { Menu, RefreshCw } from "lucide-react";
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
  const [canRefresh, setCanRefresh] = useState(true);
  const { nodes, loading: nodesLoading } = useNodes();
  const { zones, loading: zonesLoading, lastUpdatedAt, refetch } = useGridZones();

  async function handleRefresh() {
    if (!canRefresh || zonesLoading) return;
    setCanRefresh(false);
    await refetch();
    setTimeout(() => setCanRefresh(true), 15_000);
  }
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
              <Menu size={18} />
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
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex flex-col items-end gap-0.5">
              {lastUpdatedAt && (
                <span className="text-xs text-foreground/70">
                  Updated {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">zones poll every 60s</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={!canRefresh || zonesLoading}
              title="Refresh zone data"
              className="rounded-md p-1.5 text-muted-foreground transition-colors cursor-pointer
                hover:bg-muted hover:text-foreground
                disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Refresh"
            >
              <RefreshCw
                size={15}
                className={(!canRefresh || zonesLoading) ? 'animate-spin' : ''}
              />
            </button>
          </div>
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
                  <div key={i} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:p-4 animate-pulse">
                    <div className="h-3.5 w-2/3 rounded bg-muted" />
                    <div className="h-7 w-1/2 rounded bg-muted" />
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                      <div className="h-3 w-10 rounded bg-muted" />
                    </div>
                  </div>
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
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 sm:gap-3 rounded-lg border border-border bg-card p-3 sm:p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-14 rounded bg-muted" />
                      <div className="h-5 w-16 rounded-full bg-muted" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 rounded bg-muted" />
                      <div className="h-3 w-12 rounded bg-muted" />
                    </div>
                  </div>
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
            <ForecastChart zone={forecastZone} compareByDefault={activeZoneFilter === null} />
            <RouteWorkloadPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
