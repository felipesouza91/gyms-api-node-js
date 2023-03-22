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

  it('should be able return nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    await supertest(app.server)
      .post('/gyms')
      .send({
        latitude: -22.9010471,
        longitude: -43.2026384,
        title: 'Gym 1',
        phone: '21-12345678',
        description: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)
    await supertest(app.server)
      .post('/gyms')
      .send({
        latitude: -23.9010471,
        longitude: -44.2026384,
        title: 'Gym 12',
        phone: '21-12345678',
        description: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)

    const { statusCode, body } = await supertest(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -22.9010471 })
      .query({ longitude: -43.2026384 })
      .set('Authorization', `Bearer ${token}`)
    expect(statusCode).toEqual(200)
    expect(body.gyms.length).toEqual(1)
    expect(body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Gym 1',
          phone: '21-12345678',
        }),
      ]),
    )
  })
})
