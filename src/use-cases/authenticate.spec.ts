import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, vi } from 'vitest'
import bcryptjs from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'

const makeSut = () => {
  const repository = new InMemoryUserRepository()

  const sut = new AuthenticateUseCase(repository)
  return {
    sut,
    repository,
  }
}

describe('Authenticate Use Case', async () => {
  it('should not be authenticate with incorrect email', async () => {
    const { sut } = makeSut()
    const inputData = {
      email: 'validemail@email.com',
      password: 'valid_password',
    }
    const result = sut.execute(inputData)
    await expect(result).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should compare password upon authentication', async () => {
    const { sut, repository } = makeSut()

    const compareSpy = vi.spyOn(bcryptjs, 'compare')
    compareSpy.mockResolvedValueOnce(true)
    vi.spyOn(repository, 'findByEmail').mockResolvedValueOnce({
      email: '',
      id: 'some-id',
      name: 'name',
      password_hash: 'password',
      created_at: new Date(),
    })
    const inputData = {
      email: 'validemail@email.com',
      password: 'valid_password',
    }
    await sut.execute(inputData)
    expect(compareSpy).toHaveBeenCalled()
  })
  it('should not be authenticate with incorrect password', async () => {
    vi.spyOn(bcryptjs, 'compare').mockResolvedValueOnce(false)
    const { sut, repository } = makeSut()
    vi.spyOn(repository, 'findByEmail').mockResolvedValueOnce({
      email: '',
      id: 'some-id',
      name: 'name',
      password_hash: 'password',
      created_at: new Date(),
    })
    const inputData = {
      email: 'validemail@email.com',
      password: 'valid_password',
    }
    const result = sut.execute(inputData)
    await expect(result).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should be able authenticate with correct data', async () => {
    const { sut, repository } = makeSut()
    vi.spyOn(bcryptjs, 'compare').mockResolvedValueOnce(true)
    vi.spyOn(repository, 'findByEmail').mockResolvedValueOnce({
      email: 'validemail@email.com',
      id: 'some-id',
      name: 'John Doe',
      password_hash: 'valid_password_hash',
      created_at: new Date(),
    })
    const inputData = {
      email: 'validemail@email.com',
      password: 'valid_password',
    }
    const result = await sut.execute(inputData)
    expect(result).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email: 'validemail@email.com',
          id: 'some-id',
          name: 'John Doe',
          password_hash: 'valid_password_hash',
        }),
      }),
    )
  })
})
