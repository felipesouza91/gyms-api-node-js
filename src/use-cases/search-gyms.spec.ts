import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'

import { describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

const makeSut = () => {
  const repository = new InMemoryGymRepository()
  const sut = new SearchGymsUseCase(repository)
  return {
    sut,
    repository,
  }
}

describe('Search Gyms Use Case', () => {
  it('Should return a gyms', async () => {
    const { sut, repository } = makeSut()
    await repository.create({
      title: 'Gym',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    await repository.create({
      title: 'Gym 2',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    await repository.create({
      title: 'Another 2',
      description: 'Gym academy',
      phone: '21 2121212122',
      latitude: -23.55659,
      longitude: -23.55659,
    })
    const { gyms } = await sut.execute({ query: 'Gym', page: 1 })
    expect(gyms).toHaveLength(2)
  })

  it('should be able to fetch paginated gyms', async () => {
    const { sut, repository } = makeSut()
    for (let i = 1; i <= 22; i++) {
      await repository.create({
        title: `Gym ${i}`,
        description: 'Gym academy',
        phone: '21 2121212122',
        latitude: -23.55659,
        longitude: -23.55659,
      })
    }
    const { gyms } = await sut.execute({ query: 'Gym', page: 2 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: `Gym 21` }),
        expect.objectContaining({ title: `Gym 22` }),
      ]),
    )
  })
})
