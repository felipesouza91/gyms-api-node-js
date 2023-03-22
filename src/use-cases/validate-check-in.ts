import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-in-repository'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
interface ValidateCheckInUseCaseRequest {
  checkInId: string
}
interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    const currentTime = dayjs(new Date())
    const createdAt = dayjs(checkIn.created_at)

    const distanceInMinutesFromCheckInCreated = currentTime.diff(
      createdAt,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreated > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = currentTime.toDate()

    await this.checkInRepository.save(checkIn)

    return { checkIn }
  }
}
