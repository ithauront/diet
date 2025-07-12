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
  app.get('/', {
    schema: {
      summary: 'List all registered users (internal use only)',
      tags: ['Users'],
      security: [{ userIdCookie: [] }], // I ask for userCookie since this is a study project, in a real live project this route would have some sort of admin auth protection
      response: {
        200: {
          description: 'Users list',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userName: { type: 'string' },
              userEmail: { type: 'string', nullable: true },
              userPassword: { type: 'string' },
            },
          },
        },
        500: {
          description: 'Internal error fetching users',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },

    handler: async (request, reply) => {
      try {
        const users = await knex('users').select('*')
        return reply.status(200).send(users)
      } catch (error) {
        console.error('Erro ao buscar usuarios')
        return reply.status(500).send({ error: 'Erro ao buscar usuarios' })
      }
    },
  }) // this request will not be used by the user, its just so the backend can see all the users on our database

  app.post('/', {
    schema: {
      summary: 'Create new user',
      tags: ['Users'],
      body: {
        type: 'object',
        required: ['userName', 'userPassword'],
        properties: {
          userName: { type: 'string' },
          userEmail: {
            type: 'string',
            format: 'email',
          },
          userPassword: { type: 'string', minLength: 8 },
        },
      },
      response: {
        201: {
          description: 'User created',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        400: {
          description: 'Validation error',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        409: {
          description: 'Email already in use',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { userName, userEmail, userPassword } = userSchema.parse(
        request.body,
      )
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
          message: `Usuario criado, por favor salve seu userId: ${id} voce pode precisar dele para se identificar no sistema`,
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
    },
  })

  app.put('/:id', {
    schema: {
      summary: "Update a user's name and password",
      tags: ['Users'],
      security: [{ userIdCookie: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        required: ['userName', 'userPassword'],
        properties: {
          userName: { type: 'string' },
          userPassword: { type: 'string', minLength: 8 },
        },
      },
      response: {
        200: {
          description: 'User updated successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'User not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal error updating user',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
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
    },
  })

  app.delete('/:id', {
    schema: {
      summary: 'Delete a user by ID',
      tags: ['Users'],
      security: [{ userIdCookie: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      response: {
        200: {
          description: 'User deleted',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'User not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal error deleting user',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = idSchema.parse(request.params)
        const user = await knex('users').where('id', id).first()
        if (!user) {
          return reply.status(404).send({ error: 'Usuario não encontrado' })
        }

        await knex('users').where('id', id).delete()
        return reply
          .status(200)
          .send({ message: 'Usuário excluído com sucesso' })
      } catch (error) {
        console.error('Erro ao excluir o usuario')
        return reply.status(500).send({ error: 'Erro ao excluir o usuario' })
      }
    },
  })
}
