import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })
