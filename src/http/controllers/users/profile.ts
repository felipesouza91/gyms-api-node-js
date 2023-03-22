import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factory/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, replay: FastifyReply) {
  try {
    const useCase = makeGetUserProfileUseCase()
    const {
      user: { email, id, name, created_at },
    } = await useCase.execute({ userId: request.user.sub })
    return replay.status(200).send({ id, email, name, created_at })
  } catch (error: any) {
    console.log(error)
    if (error instanceof UserAlreadyExistsError) {
      return replay.status(400).send({ data: error.message })
    }

    throw error
  }
}
