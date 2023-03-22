import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const repository = new PrismaUserRepository()
  return new AuthenticateUseCase(repository)
}
