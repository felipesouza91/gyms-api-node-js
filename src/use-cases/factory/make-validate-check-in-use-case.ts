import { ValidateCheckInUseCase } from './../validate-check-in'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository'
export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInRepository()
  return new ValidateCheckInUseCase(checkInRepository)
}
