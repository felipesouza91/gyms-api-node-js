import { randomUUID } from 'crypto'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { FindManyNearbyInput, GymRepository } from '../gym-repository'
import { getDistanceBetweenCoordinates } from '@/util/get-distance-between-coordinates'

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    return {
      description: 'some description',
      id: 'some_id',
      latitude: new Decimal(10000.5),
      longitude: new Decimal(12121.8),
      phone: '21 21212121',
      title: 'some Gym',
    }
  }

  async create({
    id,
    latitude,
    longitude,
    title,
    description,
    phone,
  }: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const gym = {
      id: id ?? randomUUID(),
      latitude: new Decimal(latitude.toString()),
      longitude: new Decimal(longitude.toString()),
      title,
      description: description ?? null,
      phone: phone ?? null,
    }
    this.items.push(gym)
    return gym
  }

  async findManyByTitle(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({
    userLatitude,
    userLongitude,
  }: FindManyNearbyInput): Promise<Gym[]> {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: userLatitude,
          longitude: userLongitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }
}
