import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'

const makeSut = () => {
  const repository = new InMemoryCheckinRepository()
  const sut = new ValidateCheckInUseCase(repository)
  return { sut, repository }
}

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to validate an valid check-in', async () => {
    const { sut, repository } = makeSut()
    const result = await repository.create({
      gym_id: ' some_gym_id',
      user_id: 'some_user_id',
    })

    const response = await sut.execute({ checkInId: result.id })
    expect(response.checkIn.validated_at).toEqual(expect.any(Date))
  })
  it('should not be able to validate an inexistent check-in', async () => {
    const { sut } = makeSut()

    const response = sut.execute({ checkInId: 'invalid_check_in_id' })
    await expect(response).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to validate an inexistent check-in', async () => {
    const { sut } = makeSut()

    const response = sut.execute({ checkInId: 'invalid_check_in_id' })
    await expect(response).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    const { sut, repository } = makeSut()
    vi.setSystemTime(new Date(2020, 2, 20, 11, 0, 0, 0))
    const result = await repository.create({
      gym_id: ' some_gym_id',
      user_id: 'some_user_id',
    })
    vi.advanceTimersByTime(21 * 60 * 1000) // 21 minutes
    const response = sut.execute({ checkInId: result.id })
    await expect(response).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
