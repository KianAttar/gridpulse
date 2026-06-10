import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OpenMeteoAPI } from '../OpenMeteoAPI'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function makeTimes(startMs: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    new Date(startMs + i * 60 * 60 * 1000).toISOString().slice(0, 16)
  )
}

function mockOpenMeteoResponse(times: string[]) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      hourly: {
        time:                times,
        shortwave_radiation: times.map((_, i) => i * 10),
        wind_speed_10m:      times.map((_, i) => i * 2),
      },
    }),
  })
}

describe('OpenMeteoAPI', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns a correctly shaped EnergyForecast', async () => {
    const future = Date.now() + 60 * 60 * 1000
    mockOpenMeteoResponse(makeTimes(future, 5))

    const result = await new OpenMeteoAPI().getForecast('DE')

    expect(result).toMatchObject({
      generatedAt: expect.any(String),
      points: expect.arrayContaining([
        expect.objectContaining({
          time:           expect.any(String),
          solarRadiation: expect.any(Number),
          windSpeed:      expect.any(Number),
        }),
      ]),
    })
  })

  it('filters out past timestamps and returns at most 24 points', async () => {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    mockOpenMeteoResponse([
      ...makeTimes(now - 12 * oneHour, 12),  // 12 past hours — should be filtered
      ...makeTimes(now + oneHour, 30),         // 30 future hours — should be capped at 24
    ])

    const result = await new OpenMeteoAPI().getForecast('US_TEX_ERCO')

    expect(result.points.length).toBe(24)
    result.points.forEach(p => {
      expect(new Date(p.time).getTime()).toBeGreaterThan(now - 60_000)
    })
  })

  it('sends the correct coordinates for each zone', async () => {
    const expected: Record<string, { lat: number; lon: number }> = {
      CA_BC:       { lat: 49.2827, lon: -123.1207 },
      CA_ON:       { lat: 43.6532, lon: -79.3832  },
      DE:          { lat: 50.1109, lon: 8.6821    },
      US_TEX_ERCO: { lat: 32.4487, lon: -99.7331  },
    }

    for (const [zone, { lat, lon }] of Object.entries(expected)) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          hourly: { time: [], shortwave_radiation: [], wind_speed_10m: [] },
        }),
      })

      await new OpenMeteoAPI().getForecast(zone as 'CA_BC')

      const calledUrl = new URL(mockFetch.mock.calls.at(-1)![0] as string)
      expect(Number(calledUrl.searchParams.get('latitude'))).toBe(lat)
      expect(Number(calledUrl.searchParams.get('longitude'))).toBe(lon)
    }
  })

  it('throws with a clear message on non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429 })

    await expect(new OpenMeteoAPI().getForecast('CA_ON'))
      .rejects.toThrow('Open-Meteo API error: 429 for zone CA_ON')
  })
})
