import { makeFetchNearbyGymUseCase } from '@/use-cases/factory/make-fetch-nearby-gym-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'

export async function nearbyGymController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const searchQuery = zod.object({
    latitude: zod.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: zod.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const safeData = searchQuery.safeParse(request.query)
  if (!safeData.success) {
    throw safeData.error
  }
  const { latitude, longitude } = safeData.data
  const useCase = makeFetchNearbyGymUseCase()
  const { gyms } = await useCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return replay.status(200).send({ gyms })
}
