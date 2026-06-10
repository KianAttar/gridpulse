import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // Introspects the running dev server — run `pnpm dev` before `pnpm codegen`
  schema: 'http://localhost:3000/api/graphql',

  // Where to look for query/mutation definitions (added in Stage 4)
  documents: ['graphql/**/*.ts', 'hooks/**/*.ts', 'app/**/*.tsx'],

  ignoreNoDocuments: true,

  generates: {
    // TypeScript types + typed graphql() tag function
    './graphql/__generated__/': {
      preset: 'client',
    },
    // Static schema file — lets the IDE work without the server running
    './graphql/__generated__/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
}

export default config
