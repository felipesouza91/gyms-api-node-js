import { FastifyRequest, FastifyReply } from 'fastify'

export async function refreshToken(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })
  const { sub, role, name } = request.user
  const token = await replay.jwtSign(
    { role, name },
    {
      sign: {
        sub,
      },
    },
  )
  const refreshToken = await replay.jwtSign(
    { role, name },
    {
      sign: {
        sub,
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
}
