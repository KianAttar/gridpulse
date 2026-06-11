'use client'

import { useLazyQuery } from '@apollo/client/react'
import { ROUTE_WORKLOAD } from '@/graphql/queries'

// Lazy so the caller decides when to trigger routing — not fetched on mount.
export function useRouteWorkload() {
  const [route, { data, loading, error }] = useLazyQuery(ROUTE_WORKLOAD)
  return { route, recommendation: data?.routeWorkload ?? null, loading, error }
}
