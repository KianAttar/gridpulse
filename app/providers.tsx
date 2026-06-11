'use client'

import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@/graphql/client'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ApolloProvider>
  )
}
