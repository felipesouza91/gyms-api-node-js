import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { createCheckInController } from './create'
import { historyCheckInController } from './history'
import { metricsCheckInController } from './metrics'
import { validateCheckInController } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.post('/gyms/:gymId/check-ins', createCheckInController)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateCheckInController,
  )
  app.get('/check-ins/history', historyCheckInController)
  app.get('/check-ins/metrics', metricsCheckInController)
}
