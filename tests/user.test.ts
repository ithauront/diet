import { afterAll, beforeAll, test, describe, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

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

  test.skip('update a user', async () => {
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

  test.skip('delete a user', async () => {
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
    expect(deleteUser.body).toEqual({ message: 'Usuário excluído com sucesso' })
  })
})
