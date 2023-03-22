import { FastifyReply, FastifyRequest } from 'fastify'
import * as zod from 'zod'
import { makeAuthenticateUseCase } from '@/use-cases/factory/make-authenticate-use-case copy'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const authenticateSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
  })
  const schemaValidate = authenticateSchema.safeParse(request.body)
  if (!schemaValidate.success) {
    throw schemaValidate.error
  }
  try {
    const { email, password } = schemaValidate.data

    const useCase = makeAuthenticateUseCase()
    const { user } = await useCase.execute({ email, password })
    const token = await replay.jwtSign(
      { name: user.name, role: user.role },
      {
        sign: {
          sub: user.id,
        },
      },
    )
    const refreshToken = await replay.jwtSign(
      { name: user.name, role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )
    return replay
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return replay.status(400).send({ data: error.message })
    }
    throw error
  }
}
