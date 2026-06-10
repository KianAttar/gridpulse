import { type ZoneId, type EnergyForecast } from '@/types'

const ZONE_COORDINATES: Record<ZoneId, { lat: number; lon: number }> = {
  CA_BC:       { lat: 49.2827, lon: -123.1207 },
  CA_ON:       { lat: 43.6532, lon: -79.3832  },
  DE:          { lat: 50.1109, lon: 8.6821    },
  US_TEX_ERCO: { lat: 32.4487, lon: -99.7331  },
}

export class OpenMeteoAPI {
  private baseUrl = 'https://api.open-meteo.com/v1'

  async getForecast(zone: ZoneId): Promise<EnergyForecast> {
    const { lat, lon } = ZONE_COORDINATES[zone]

    const params = new URLSearchParams({
      latitude:      String(lat),
      longitude:     String(lon),
      hourly:        'shortwave_radiation,wind_speed_10m',
      forecast_days: '2',
      timezone:      'UTC',
    })

    const res = await fetch(`${this.baseUrl}/forecast?${params}`)
    if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status} for zone ${zone}`)

    const data = await res.json()
    const { time, shortwave_radiation, wind_speed_10m } = data.hourly

    const now = Date.now()
    const points = (time as string[])
      .map((t, i) => ({
        time:           t,
        solarRadiation: shortwave_radiation[i] as number,
        windSpeed:      wind_speed_10m[i] as number,
      }))
      .filter(p => new Date(p.time).getTime() >= now)
      .slice(0, 24)

    return {
      generatedAt: new Date().toISOString(),
      points,
    }
  }
}
