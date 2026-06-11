import { ZONE_IDS } from "@/types";

export const typeDefs = `#graphql

  enum ZoneId {
    ${ZONE_IDS.join("\n    ")}
  }

  enum NodeStatus {
    ONLINE
    IDLE
    OFFLINE
  }

  type ComputeNode {
    id: ID!
    name: String!
    status: NodeStatus!
    powerDraw: Float!
    zone: ZoneId!
  }

  type GridZone {
    id: ZoneId!
    name: String!
    carbonIntensity: Float!
    updatedAt: String!
    isEstimated: Boolean!
  }

  type ForecastPoint {
    time: String!
    solarRadiation: Float!
    windSpeed: Float!
    cloudCover: Float!
    temperature: Float!
  }

  type EnergyForecast {
    generatedAt: String!
    points: [ForecastPoint!]!
  }

  type WorkloadRecommendation {
    node: ComputeNode!
    zone: GridZone!
    cost: Float!
    rank: Int!
    reason: String!
  }

  type Query {
    nodes: [ComputeNode!]!
    gridZones: [GridZone!]!
    energyForecast(zone: ZoneId!): EnergyForecast!
    routeWorkload(k: Int! = 3, zones: [ZoneId!]): [WorkloadRecommendation!]!
  }
`;
