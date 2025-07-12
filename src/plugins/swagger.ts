import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

export async function swaggerDocs(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Diet API',
        description: `
        API for tracking meals, users and dietary summaries.
         
        How to use this API

        1. Go to POST /users and create a new user.
        ⚠️ **Important:** Use a unique email, different from the default "user@example.com". Otherwise, you'll get a 409 error if the email already exists.
        2. Copy the userId from the response.
        3. Click on Authorize button at the top of the Swagger page.
        4. In the cookie field, paste:

     
        userId=PASTE_YOUR_USER_ID_HERE
      

        5. You can now make authenticated requests such as:
        - GET /meals
        - POST /meals
        - GET /meals/summary

        To test with another user, repeat the process starting from step 1.
        `,
        version: '1.0.0',
      },
      servers: [
        {
          url: 'https://diet-pilo.onrender.com',
        },
      ],
      components: {
        securitySchemes: {
          userIdCookie: {
            type: 'apiKey',
            in: 'cookie',
            name: 'userId',
          },
        },
      },
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
