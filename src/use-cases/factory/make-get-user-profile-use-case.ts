import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetUserProfileUseCase } from './../get-user-profile'
export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUserRepository()
  return new GetUserProfileUseCase(userRepository)
}
