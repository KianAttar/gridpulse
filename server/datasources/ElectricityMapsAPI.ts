import { env } from '@/lib/env'
import { ZONE_IDS, ZONE_NAMES, type ZoneId, type GridZone } from '@/types'

// GraphQL uses underscores (CA_BC), Electricity Maps API uses hyphens (CA-BC)
function toApiCode(zone: ZoneId): string {
  return zone.replace(/_/g, '-')
}

export class ElectricityMapsAPI {
  private baseUrl = 'https://api.electricitymaps.com/v3'
  private apiKey: string

  constructor(apiKey: string = env.ELECTRICITY_MAPS_API_KEY) {
    this.apiKey = apiKey
  }

  async getCarbonIntensity(zone: ZoneId): Promise<GridZone> {
    const res = await fetch(
      `${this.baseUrl}/carbon-intensity/latest?zone=${toApiCode(zone)}`,
      { headers: { 'auth-token': this.apiKey } }
    )

    if (!res.ok) {
      throw new Error(`Electricity Maps API error: ${res.status} for zone ${zone}`)
    }

    const data = await res.json()

    return {
      id: zone,
      name: ZONE_NAMES[zone],
      carbonIntensity: data.carbonIntensity,
      updatedAt: data.updatedAt,
      isEstimated: data.isEstimated,
    }
  }

  getAllZones(): Promise<GridZone>[] {
    return ZONE_IDS.map(id => this.getCarbonIntensity(id))
  }
}
