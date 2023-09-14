import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function dietRoutes(app: FastifyInstance) {
  const idSchema = z.object({
    id: z.string().uuid(),
  })

  const mealSchema = z.object({
    title: z.string(),
    description: z.string(),
    isPartOfDiet: z.enum(['yes', 'no']),
    dateOfMeal: z.string(), // by what I seen from the front end I think its better to separate date and time, and also not use Date function because it is free for user to put what time he wants and not use the time of posting
    timeOfMeal: z.string(),
  })

  app.get('/', async (request, reply) => {
    const meals = await knex('dietLog').select('*')
    return reply.status(200).send(meals)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)

    const singleMeal = await knex('dietLog').where('id', id).first()

    return reply.status(200).send(singleMeal)
  })

  app.post('/', async (request, reply) => {
    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal } =
      mealSchema.parse(request.body)

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
    const { id } = idSchema.parse(request.params)

    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal } =
      mealSchema.parse(request.body)

    await knex('dietLog').where('id', id).update({
      title,
      description,
      isPartOfDiet,
      timeOfMeal,
      dateOfMeal,
    })
    return reply.status(200).send
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)
    await knex('dietLog').where('id', id).delete()
    return reply.status(204).send
  })
}
