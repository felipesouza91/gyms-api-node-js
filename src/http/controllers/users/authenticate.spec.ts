import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import supertest from 'supertest'
import { app } from '@/app'
describe('Authenticate Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able authentication', async () => {
    await supertest(app.server).post('/users').send({
      name: 'Felipe',
      email: 'felipedb91@gmail.com',
      password: '12345678',
    })
    const response = await supertest(app.server)
      .post('/sessions')
      .send({ email: 'felipedb91@gmail.com', password: '12345678' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.token).toEqual(expect.any(String))
  })
})
