import type { ZoneId } from "@/types";
import { ElectricityMapsAPI } from "./datasources/ElectricityMapsAPI";
import { OpenMeteoAPI } from "./datasources/OpenMeteoAPI";
import { NODES } from "./nodes";

export interface Context {
  electricityMaps: ElectricityMapsAPI;
  openMeteo: OpenMeteoAPI;
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

    routeWorkload: async (_: unknown, __: unknown, context: Context) => {
      const zones = await Promise.all(context.electricityMaps.getAllZones());
      const availableNodes = NODES.filter((n) => n.status !== "OFFLINE");

      // Time Complexity need to be analyzed.
      const best = availableNodes.reduce(
        (acc, node) => {
          const zone = zones.find((z) => z.id === node.zone)!;
          const accZone = zones.find((z) => z.id === acc.node.zone)!;
          return zone.carbonIntensity < accZone.carbonIntensity
            ? { node, zone }
            : acc;
        },
        {
          node: availableNodes[0],
          zone: zones.find((z) => z.id === availableNodes[0].zone)!,
        },
      );

      return {
        node: best.node,
        zone: best.zone,
        reason: `${best.zone.name} has the lowest carbon intensity among online nodes at ${best.zone.carbonIntensity} gCO₂eq/kWh.`,
      };
    },
  },
};
