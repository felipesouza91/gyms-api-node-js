import { makeCheckInUseCase } from '@/use-cases/factory/make-checkin-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'

interface TokenProps {
  sub: string
}
export async function createCheckInController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const checkInsParams = zod.object({
    gymId: zod.string().uuid(),
  })
  const checkInSchema = zod.object({
    latitude: zod.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: zod.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const safeData = checkInSchema.safeParse(request.body)
  const safeParamsData = checkInsParams.safeParse(request.params)
  if (!safeData.success) {
    throw safeData.error
  }
  if (!safeParamsData.success) {
    throw safeParamsData.error
  }
  const { latitude, longitude } = safeData.data
  const { sub } = request.user as TokenProps
  const useCase = makeCheckInUseCase()
  const { checkIn } = await useCase.execute({
    gymId: safeParamsData.data.gymId,
    userId: sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return replay.status(201).send({ checkIn })
}
