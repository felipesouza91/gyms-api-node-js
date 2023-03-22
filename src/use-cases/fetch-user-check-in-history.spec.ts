import { describe, expect, it } from 'vitest'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-in-history'

const makeSut = () => {
  const repository = new InMemoryCheckinRepository()
  const sut = new FetchUserCheckInHistoryUseCase(repository)
  return {
    sut,
    repository,
  }
}
describe('Fetch User Check In History Use Case', async () => {
  it('should be able to fetch check-in history', async () => {
    const { sut, repository } = makeSut()
    await repository.create({
      gym_id: 'valid-gym-id-01',
      user_id: 'valid-user-id',
    })
    await repository.create({
      gym_id: 'valid-gym-id-02',
      user_id: 'valid-user-id',
    })

    const { checkIns } = await sut.execute({ userId: 'valid-user-id' })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gym_id: 'valid-gym-id-01',
          user_id: 'valid-user-id',
        }),
        expect.objectContaining({
          gym_id: 'valid-gym-id-02',
          user_id: 'valid-user-id',
        }),
      ]),
    )
  })
  it('should be able to fetch paginated user check in history ', async () => {
    const { sut, repository } = makeSut()
    for (let i = 1; i <= 22; i++) {
      await repository.create({
        gym_id: `valid-gym-id-${i}`,
        user_id: 'valid-user-id',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'valid-user-id', page: 2 })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gym_id: 'valid-gym-id-21',
          user_id: 'valid-user-id',
        }),
        expect.objectContaining({
          gym_id: 'valid-gym-id-22',
          user_id: 'valid-user-id',
        }),
      ]),
    )
  })
})
