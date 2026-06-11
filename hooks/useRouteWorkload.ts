'use client'

import { useLazyQuery } from '@apollo/client/react'
import { ROUTE_WORKLOAD } from '@/graphql/queries'
import type { ZoneId } from '@/types'

// Lazy so the caller decides when to trigger routing — not fetched on mount.
export function useRouteWorkload() {
  const [query, { data, loading, error }] = useLazyQuery(ROUTE_WORKLOAD)

  function route(k = 3, zones?: ZoneId[]) {
    query({ variables: { k, zones } })
  }

  return { route, recommendations: data?.routeWorkload ?? [], loading, error }
}
