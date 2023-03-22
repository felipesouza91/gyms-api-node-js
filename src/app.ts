import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from './env'
import { routes } from './http/routes'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

app.register(fastifyCookie)

app.register(routes)

app.setErrorHandler((error, request, replay) => {
  if (error instanceof ZodError) {
    return replay.status(400).send({
      data: {
        errors: error.errors.map((item) => ({
          field: item.path[0],
          message: item.message,
        })),
      },
    })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }
  return replay.status(500).send({ data: { error: error.message } })
})

export { app }
