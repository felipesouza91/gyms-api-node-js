import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import supertest from 'supertest'
import { app } from '@/app'
describe('Register Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await supertest(app.server).post('/users').send({
      name: 'Felipe',
      email: 'felipedb91@gmail.com',
      password: '12345678',
    })
    expect(response.statusCode).toEqual(201)
  })
})
