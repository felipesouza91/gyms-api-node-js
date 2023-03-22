import { app } from '@/app'
import { prismaClient } from '@/lib/prisma'
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

  it('should be able validate a Check-in', async () => {
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
    const checkInCreateResponse = await supertest(app.server)
      .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
      .send({
        latitude: -22.901147,
        longitude: -43.202585,
      })
      .set('Authorization', `Bearer ${token}`)
    const response = await supertest(app.server)
      .patch(`/check-ins/${checkInCreateResponse.body.checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toEqual(204)
    const checkIn = await prismaClient.checkIn.findUniqueOrThrow({
      where: {
        id: checkInCreateResponse.body.checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
