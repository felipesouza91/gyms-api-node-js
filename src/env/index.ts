import 'dotenv/config'
import * as zod from 'zod'

const envSchema = zod.object({
  NODE_ENV: zod
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: zod.coerce.number().default(3333),
  DATABASE_URL: zod.string(),
  APP_SALT: zod.coerce.number().default(6),
  JWT_SECRET: zod.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('Invalid variable environment', _env.error.format())
  throw new Error('Variables is missing')
}

const env = _env.data

export { env }
