import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { dietRoutes } from './routes/dietRoutes'
import { userRoutes } from './routes/userRoutes'

const app = fastify()

app.register(cookie)

app.register(dietRoutes, {
  prefix: 'diet',
})

app.register(userRoutes, {
  prefix: 'users',
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
  })
