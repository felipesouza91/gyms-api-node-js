import { GymRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface CreateGymUseCaseData {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    latitude,
    longitude,
    title,
    phone,
    description,
  }: CreateGymUseCaseData): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      latitude,
      longitude,
      title,
      phone,
      description,
    })
    return { gym }
  }
}
