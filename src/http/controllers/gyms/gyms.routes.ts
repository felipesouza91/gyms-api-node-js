import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createGymController } from './create'
import { nearbyGymController } from './nearby'
import { searchGymController } from './search'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.post(
    '/gyms',
    { onRequest: [verifyUserRole('ADMIN')] },
    createGymController,
  )
  app.get('/gyms/search', searchGymController)
  app.get('/gyms/nearby', nearbyGymController)
}
