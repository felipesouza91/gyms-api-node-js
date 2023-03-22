import { Gym, Prisma } from '@prisma/client'
import { prismaClient } from '@/lib/prisma'
import {
  FindManyNearbyInput,
  GymRepository,
} from '@/repositories/gym-repository'
export class PrismaGymRepository implements GymRepository {
  async findManyNearby({
    userLatitude: latitude,
    userLongitude: longitude,
  }: FindManyNearbyInput): Promise<Gym[]> {
    const gyms = await prismaClient.$queryRaw<Gym[]>`
      SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) 
          * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) 
          + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    
    `
    return gyms
  }

  async findManyByTitle(query: string, page: number): Promise<Gym[]> {
    const gyms = await prismaClient.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }

  async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const gym = await prismaClient.gym.create({
      data,
    })
    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prismaClient.gym.findUnique({
      where: {
        id,
      },
    })
    return gym
  }
}
