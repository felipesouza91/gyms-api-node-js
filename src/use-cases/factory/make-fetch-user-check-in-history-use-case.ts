import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository'
import { FetchUserCheckInHistoryUseCase } from './../fetch-user-check-in-history'
export function makeFetchUserCheckInHistoryUseCase() {
  const checkInRepository = new PrismaCheckInRepository()
  return new FetchUserCheckInHistoryUseCase(checkInRepository)
}
