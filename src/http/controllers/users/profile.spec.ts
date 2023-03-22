import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import supertest from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/tests/create-and-authenticate-user'
describe('Register Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'felipe',
        email: 'felipedb91@gmail.com',
      }),
    )
  })
})
