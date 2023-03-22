import { MaxDistanceError } from './errors/max-distance-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { CheckinUseCase } from './checkin'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { MaxNumberOfCheckinError } from './errors/max-number-of-check-in-error'
import { getDistanceBetweenCoordinates } from '@/util/get-distance-between-coordinates'

vi.mock('@/util/get-distance-between-coordinates', () => ({
  getDistanceBetweenCoordinates: vi.fn(),
}))
const makeSut = () => {
  const checkInRepository = new InMemoryCheckinRepository()
  const gymRepository = new InMemoryGymRepository()
  const sut = new CheckinUseCase(checkInRepository, gymRepository)
  return {
    sut,
    checkInRepository,
    gymRepository,
  }
}
describe('CheckIn Use Case', async () => {
  let mockGetDistanceBetweenCoordinates: Mock
  beforeEach(() => {
    mockGetDistanceBetweenCoordinates = getDistanceBetweenCoordinates as Mock
    mockGetDistanceBetweenCoordinates.mockReturnValue(0.1)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should able create a checkin', async () => {
    const { sut } = makeSut()

    const { checkIn } = await sut.execute({
      userId: 'valid_user_id',
      gymId: 'valid_gym_id',
      userLatitude: 1000,
      userLongitude: 1200,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 10, 0, 0, 0))

    const { sut, checkInRepository } = makeSut()

    vi.spyOn(checkInRepository, 'findByUserIdOnDate').mockResolvedValueOnce({
      created_at: new Date(),
      id: 'some-id',
      gym_id: 'gymId',
      user_id: 'userId',
      validated_at: new Date(),
    })

    const response = sut.execute({
      userId: 'valid_user_id',
      gymId: 'valid_gym_id',
      userLatitude: 1000,
      userLongitude: 1200,
    })
    await expect(response).rejects.toBeInstanceOf(MaxNumberOfCheckinError)
  })

  it('should not be able create a checkin when gym not found', async () => {
    const { sut, gymRepository } = makeSut()
    vi.spyOn(gymRepository, 'findById').mockResolvedValueOnce(null)
    const response = sut.execute({
      userId: 'valid_user_id',
      gymId: 'valid_gym_id',
      userLatitude: 1000,
      userLongitude: 1200,
    })
    await expect(response).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to create check in on distant gym', async () => {
    const { sut } = makeSut()
    mockGetDistanceBetweenCoordinates.mockReturnValue(0.2)
    const response = sut.execute({
      userId: 'valid_user_id',
      gymId: 'valid_gym_id',
      userLatitude: 1000,
      userLongitude: 1200,
    })
    await expect(response).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
