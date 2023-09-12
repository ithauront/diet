import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const meals = await knex('dietLog').select('*')
  return meals
})

app.post('/hello', async () => {
  const meal = await knex('dietLog').insert({
    id: crypto.randomUUID(),
    title: 'refeição de teste',
    description: 'hamburguer',
    isPartOfDiet: 'no',
  })
  return meal
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
  })
