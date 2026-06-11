'use client'

import { useQuery } from '@apollo/client/react'
import { GET_NODES } from '@/graphql/queries'

export function useNodes() {
  const { data, loading, error } = useQuery(GET_NODES)
  return { nodes: data?.nodes ?? [], loading, error }
}
