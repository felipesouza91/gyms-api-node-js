import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query'] : [],
})

export { prismaClient }
