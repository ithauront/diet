import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function dietRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('dietLog').select('*')
    return meals
  })

  app.post('/', async (request, reply) => {
    const creatMealSchema = z.object({
      title: z.string(),
      description: z.string(),
      isPartOfDiet: z.enum(['yes', 'no']),
    })

    const { title, description, isPartOfDiet } = creatMealSchema.parse(
      request.body,
    )

    await knex('dietLog').insert({
      id: crypto.randomUUID(),
      title,
      description,
      isPartOfDiet,
    })
    return reply.status(201).send
  })
}
