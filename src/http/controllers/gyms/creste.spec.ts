import { createAndAuthenticateUser } from '@/util/tests/create-and-authenticate-user'
import { app } from '@/app'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    await app.listen()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym ', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const { body, statusCode } = await supertest(app.server)
      .post('/gyms')
      .send({
        latitude: -22.9010471,
        longitude: -43.2026384,
        title: 'Gym 1',
        phone: '21-12345678',
        description: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)
    expect(statusCode).toEqual(201)
    expect(body.gym.id).toEqual(expect.any(String))
    expect(body.gym).toEqual(
      expect.objectContaining({
        title: 'Gym 1',
        phone: '21-12345678',
      }),
    )
  })
})
