import { afterAll, beforeAll, test, describe, expect, beforeEach } from 'vitest'
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

    test('post a meal without cookie for userId', async () => {
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
    test('list all the meals', async () => {
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
    test('list summary from user', async () => {
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
      const summary = await request(app.server)
        .get('/diet/summary')
        .set('Cookie', cookie)
        .expect(200)

      expect(summary.body).toEqual(
        expect.objectContaining({
          mealTotal: { 'Total de reifeições': 1 },
          partOfDietYes: { 'Numero de refeições dentro da dieta': 1 },
          partOfDietNo: { 'Numero de refeições fora da dieta': 0 },
          sequenceInDiet: `Maior sequencia dentro da dieta 1`,
        }),
      )
    })
  })
  describe('put routes in diet', () => {
    test('update a meal', async () => {
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

      await request(app.server)
        .put(`/diet/${mealId}`)
        .set('Cookie', cookie)
        .send({
          title: 'testMealUpdate',
          description: 'update for test',
          isPartOfDiet: 'no',
          dateOfMeal: '14/12/2020',
          timeOfMeal: '14:25',
        })
        .expect(200)
    })
  })
  describe('delete delete routes in diet', () => {
    test('delete a meal', async () => {
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

      await request(app.server)
        .delete(`/diet/${mealId}`)
        .set('Cookie', cookie)
        .expect(204)
    })
  })

  describe('userRoutes', () => {
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

    test('create new user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          userName: 'test user',
          userEmail: 'test@test342.com',
          userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
        })
        .expect(201)
    })

    test('list all users', async () => {
      await request(app.server).post('/users').send({
        userName: 'new user',
        userEmail: 'newUser@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      const listUsers = await request(app.server).get('/users').expect(200)

      expect(listUsers.body).toEqual([
        expect.objectContaining({
          userName: 'new user',
          userEmail: 'newUser@test342.com',
        }),
      ])
    })

    test('update a user', async () => {
      await request(app.server).post('/users').send({
        userName: 'new user',
        userEmail: 'newUser@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      const listUsers = await request(app.server).get('/users')
      const userId = listUsers.body[0].id

      const updateUser = await request(app.server)
        .put(`/users/${userId}`)
        .send({
          userName: 'updated user',
          userPassword: 'updatedPassword',
        })
        .expect(200)

      expect(updateUser.body).toEqual({
        message: 'Atualização concluida com sucesso',
      })
    })

    test('delete a user', async () => {
      await request(app.server).post('/users').send({
        userName: 'new user',
        userEmail: 'newUser@test342.com',
        userPassword: 'testasjenshasf', // its important to remember the schemes for validation of email and passoword to avoid problems in the tests
      })
      const listUsers = await request(app.server).get('/users')
      const userId = listUsers.body[0].id

      const deleteUser = await request(app.server)
        .delete(`/users/${userId}`)
        .expect(200)
      expect(deleteUser.body).toEqual({
        message: 'Usuário excluído com sucesso',
      })
    })
  })
})
