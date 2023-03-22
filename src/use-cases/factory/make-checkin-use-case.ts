import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository'
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository'
import { CheckinUseCase } from '../checkin'

export function makeCheckInUseCase() {
  const checkInreposistory = new PrismaCheckInRepository()
  const gymreposistory = new PrismaGymRepository()
  return new CheckinUseCase(checkInreposistory, gymreposistory)
}
