'use client'

import { useQuery } from '@apollo/client/react'
import { GET_GRID_ZONES } from '@/graphql/queries'

// Poll every 60s so the dashboard reflects near-live carbon intensity without websockets.
export function useGridZones() {
  const { data, loading, error } = useQuery(GET_GRID_ZONES, {
    pollInterval: 60_000,
  })
  return { zones: data?.gridZones ?? [], loading, error }
}
