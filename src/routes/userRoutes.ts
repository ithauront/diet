import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select('*')
    return reply.status(200).send(users)
  }) // this request will not be used by the user, its just so the backend can see all the users on our database

  app.post('/', async (request, reply) => {
    const userSchema = z.object({
      userName: z.string(),
      userEmail: z.string().email(),
      userPassword: z.string().min(8),
    })
    const { userName, userEmail, userPassword } = userSchema.parse(request.body)
    const saltRounds = 5

    try {
      const hashedPassword = await bcrypt.hash(userPassword, saltRounds)

      await knex('users').insert({
        id: crypto.randomUUID(),
        userName,
        userEmail,
        userPassword: hashedPassword,
      })
      return reply.status(201).send({ message: 'usuario criado' })
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'as informações enviadas não correspondem as espectativas',
        })
      } else {
        return reply.status(500).send({ error: 'Erro ao criar usuário' })
      }
    }
  })

  app.delete('/:id', async (request, reply) => {
    const idSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = idSchema.parse(request.params)
    await knex('users').where('id', id).delete()
    return reply.status(204).send({ message: 'usuario deletado' })
  })
}
