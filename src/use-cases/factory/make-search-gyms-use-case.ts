import { PrismaGymRepository } from './../../repositories/prisma/prisma-gym-repository'
import { SearchGymsUseCase } from './../search-gyms'
export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymRepository()
  return new SearchGymsUseCase(gymRepository)
}
