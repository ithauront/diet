import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

export async function swaggerDocs(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Diet API',
        description: 'API for tracking meals, users and dietary summaries.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'https://diet-pilo.onrender.com',
        },
      ],
    },
  })

  app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  })
}
