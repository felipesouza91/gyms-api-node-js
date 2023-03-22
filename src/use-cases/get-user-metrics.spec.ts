import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

const makeSut = () => {
  const checkInRepository = new InMemoryCheckinRepository()
  const sut = new GetUserMetricsUseCase(checkInRepository)
  return {
    sut,
    checkInRepository,
  }
}

describe('Get User Metrics Use Case', () => {
  it('should return user metrics', async () => {
    const { sut, checkInRepository } = makeSut()
    await checkInRepository.create({
      gym_id: 'valid-gym-id-01',
      user_id: 'valid-user-id',
    })
    await checkInRepository.create({
      gym_id: 'valid-gym-id-02',
      user_id: 'valid-user-id',
    })
    await checkInRepository.create({
      gym_id: 'valid-gym-id-02',
      user_id: 'valid-user-id-02',
    })

    const { checkInsMetrics } = await sut.execute({ userId: 'valid-user-id' })

    expect(checkInsMetrics).toBe(2)
  })
})
