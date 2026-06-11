import { ApolloServer } from '@apollo/server'
import { typeDefs } from '@/server/schema'
import { resolvers, type Context } from '@/server/resolvers'
import { ElectricityMapsAPI } from '@/server/datasources/ElectricityMapsAPI'
import { OpenMeteoAPI } from '@/server/datasources/OpenMeteoAPI'
import { startSimulation } from '@/server/simulation'

startSimulation()

const server = new ApolloServer<Context>({ typeDefs, resolvers })
const serverStart = server.start()

export async function POST(request: Request) {
  await serverStart

  const body = await request.json()

  const result = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables ?? {},
      operationName: body.operationName ?? undefined,
    },
    {
      contextValue: {
        electricityMaps: new ElectricityMapsAPI(),
        openMeteo: new OpenMeteoAPI(),
      },
    }
  )

  if (result.body.kind === 'single') {
    return Response.json(result.body.singleResult)
  }

  return Response.json({ errors: [{ message: 'Streaming responses are not supported' }] }, { status: 501 })
}

export async function GET() {
  return Response.json({ message: 'GridPulse GraphQL endpoint. Send POST requests.' })
}
