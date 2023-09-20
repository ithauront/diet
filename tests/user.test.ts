import { afterAll, beforeAll, test, describe } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('userRoutes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test.skip('create new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        userName: 'test user',
        userEmail: 'test@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      .expect(201)
  })

  test.skip('list all users', async () => {
    await request(app.server).get('/users').expect(200)
  })
})
