import fastify from 'fastify'
import { env } from './env'
import { dietRoutes } from './routes/dietRoutes'

const app = fastify()

app.register(dietRoutes, {
  prefix: 'diet',
})

app
  .listen({
    // host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
  })
