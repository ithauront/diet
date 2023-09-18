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
    userId: z.string().optional(), // optional so we can leave out of the put route
  })

  app.get('/', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'unauthorized' })
    }
    const meals = await knex('dietLog').where('userId', userId).select('*')
    return reply.status(200).send(meals)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'unauthorized' })
    }
    const singleMeal = await knex('dietLog')
      .where('id', id)
      .andWhere('userId', userId)
      .first()

    return reply.status(200).send(singleMeal)
  })

  app.post('/', async (request, reply) => {
    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal, userId } =
      mealSchema.parse(request.body)

    if (!userId) {
      return reply.status(400).send({ error: 'userId não fornecido' })
    }

    reply.setCookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    }) // veriicar se a gente não pode passar esse cookie para a criação do usuario, assim não precisariamos mais mandar ele no body request do post
    await knex('dietLog').insert({
      id: crypto.randomUUID(),
      title,
      description,
      isPartOfDiet,
      dateOfMeal,
      timeOfMeal,
      userId, // since I didn't made an autentication logic for this app I will use the userId as a value comming from the request.body, the user will have to put the value on the body of request
    })
    return reply.status(201).send
  })

  app.put('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'unauthorized' })
    }
    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal } =
      mealSchema.parse(request.body)

    await knex('dietLog').where('id', id).andWhere('userId', userId).update({
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
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'unauthorized' })
    }
    await knex('dietLog').where('id', id).andWhere('userId', userId).delete()
    return reply.status(204).send
  })
}
