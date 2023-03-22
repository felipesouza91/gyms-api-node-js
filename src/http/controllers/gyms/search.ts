import { makeSearchGymsUseCase } from '@/use-cases/factory/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'

export async function searchGymController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const searchQuery = zod.object({
    query: zod.string(),
    page: zod.coerce.number().min(1).default(1),
  })

  const safeData = searchQuery.safeParse(request.query)
  if (!safeData.success) {
    throw safeData.error
  }
  const useCase = makeSearchGymsUseCase()
  const { gyms } = await useCase.execute(safeData.data)
  return replay.status(200).send({ gyms })
}
