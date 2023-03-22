import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const repository = new PrismaGymRepository()
  return new CreateGymUseCase(repository)
}
