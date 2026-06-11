"use client";

import { memo } from "react";
import { ZONE_NAMES } from "@/types";
import type { ZoneId } from "@/types";

type NodeStatus = "ONLINE" | "IDLE" | "OFFLINE";

const statusConfig: Record<
  NodeStatus,
  { dot: string; badge: string; label: string }
> = {
  ONLINE: {
    dot: "bg-[#98e843]",
    badge: "text-[#98e843] bg-[#98e843]/10",
    label: "Online",
  },
  IDLE: {
    dot: "bg-[#ffb974]",
    badge: "text-[#ffb974] bg-[#ffb974]/10",
    label: "Idle",
  },
  OFFLINE: {
    dot: "bg-muted-foreground/50",
    badge: "text-muted-foreground bg-muted",
    label: "Offline",
  },
};

interface NodeCardProps {
  id: string;
  name: string;
  status: NodeStatus;
  powerDraw: number;
  zone: ZoneId;
  isSelected: boolean;
  onClick: () => void;
}

export const NodeCard = memo(function NodeCard({
  name,
  status,
  powerDraw,
  zone,
  isSelected,
  onClick,
}: NodeCardProps) {
  const { dot, badge, label } = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-3 rounded-lg border p-4 text-left transition-all w-full cursor-pointer
        ${
          isSelected
            ? "border-primary/60 bg-card shadow-[0_0_0_1px_rgba(255,185,116,0.15)]"
            : "border-border bg-card hover:border-border/60 hover:bg-muted/60"
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground whitespace-nowrap">
          {name}
        </span>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground truncate min-w-0">
          {ZONE_NAMES[zone]}
        </span>
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap ml-2 shrink-0">
          {status === "OFFLINE" ? "—" : `${powerDraw} W`}
        </span>
      </div>
    </button>
  );
});
