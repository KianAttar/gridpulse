'use client'

import { useQuery } from '@apollo/client/react'
import { GET_NODES } from '@/graphql/queries'
import type { GetNodesQuery } from '@/graphql/__generated__/graphql'

type Node = GetNodesQuery['nodes'][number]

export function useNodes() {
  const { data, loading, error, refetch } = useQuery(GET_NODES)
  return {
    nodes: (data?.nodes ?? []) as Node[],
    loading: loading && !data,
    error,
    refetch,
  }
}
