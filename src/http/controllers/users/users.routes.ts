import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { refreshToken } from './refresh'
import { register } from './register'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refreshToken)
  /** Authenticated */
  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
    },
    profile,
  )
}
