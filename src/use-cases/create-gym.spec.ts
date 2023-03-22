import { describe, expect, it } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'

const makeSut = () => {
  const repository = new InMemoryGymRepository()
  const sut = new CreateGymUseCase(repository)
  return {
    sut,
    repository,
  }
}
describe('Create Gym Use Case', async () => {
  it('should create a gym', async () => {
    const { sut } = makeSut()
    const inputData = {
      title: 'Gym',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    }
    const { gym } = await sut.execute(inputData)
    expect(gym).toEqual(
      expect.objectContaining({
        description: 'Gym academy',
        title: 'Gym',
        phone: '21 2121212122',
      }),
    )
  })
})
