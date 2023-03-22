import { env } from '@/env'
import { prismaClient } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const passwordHash = await hash('12345678', env.APP_SALT)
  const user = await prismaClient.user.create({
    data: {
      name: 'felipe',
      email: 'felipedb91@gmail.com',
      password_hash: passwordHash,
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })
  const {
    body: { token },
  } = await supertest(app.server)
    .post('/sessions')
    .send({ email: 'felipedb91@gmail.com', password: '12345678' })

  return { token, user }
}
