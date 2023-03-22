import { CheckInRepository } from '@/repositories/check-in-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsMetrics: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInRepository: CheckInRepository) {}
  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsMetrics = await this.checkInRepository.countByUserId(userId)
    return { checkInsMetrics }
  }
}
