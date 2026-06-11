import type { ZoneId, ComputeNode, GridZone } from "@/types";
import { ElectricityMapsAPI } from "./datasources/ElectricityMapsAPI";
import { OpenMeteoAPI } from "./datasources/OpenMeteoAPI";
import { NODES } from "./nodes";

export interface Context {
  electricityMaps: ElectricityMapsAPI;
  openMeteo: OpenMeteoAPI;
}

// Reference max for utilization penalty — nodes above this are penalized proportionally.
const MAX_POWER_W = 600

interface ScoredNode {
  node: ComputeNode
  zone: GridZone
  score: number
}

function scoreNode(node: ComputeNode, zone: GridZone): number {
  const statusPenalty = node.status === 'IDLE' ? 15 : 0
  const utilizationPenalty = (node.powerDraw / MAX_POWER_W) * 30
  return zone.carbonIntensity + statusPenalty + utilizationPenalty
}

function buildReason(node: ComputeNode, zone: GridZone, score: number): string {
  const parts = [`${zone.name} · ${zone.carbonIntensity} gCO₂/kWh`]
  if (node.status === 'IDLE') parts.push('idle node (+15 spin-up)')
  const util = Math.round((node.powerDraw / MAX_POWER_W) * 100)
  if (util > 50) parts.push(`${util}% utilization`)
  parts.push(`score ${Math.round(score * 10) / 10}`)
  return parts.join(' · ')
}

export const resolvers = {
  Query: {
    nodes: () => NODES,

    gridZones: async (_: unknown, __: unknown, context: Context) => {
      return Promise.all(context.electricityMaps.getAllZones());
    },

    // GraphQL validates the ZoneId enum before the resolver runs — safe to cast
    energyForecast: async (
      _: unknown,
      args: { zone: ZoneId },
      context: Context,
    ) => {
      return context.openMeteo.getForecast(args.zone);
    },

    routeWorkload: async (
      _: unknown,
      args: { k: number; zones?: ZoneId[] },
      context: Context,
    ) => {
      const allZones = await Promise.all(context.electricityMaps.getAllZones())
      const zoneMap = new Map(allZones.map(z => [z.id, z]))

      const targetIds = args.zones?.length
        ? args.zones
        : (Array.from(zoneMap.keys()) as ZoneId[])

      const available = NODES.filter(
        n => n.status !== 'OFFLINE' && targetIds.includes(n.zone)
      )

      if (available.length === 0) return []

      const scored: ScoredNode[] = available.map(node => ({
        node,
        zone: zoneMap.get(node.zone)!,
        score: scoreNode(node, zoneMap.get(node.zone)!),
      }))

      scored.sort((a, b) => a.score - b.score)

      return scored.slice(0, args.k).map(({ node, zone, score }, i) => ({
        node,
        zone,
        score: Math.round(score * 10) / 10,
        rank: i + 1,
        reason: buildReason(node, zone, score),
      }))
    },
  },
};
