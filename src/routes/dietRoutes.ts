import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function dietRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('dietLog').select('*')
    return meals
  })

  app.get('/:id', async (request) => {
    const getDietParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getDietParamsSchema.parse(request.params)

    const singleMeal = await knex('dietLog').where('id', id).first()

    return singleMeal
  })

  app.post('/', async (request, reply) => {
    const creatMealSchema = z.object({
      title: z.string(),
      description: z.string(),
      isPartOfDiet: z.enum(['yes', 'no']),
      dateOfMeal: z.string(), // by what I seen from the front end I think its better to separate date and time, and also not use Date function because it is free for user to put what time he wants and not use the time of posting
      timeOfMeal: z.string(),
    })

    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal } =
      creatMealSchema.parse(request.body)

    await knex('dietLog').insert({
      id: crypto.randomUUID(),
      title,
      description,
      isPartOfDiet,
      dateOfMeal,
      timeOfMeal,
    })
    return reply.status(201).send
  })

  app.put('/:id', async (request, reply) => {
    const getDietParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getDietParamsSchema.parse(request.params)
    const updateSchema = z.object({
      title: z.string(),
      description: z.string(),
      isPartOfDiet: z.enum(['yes', 'no']),
      dateOfMeal: z.string(),
      timeOfMeal: z.string(),
    })
    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal } =
      updateSchema.parse(request.body)

    await knex('dietLog').where('id', id).update({
      title,
      description,
      isPartOfDiet,
      timeOfMeal,
      dateOfMeal,
    })
    return reply.status(201).send
  })
}
