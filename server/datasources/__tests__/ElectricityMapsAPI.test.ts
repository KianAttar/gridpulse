import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ElectricityMapsAPI } from '../ElectricityMapsAPI'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('ElectricityMapsAPI', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('getCarbonIntensity', () => {
    it('returns a correctly shaped GridZone for a valid zone', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          carbonIntensity: 72,
          updatedAt: '2026-06-10T18:00:00.000Z',
          isEstimated: true,
        }),
      })

      const api = new ElectricityMapsAPI('test-key')
      const result = await api.getCarbonIntensity('CA_BC')

      expect(result).toEqual({
        id: 'CA_BC',
        name: 'British Columbia',
        carbonIntensity: 72,
        updatedAt: '2026-06-10T18:00:00.000Z',
        isEstimated: true,
      })
    })

    it('converts ZoneId underscores to hyphens in the API URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carbonIntensity: 450, updatedAt: '', isEstimated: false }),
      })

      await new ElectricityMapsAPI('my-key').getCarbonIntensity('US_TEX_ERCO')

      const calledUrl = mockFetch.mock.calls[0][0] as string
      expect(calledUrl).toContain('zone=US-TEX-ERCO')
    })

    it('sends the correct auth header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carbonIntensity: 100, updatedAt: '', isEstimated: false }),
      })

      await new ElectricityMapsAPI('my-key').getCarbonIntensity('DE')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        { headers: { 'auth-token': 'my-key' } }
      )
    })

    it('throws with a clear message on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })

      await expect(new ElectricityMapsAPI('test-key').getCarbonIntensity('CA_ON'))
        .rejects.toThrow('Electricity Maps API error: 403 for zone CA_ON')
    })

    it('maps every ZoneId to the correct human-readable name', async () => {
      const expected: Record<string, string> = {
        CA_BC:       'British Columbia',
        CA_ON:       'Ontario',
        DE:          'Germany',
        US_TEX_ERCO: 'Texas',
      }

      for (const [id, name] of Object.entries(expected)) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ carbonIntensity: 100, updatedAt: '', isEstimated: false }),
        })
        const result = await new ElectricityMapsAPI('test-key').getCarbonIntensity(id as 'CA_BC')
        expect(result.name).toBe(name)
      }
    })
  })

  describe('getAllZones', () => {
    it('returns one promise per zone (4 total)', () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ carbonIntensity: 100, updatedAt: '', isEstimated: false }),
      })

      const promises = new ElectricityMapsAPI('test-key').getAllZones()

      expect(promises).toHaveLength(4)
      expect(promises.every(p => p instanceof Promise)).toBe(true)
    })

    it('resolves all four zones in order', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ carbonIntensity: 100, updatedAt: '', isEstimated: false }),
      })

      const zones = await Promise.all(new ElectricityMapsAPI('test-key').getAllZones())

      expect(zones.map(z => z.id)).toEqual(['CA_BC', 'CA_ON', 'DE', 'US_TEX_ERCO'])
    })
  })
})
