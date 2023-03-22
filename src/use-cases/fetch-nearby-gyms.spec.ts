import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { getDistanceBetweenCoordinates } from '@/util/get-distance-between-coordinates'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

vi.mock('@/util/get-distance-between-coordinates', () => ({
  getDistanceBetweenCoordinates: vi.fn(),
}))

const makeSut = () => {
  const repository = new InMemoryGymRepository()
  const sut = new FetchNearbyGymsUseCase(repository)
  return {
    sut,
    repository,
  }
}
describe('Fetch Nearby Gyms Use Case', () => {
  let mockGetDistanceBetweenCoordinates: Mock
  beforeEach(() => {
    mockGetDistanceBetweenCoordinates = getDistanceBetweenCoordinates as Mock
    mockGetDistanceBetweenCoordinates.mockReturnValue(9)
    vi.useFakeTimers()
  })
  it('should return gyms in nearby', async () => {
    const { sut, repository } = makeSut()
    await repository.create({
      title: 'Gym',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    await repository.create({
      title: 'Gym 02',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    await repository.create({
      title: 'Gym 03',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    const { gyms } = await sut.execute({
      userLatitude: -23.585487,
      userLongitude: -23.545454,
    })
    expect(gyms).toHaveLength(3)
  })
  it('should not return gyms in nearby', async () => {
    const { sut, repository } = makeSut()
    mockGetDistanceBetweenCoordinates.mockReturnValue(11)
    await repository.create({
      title: 'Gym',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    await repository.create({
      title: 'Gym 02',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    await repository.create({
      title: 'Gym 03',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    const { gyms } = await sut.execute({
      userLatitude: -23.585487,
      userLongitude: -23.545454,
    })
    expect(gyms).toHaveLength(0)
  })
})
