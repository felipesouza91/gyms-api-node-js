import { ResourceNotFoundError } from './../../../use-cases/errors/resource-not-found-error'
import { makeCreateGymUseCase } from '@/use-cases/factory/make-create-gym-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'

export async function createGymController(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const gymSchema = zod.object({
    latitude: zod.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: zod.coerce.number().refine((value) => Math.abs(value) <= 180),
    title: zod.string(),
    phone: zod.string(),
    description: zod.string(),
  })
  const safeData = gymSchema.safeParse(request.body)
  if (!safeData.success) {
    throw safeData.error
  }

  try {
    const useCase = makeCreateGymUseCase()
    const { gym } = await useCase.execute(safeData.data)
    return replay.status(201).send({ gym })
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return replay.status(400).send({ data: error.message })
    }
    throw error
  }
}
