import { graphql } from './__generated__/gql'

export const GET_NODES = graphql(`
  query GetNodes {
    nodes {
      id
      name
      status
      powerDraw
      zone
    }
  }
`)

export const GET_GRID_ZONES = graphql(`
  query GetGridZones {
    gridZones {
      id
      name
      carbonIntensity
      updatedAt
      isEstimated
    }
  }
`)

export const GET_ENERGY_FORECAST = graphql(`
  query GetEnergyForecast($zone: ZoneId!) {
    energyForecast(zone: $zone) {
      generatedAt
      points {
        time
        solarRadiation
        windSpeed
      }
    }
  }
`)

export const ROUTE_WORKLOAD = graphql(`
  query RouteWorkload {
    routeWorkload {
      node {
        id
        name
        status
        powerDraw
        zone
      }
      zone {
        id
        name
        carbonIntensity
      }
      reason
    }
  }
`)
