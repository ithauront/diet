import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { dietRoutes } from './routes/dietRoutes'
import { userRoutes } from './routes/userRoutes'

export const app = fastify()

app.register(cookie)

app.register(dietRoutes, {
  prefix: 'diet',
})

app.register(userRoutes, {
  prefix: 'users',
})

app.get('/healthz', async (request, reply) => {
  return reply.status(200).send({ status: 'ok' })
})
