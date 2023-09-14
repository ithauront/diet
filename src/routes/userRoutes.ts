import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select('*')
    return reply.status(200).send(users)
  }) // this request will not be used by the user, its just so the backend can see all the users on our database
}
