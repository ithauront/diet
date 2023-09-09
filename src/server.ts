import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'helloWorld'
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })
