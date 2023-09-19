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
    userId: z.string().optional(), // optional so we can leave out of the put route and from post route when the cookie came from user post
  })

  app.get('/', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'Não autorizado' })
    }
    const meals = await knex('dietLog').where('userId', userId).select('*')
    return reply.status(200).send(meals)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'Não autorizado' })
    }
    const singleMeal = await knex('dietLog')
      .where('id', id)
      .andWhere('userId', userId)
      .first()

    return reply.status(200).send(singleMeal)
  })

  app.get('/summary', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'Não autorizado' })
    }

    const meals = await knex('dietLog')
      .where('userId', userId)
      .orderBy('dateOfMeal', 'timeOfMeal') // order all user meals by time

    let currentSequence = 0
    let maxSequence = 0

    for (let i = 0; i < meals.length; i++) {
      // start a loop that will continue as long as it is smaller thant the size of the array we have
      const meal = meals[i] //  a const meal for every index of the aray meals

      if (meal.isPartOfDiet === 'yes') {
        currentSequence++ // everytime a element of aray meals (whereby const meal) is yes for isPartOfDiet we will increment the current sequence

        if (currentSequence > maxSequence) {
          maxSequence = currentSequence // everytime the currentSequence is bigger than the maxSequence we will update the maxSequence with the value of currentSequence
        }
      } else {
        currentSequence = 0 // everytime a meal is no for isPartOfDiet we reset the currentSequence to zero
      }
    }

    const mealTotal = meals.length
    const partOfDietYes = meals.filter(
      (meal) => meal.isPartOfDiet === 'yes',
    ).length
    const partOfDietNo = meals.filter(
      (meal) => meal.isPartOfDiet === 'no',
    ).length

    return reply.status(200).send({
      mealTotal: { 'Total de reifeições': mealTotal },
      partOfDietYes: { 'Numero de refeições dentro da dieta': partOfDietYes },
      partOfDietNo: { 'Numero de refeições fora da dieta': partOfDietNo },
      sequenceInDiet: `Maior sequencia dentro da dieta ${maxSequence}`,
    })
  })

  app.post('/', async (request, reply) => {
    // since we dont have learn autentification yet and I think based I'm suposed to create autentification by way of cookies as we learn on the lesson before this challenge I made this logic for "login"
    // when a user is created on the user post route it will give a cookie that will work as autentification
    // if the user still as this cookie on browser when he post a meal it will post to his meals since the dietLog as an userId column
    // if the cookie is no longer active I was faced with the problem of the user losing access of his dietLog
    // the solution that I came up whit was that when I user is created he is given his Iduser that he has to remember
    // now if the cookie is no longer active the user can send his userId in the body of request and he will be able to post a meal on his dietLog
    // also when the user provides his userId a new cookie will be created with his userId, servin the propurse of a new "login"
    // ps: I realize now that I could use the userPassword for user to send in the body of request but I would have problems with security of sending a password on the body of request and also would hae to do migrations to change the foring key on table etc, the userName or email could be the also used but it would be to easy for someone other than the user to guess and have acess of his data

    let userId = request.cookies.userId

    if (!userId) {
      const { userId: bodyUserId } = mealSchema.parse(request.body)
      userId = bodyUserId
    }

    if (!userId) {
      return reply.status(400).send({ error: 'userId não fornecido' })
    }

    const { title, description, isPartOfDiet, timeOfMeal, dateOfMeal } =
      mealSchema.parse(request.body)

    reply.setCookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    }) // here a new cookie is set to autenticate the user
    await knex('dietLog').insert({
      id: crypto.randomUUID(),
      title,
      description,
      isPartOfDiet,
      dateOfMeal,
      timeOfMeal,
      userId,
    })
    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)
    const userId = request.cookies.userId
    if (!userId) {
      return reply.status(401).send({ error: 'Não autorizado' })
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
      return reply.status(401).send({ error: 'Não autorizado' })
    }
    await knex('dietLog').where('id', id).andWhere('userId', userId).delete()
    return reply.status(204).send
  })
}
