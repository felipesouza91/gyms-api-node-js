import { makeRegisterUseCase } from '@/use-cases/factory/make-register-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import * as zod from 'zod'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
  })

  const safeData = registerBodySchema.safeParse(request.body)
  if (!safeData.success) {
    throw safeData.error
  }
  const {
    data: { email, name, password },
  } = safeData

  try {
    const useCase = makeRegisterUseCase()
    const { user } = await useCase.execute({ email, name, password })
    return replay.status(201).send({
      data: {
        email: user.email,
        id: user.id,
        name: user.name,
        created_at: user.created_at,
      },
    })
  } catch (error: any) {
    if (error instanceof UserAlreadyExistsError) {
      return replay.status(400).send({ data: error.message })
    }
    throw error
  }
}
