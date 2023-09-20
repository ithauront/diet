import { afterAll, beforeAll, test, describe, beforeEach, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('dietRoutes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('post routes in diet', () => {
    test.skip('post a meal using cookie for userID', async () => {
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

    test.skip('post a meal without cookie for userId', async () => {
      await request(app.server).post('/users').send({
        userName: 'test user',
        userEmail: 'tefasxasklngfae@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      const listUsers = await request(app.server).get('/users')
      const userId = listUsers.body[0].id
      await request(app.server)
        .post('/diet')
        .send({
          title: 'testMeal',
          description: 'a meal for test',
          isPartOfDiet: 'yes',
          dateOfMeal: '12/12/2020',
          timeOfMeal: '12:25',
          userId,
        })
        .expect(201)
    })
  })
  describe('get routes in diet', () => {
    test.skip('list all the meals', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        userName: 'test user',
        userEmail: 'tefasxasklngfae@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      const cookie = createUserResponse.get('Set-Cookie')

      await request(app.server).post('/diet').set('Cookie', cookie).send({
        title: 'testMeal',
        description: 'a meal for test',
        isPartOfDiet: 'yes',
        dateOfMeal: '12/12/2020',
        timeOfMeal: '12:25',
      })

      const getMealList = await request(app.server)
        .get('/diet')
        .set('Cookie', cookie)
        .expect(200)

      expect(getMealList.body).toEqual([
        expect.objectContaining({
          title: 'testMeal',
          description: 'a meal for test',
          isPartOfDiet: 'yes',
          dateOfMeal: '12/12/2020',
          timeOfMeal: '12:25',
        }),
      ])
    })
    test('list a single meal', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        userName: 'test user',
        userEmail: 'tefasxasklngfae@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      const cookie = createUserResponse.get('Set-Cookie')

      await request(app.server).post('/diet').set('Cookie', cookie).send({
        title: 'testMeal',
        description: 'a meal for test',
        isPartOfDiet: 'yes',
        dateOfMeal: '12/12/2020',
        timeOfMeal: '12:25',
      })

      const getMealResponse = await request(app.server)
        .get('/diet')
        .set('Cookie', cookie)
      const mealId = getMealResponse.body[0].id

      const singleMeal = await request(app.server)
        .get(`/diet/${mealId}`)
        .set('Cookie', cookie)
        .expect(200)

      expect(singleMeal.body).toEqual(
        expect.objectContaining({
          title: 'testMeal',
          description: 'a meal for test',
          isPartOfDiet: 'yes',
          dateOfMeal: '12/12/2020',
          timeOfMeal: '12:25',
        }),
      )
    })
  })
})
