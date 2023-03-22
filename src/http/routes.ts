import { FastifyInstance } from 'fastify'
import { checkInsRoutes } from './controllers/check-ins/checkins.routes'
import { gymsRoutes } from './controllers/gyms/gyms.routes'
import { userRoutes } from './controllers/users/users.routes'

export async function routes(app: FastifyInstance) {
  app.register(userRoutes)
  app.register(gymsRoutes)
  app.register(checkInsRoutes)
}
