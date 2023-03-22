import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const repository = new PrismaUserRepository()
  return new RegisterUseCase(repository)
}
