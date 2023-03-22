import { makeFetchUserCheckInHistoryUseCase } from '@/use-cases/factory/make-fetch-user-check-in-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'

interface TokenProps {
  sub: string
}

export async function historyCheckInController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const searchQuery = zod.object({
    page: zod.coerce.number().min(1).default(1),
  })
  const safeData = searchQuery.safeParse(request.query)
  if (!safeData.success) {
    throw safeData.error
  }
  const useCase = makeFetchUserCheckInHistoryUseCase()
  const { sub } = request.user as TokenProps
  const { checkIns } = await useCase.execute({
    userId: sub,
    page: safeData.data.page,
  })
  return replay.status(200).send({ checkIns })
}
