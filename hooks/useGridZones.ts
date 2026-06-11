'use client'

import { useState, useEffect } from 'react'
import { NetworkStatus } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { GET_GRID_ZONES } from '@/graphql/queries'
import type { GetGridZonesQuery } from '@/graphql/__generated__/graphql'

// Apollo 4 unions DataState variants (complete/partial/streaming/empty), which makes
// all fields optional in TypeScript. Cast to the complete type since we don't use
// returnPartialData or deferred queries.
type Zone = GetGridZonesQuery['gridZones'][number]

export function useGridZones() {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)

  const { data, loading, error, refetch, networkStatus } = useQuery(GET_GRID_ZONES, {
    pollInterval: 60_000,
    notifyOnNetworkStatusChange: true,
  })

  // Update timestamp on initial load and every successful poll (NetworkStatus.ready = 7)
  useEffect(() => {
    if (networkStatus === NetworkStatus.ready) {
      setLastUpdatedAt(new Date())
    }
  }, [networkStatus])

  return {
    zones: (data?.gridZones ?? []) as Zone[],
    loading: loading && !data,
    lastUpdatedAt,
    refetch,
    error,
  }
}
