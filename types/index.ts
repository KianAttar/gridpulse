export const ZONE_IDS = ['CA_BC', 'CA_ON', 'DE', 'US_TEX_ERCO'] as const
export type ZoneId = typeof ZONE_IDS[number]

export const ZONE_NAMES: Record<ZoneId, string> = {
  CA_BC:       'British Columbia',
  CA_ON:       'Ontario',
  DE:          'Germany',
  US_TEX_ERCO: 'Texas',
}

export function isZoneId(zone: string): zone is ZoneId {
  return (ZONE_IDS as readonly string[]).includes(zone)
}

export type NodeStatus = 'ONLINE' | 'IDLE' | 'OFFLINE'

export interface ComputeNode {
  id: string
  name: string
  status: NodeStatus
  powerDraw: number  // watts
  zone: ZoneId
}

export interface GridZone {
  id: ZoneId
  name: string
  carbonIntensity: number  // gCO2eq/kWh
  updatedAt: string
  isEstimated: boolean
}

export interface ForecastPoint {
  time: string
  solarRadiation: number  // W/m²
  windSpeed: number       // m/s
  cloudCover: number      // 0–100 %
  temperature: number     // °C
}

export interface EnergyForecast {
  generatedAt: string
  points: ForecastPoint[]
}

export interface WorkloadRecommendation {
  node: ComputeNode
  zone: GridZone
  reason: string
}
