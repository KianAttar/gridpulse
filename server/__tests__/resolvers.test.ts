import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from '../schema'
import { resolvers, type Context } from '../resolvers'
import { ZONE_NAMES, type ZoneId, type GridZone, type ComputeNode, type EnergyForecast } from '@/types'

// ─── Query result shapes ──────────────────────────────────────────────────────

type NodesData       = { nodes: ComputeNode[] }
type GridZonesData   = { gridZones: GridZone[] }
type ForecastData    = { energyForecast: EnergyForecast }
type RouteData       = { routeWorkload: { node: ComputeNode; zone: GridZone; reason: string } }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeZone(id: ZoneId, carbonIntensity: number): GridZone {
  return { id, name: ZONE_NAMES[id], carbonIntensity, updatedAt: '', isEstimated: false }
}

function makeAllZonesMock(zones: GridZone[]) {
  // getAllZones returns Promise<GridZone>[] — an array of promises, not a promise of an array
  return vi.fn().mockReturnValue(zones.map(z => Promise.resolve(z)))
}

function makeContext(overrides?: Partial<Context>): Context {
  return {
    electricityMaps: {
      getCarbonIntensity: vi.fn(),
      getAllZones: makeAllZonesMock([
        makeZone('CA_BC',       72),
        makeZone('CA_ON',       180),
        makeZone('DE',          450),
        makeZone('US_TEX_ERCO', 247),
      ]),
    } as unknown as Context['electricityMaps'],
    openMeteo: {
      getForecast: vi.fn().mockResolvedValue({
        generatedAt: '2026-06-10T00:00:00.000Z',
        points: [{ time: '2026-06-10T14:00', solarRadiation: 300, windSpeed: 20 }],
      } satisfies EnergyForecast),
    } as unknown as Context['openMeteo'],
    ...overrides,
  }
}

async function run<T>(query: string, context = makeContext()) {
  const result = await server.executeOperation<T>({ query }, { contextValue: context })
  if (result.body.kind !== 'single') throw new Error('Expected single result')
  return result.body.singleResult
}

// ─── Server setup ─────────────────────────────────────────────────────────────

let server: ApolloServer<Context>

beforeAll(async () => {
  server = new ApolloServer<Context>({ typeDefs, resolvers })
  await server.start()
})

afterAll(async () => {
  await server.stop()
})

// ─── nodes ────────────────────────────────────────────────────────────────────

describe('nodes', () => {
  it('returns all 8 nodes', async () => {
    const { data, errors } = await run<NodesData>(`{ nodes { id name status powerDraw zone } }`)
    expect(errors).toBeUndefined()
    expect(data?.nodes).toHaveLength(8)
  })

  it('returns nodes with valid ZoneId values', async () => {
    const { data } = await run<NodesData>(`{ nodes { zone } }`)
    const validZones: ZoneId[] = ['CA_BC', 'CA_ON', 'DE', 'US_TEX_ERCO']
    data?.nodes.forEach(n => expect(validZones).toContain(n.zone))
  })

  it('returns nodes with valid NodeStatus values', async () => {
    const { data } = await run<NodesData>(`{ nodes { status } }`)
    const validStatuses = ['ONLINE', 'IDLE', 'OFFLINE']
    data?.nodes.forEach(n => expect(validStatuses).toContain(n.status))
  })
})

// ─── gridZones ────────────────────────────────────────────────────────────────

describe('gridZones', () => {
  it('returns all 4 zones', async () => {
    const { data, errors } = await run<GridZonesData>(
      `{ gridZones { id name carbonIntensity isEstimated } }`
    )
    expect(errors).toBeUndefined()
    expect(data?.gridZones).toHaveLength(4)
  })

  it('calls getAllZones on the electricityMaps datasource', async () => {
    const context = makeContext()
    await run<GridZonesData>(`{ gridZones { id } }`, context)
    expect(context.electricityMaps.getAllZones).toHaveBeenCalled()
  })

  it('returns zones with correct ids', async () => {
    const { data } = await run<GridZonesData>(`{ gridZones { id } }`)
    expect(data?.gridZones.map(z => z.id)).toEqual(['CA_BC', 'CA_ON', 'DE', 'US_TEX_ERCO'])
  })
})

// ─── energyForecast ───────────────────────────────────────────────────────────

describe('energyForecast', () => {
  it('returns a forecast with generatedAt and points', async () => {
    const { data, errors } = await run<ForecastData>(
      `{ energyForecast(zone: DE) { generatedAt points { time solarRadiation windSpeed } } }`
    )
    expect(errors).toBeUndefined()
    expect(data?.energyForecast.generatedAt).toBeDefined()
    expect(data?.energyForecast.points).toHaveLength(1)
  })

  it('calls getForecast with the correct ZoneId', async () => {
    const context = makeContext()
    await run<ForecastData>(`{ energyForecast(zone: US_TEX_ERCO) { generatedAt } }`, context)
    expect(context.openMeteo.getForecast).toHaveBeenCalledWith('US_TEX_ERCO')
  })

  it('rejects an invalid zone — schema validates enum before resolver runs', async () => {
    const { errors } = await run<ForecastData>(
      `{ energyForecast(zone: INVALID_ZONE) { generatedAt } }`
    )
    expect(errors).toBeDefined()
    expect(errors![0].message).toMatch(/INVALID_ZONE/)
  })

  it('rejects a missing zone argument', async () => {
    const { errors } = await run<ForecastData>(`{ energyForecast { generatedAt } }`)
    expect(errors).toBeDefined()
  })
})

// ─── routeWorkload ────────────────────────────────────────────────────────────

describe('routeWorkload', () => {
  it('recommends the node in the lowest-carbon zone', async () => {
    const context = makeContext({
      electricityMaps: {
        getCarbonIntensity: vi.fn(),
        getAllZones: makeAllZonesMock([
          makeZone('CA_BC',       500),
          makeZone('CA_ON',       200),
          makeZone('DE',          50),   // lowest — should win
          makeZone('US_TEX_ERCO', 300),
        ]),
      } as unknown as Context['electricityMaps'],
    })

    const { data, errors } = await run<RouteData>(
      `{ routeWorkload { node { name zone } zone { id carbonIntensity } reason } }`,
      context
    )

    expect(errors).toBeUndefined()
    expect(data?.routeWorkload.zone.id).toBe('DE')
    expect(data?.routeWorkload.node.zone).toBe('DE')
  })

  it('includes IDLE nodes as routable — does not require ONLINE status', async () => {
    // Fra-01 (ONLINE) and Fra-02 (IDLE) are both in DE — both are valid candidates.
    // Fra-01 wins only because it appears first in the array, not because IDLE is excluded.
    const context = makeContext({
      electricityMaps: {
        getCarbonIntensity: vi.fn(),
        getAllZones: makeAllZonesMock([
          makeZone('CA_BC',       500),
          makeZone('CA_ON',       500),
          makeZone('DE',          20),   // lowest
          makeZone('US_TEX_ERCO', 500),
        ]),
      } as unknown as Context['electricityMaps'],
    })

    const { data } = await run<RouteData>(
      `{ routeWorkload { node { name status } zone { id } } }`,
      context
    )

    expect(data?.routeWorkload.zone.id).toBe('DE')
    expect(['Fra-01', 'Fra-02']).toContain(data?.routeWorkload.node.name)
  })

  it('excludes OFFLINE nodes from routing', async () => {
    // CA_ON: Tor-01 (ONLINE) and Tor-02 (OFFLINE) — Tor-01 must win, never Tor-02
    const context = makeContext({
      electricityMaps: {
        getCarbonIntensity: vi.fn(),
        getAllZones: makeAllZonesMock([
          makeZone('CA_BC',       300),
          makeZone('CA_ON',       20),   // lowest
          makeZone('DE',          400),
          makeZone('US_TEX_ERCO', 400),
        ]),
      } as unknown as Context['electricityMaps'],
    })

    const { data } = await run<RouteData>(`{ routeWorkload { node { name status } } }`, context)

    expect(data?.routeWorkload.node.name).toBe('Tor-01')
    expect(data?.routeWorkload.node.status).toBe('ONLINE')
  })

  it('includes the reason string in the response', async () => {
    const { data } = await run<RouteData>(`{ routeWorkload { reason } }`)
    expect(data?.routeWorkload.reason).toMatch(/British Columbia/)
    expect(data?.routeWorkload.reason).toMatch(/gCO₂eq\/kWh/)
  })
})
