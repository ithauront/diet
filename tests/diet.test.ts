import { afterAll, beforeAll, test, describe } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('dietRoutes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('post a meal using cookie for userID', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      userName: 'test user',
      userEmail: 'tefasxasklngfae@test342.com',
      userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
    })
    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/diet')
      .set('Cookie', cookie)
      .send({
        title: 'testMeal',
        description: 'a meal for test',
        isPartOfDiet: 'yes',
        dateOfMeal: '12/12/2020',
        timeOfMeal: '12:25',
      })
      .expect(201)
  })
})
