import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyInput {
  userLatitude: number
  userLongitude: number
}

export interface GymRepository {
  findManyNearby(data: FindManyNearbyInput): Promise<Gym[]>
  findManyByTitle(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymUncheckedCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
}
