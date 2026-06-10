import type { IGraphQLConfig } from 'graphql-config'

const config: IGraphQLConfig = {
  // Points at the generated static file so IDE works without the server running.
  // Regenerate with `pnpm codegen` whenever the schema changes.
  schema: './graphql/__generated__/schema.graphql',
  documents: ['graphql/**/*.ts', 'hooks/**/*.ts'],
}

export default config
