import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymUseCase() {
  const gymRepository = new PrismaGymRepository()
  return new FetchNearbyGymsUseCase(gymRepository)
}
