import { makeGetUserMetricsUseCase } from '@/use-cases/factory/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
interface TokenProps {
  sub: string
}
export async function metricsCheckInController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const { sub } = request.user as TokenProps

  const useCase = makeGetUserMetricsUseCase()
  const { checkInsMetrics } = await useCase.execute({ userId: sub })
  return replay.status(200).send({ checkInsMetrics })
}
