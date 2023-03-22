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

  it('should be able search a  gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    await supertest(app.server)
      .post('/gyms')
      .send({
        latitude: -22.9010471,
        longitude: -43.2026384,
        title: 'JavaScript Gym',
        phone: '21-12345678',
        description: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)
    await supertest(app.server)
      .post('/gyms')
      .send({
        latitude: -23.9010471,
        longitude: -44.2026384,
        title: 'TypeScript Gym',
        phone: '21-12345678',
        description: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)
    await supertest(app.server)
      .post('/gyms')
      .send({
        latitude: -23.9010471,
        longitude: -44.2026384,
        title: 'TypeScript Gym 1',
        phone: '21-12345678',
        description: 'Gym 1',
      })
      .set('Authorization', `Bearer ${token}`)

    const { statusCode, body } = await supertest(app.server)
      .get('/gyms/search')
      .query({ query: 'TypeScript' })
      .set('Authorization', `Bearer ${token}`)

    expect(statusCode).toEqual(200)
    expect(body.gyms.length).toEqual(2)
    expect(body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'TypeScript Gym',
        }),
        expect.objectContaining({
          title: 'TypeScript Gym 1',
        }),
      ]),
    )
  })
})
