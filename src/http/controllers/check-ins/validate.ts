import { makeValidateCheckInUseCase } from '@/use-cases/factory/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'

export async function validateCheckInController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const checkInsParams = zod.object({
    checkInId: zod.string().uuid(),
  })

  const safeData = checkInsParams.safeParse(request.params)

  if (!safeData.success) {
    throw safeData.error
  }
  const useCase = makeValidateCheckInUseCase()
  await useCase.execute({
    checkInId: safeData.data.checkInId,
  })
  return replay.status(204).send()
}
