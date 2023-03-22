import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/tests/create-and-authenticate-user'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-Ins Controller (e2e)', () => {
  beforeAll(async () => {
    await app.listen()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able list metrics', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const gymResponse = await supertest(app.server)
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
      .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
      .send({
        latitude: -22.901147,
        longitude: -43.202585,
      })
      .set('Authorization', `Bearer ${token}`)
    const response = await supertest(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsMetrics).toEqual(1)
  })
})
