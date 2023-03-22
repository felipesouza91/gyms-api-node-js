import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, vi } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

const makeSut = () => {
  const repository = new InMemoryUserRepository()
  const sut = new GetUserProfileUseCase(repository)
  return {
    sut,
    repository,
  }
}
describe('Get User Profile Use Case', async () => {
  it('should thrown when invalid_id is provided', async () => {
    const { sut } = makeSut()

    const response = sut.execute({ userId: 'invalid_id' })
    await expect(response).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should return user profile when correct values is provided', async () => {
    const { sut, repository } = makeSut()
    vi.spyOn(repository, 'findById').mockResolvedValueOnce({
      id: 'valid_id',
      created_at: new Date(),
      name: 'John Smith',
      password_hash: 'password_hash',
      email: 'valid_email@email.com',
    })
    const { user } = await sut.execute({ userId: 'valid_id' })
    expect(user).toEqual(
      expect.objectContaining({
        id: 'valid_id',
        name: 'John Smith',
        password_hash: 'password_hash',
      }),
    )
  })
})
