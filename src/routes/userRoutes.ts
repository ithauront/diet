import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

export async function userRoutes(app: FastifyInstance) {
  const idSchema = z.object({
    id: z.string().uuid(),
  })
  const userSchema = z.object({
    userName: z.string(),
    userEmail: z.string().email().optional(),
    userPassword: z.string().min(8),
  })
  app.get('/', async (request, reply) => {
    try {
      const users = await knex('users').select('*')
      return reply.status(200).send(users)
    } catch (error) {
      console.error('Erro ao buscar usuarios')
      return reply.status(500).send({ error: 'Erro ao buscar usuarios' })
    }
  }) // this request will not be used by the user, its just so the backend can see all the users on our database

  app.post('/', async (request, reply) => {
    const { userName, userEmail, userPassword } = userSchema.parse(request.body)
    const saltRounds = 5
    const id = crypto.randomUUID()
    try {
      const hashedPassword = await bcrypt.hash(userPassword, saltRounds)

      await knex('users').insert({
        id,
        userName,
        userEmail,
        userPassword: hashedPassword,
      })

      reply.setCookie('userId', id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      }) // when a user is made it will set a cookie so the user will be able to interact with only his entries on dietLog as long as the cookie is active
      // if this cookie is no longer active the user will have to "login" as we can see on the dietRoutes post coments
      return reply.status(201).send({
        message: `Usuario criado, por favor salve seu userId: ${id} voce pode precisar dele para "logar" no sistema`,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'As informações enviadas não correspondem as espectativas',
        })
      } else {
        return reply.status(500).send({ error: 'Erro ao criar usuário' })
      }
    }
  })

  app.put('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)

    const { userName, userPassword } = userSchema.parse(request.body)
    const saltRounds = 5

    try {
      const user = await knex('users').where('id', id).first()
      if (!user) {
        return reply.status(404).send({ error: 'Usuario não encontrado' })
      }

      const hashedPassword = await bcrypt.hash(userPassword, saltRounds)
      await knex('users').where('id', id).update({
        userName,
        userPassword: hashedPassword,
      }) // will not allow to update the userEmail
      return reply
        .status(200)
        .send({ message: 'Atualização concluida com sucesso' })
    } catch (error) {
      console.error('Não foi possivel atualizar usuario')
      return reply
        .status(500)
        .send({ error: 'Erro ao tentar atualizar o usuario' })
    }
  })

  app.delete('/:id', async (request, reply) => {
    try {
      const { id } = idSchema.parse(request.params)
      const user = await knex('users').where('id', id).first()
      if (!user) {
        return reply.status(404).send({ error: 'Usuario não encontrado' })
      }

      await knex('users').where('id', id).delete()
      return reply.status(200).send({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir o usuario')
      return reply.status(500).send({ error: 'Erro ao excluir o usuario' })
    }
  })
}
