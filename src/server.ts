import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
  })
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })
