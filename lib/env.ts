import { z } from 'zod'

const schema = z.object({
  ELECTRICITY_MAPS_API_KEY: z
    .string()
    .min(1, [
      'ELECTRICITY_MAPS_API_KEY is not set.',
      'Get a free key at https://www.electricitymaps.com/free-tier-api',
      'Then add it to .env.local: ELECTRICITY_MAPS_API_KEY=your_key_here',
    ].join(' ')),
})

const result = schema.safeParse(process.env)

if (!result.success) {
  const tree = z.treeifyError(result.error)
  const message = Object.entries(tree.properties ?? {})
    .map(([key, node]) => `  ${key}: ${node.errors.join(' ')}`)
    .join('\n')

  throw new Error(`\n\nEnvironment variable validation failed:\n${message}\n`)
}

export const env = result.data
