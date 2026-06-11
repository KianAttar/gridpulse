import { type ZoneId, type EnergyForecast } from '@/types'
import { MemCache } from '@/server/memCache'

const ZONE_COORDINATES: Record<ZoneId, { lat: number; lon: number }> = {
  CA_BC:       { lat: 49.2827, lon: -123.1207 },
  CA_ON:       { lat: 43.6532, lon: -79.3832  },
  DE:          { lat: 50.1109, lon: 8.6821    },
  US_TEX_ERCO: { lat: 32.4487, lon: -99.7331  },
}

// Module-level so it survives across per-request class instantiations
const cache = new MemCache<ZoneId, EnergyForecast>(10 * 60_000)

export class OpenMeteoAPI {
  private baseUrl = 'https://api.open-meteo.com/v1'

  async getForecast(zone: ZoneId): Promise<EnergyForecast> {
    const cached = cache.get(zone)
    if (cached) return cached

    const { lat, lon } = ZONE_COORDINATES[zone]

    const params = new URLSearchParams({
      latitude:      String(lat),
      longitude:     String(lon),
      hourly:        'shortwave_radiation,wind_speed_10m,cloud_cover,temperature_2m',
      forecast_days: '2',
      timezone:      'UTC',
    })

    const res = await fetch(`${this.baseUrl}/forecast?${params}`)
    if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status} for zone ${zone}`)

    const data = await res.json()
    const { time, shortwave_radiation, wind_speed_10m, cloud_cover, temperature_2m } = data.hourly

    const now = Date.now()
    const points = (time as string[])
      .map((t, i) => ({
        time:           t,
        solarRadiation: shortwave_radiation[i] as number,
        windSpeed:      wind_speed_10m[i] as number,
        cloudCover:     cloud_cover[i] as number,
        temperature:    temperature_2m[i] as number,
      }))
      .filter(p => new Date(p.time).getTime() >= now)
      .slice(0, 24)

    const forecast: EnergyForecast = {
      generatedAt: new Date().toISOString(),
      points,
    }
    cache.set(zone, forecast)
    return forecast
  }
}
