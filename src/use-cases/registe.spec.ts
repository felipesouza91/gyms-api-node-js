import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryUserRepository } from './../repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { describe, expect, it, vi } from 'vitest'
import bcryptjs from 'bcryptjs'

const makeSut = () => {
  const repository = new InMemoryUserRepository()
  const sut = new RegisterUseCase(repository)
  return {
    sut,
    repository,
  }
}
describe('Register Use Case', async () => {
  it('should hash user password upon registration', async () => {
    const hashSpy = vi.spyOn(bcryptjs, 'hash')
    const { sut } = makeSut()
    const inputData = {
      email: 'validemail@email.com',
      name: 'Jonh Doe',
      password: 'valid_password',
    }
    await sut.execute(inputData)
    expect(hashSpy).toHaveBeenCalled()
  })
  it('should not be able to register with same e-mail', async () => {
    const { sut, repository } = makeSut()

    vi.spyOn(repository, 'findByEmail').mockReturnValueOnce(
      Promise.resolve({
        email: '',
        id: 'some-id',
        name: '',
        created_at: new Date(),
        password_hash: '',
      }),
    )
    const inputData = {
      email: 'validemail@email.com',
      name: 'John Doe',
      password: 'valid_password',
    }
    const result = sut.execute(inputData)
    await expect(result).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
  it('should be able to register', async () => {
    const { sut } = makeSut()

    const inputData = {
      email: 'validemail@email.com',
      name: 'John Doe',
      password: 'valid_password',
    }
    const { user } = await sut.execute(inputData)
    expect(user.id).toEqual(expect.any(String))
    expect(user).toEqual(
      expect.objectContaining({
        email: 'validemail@email.com',
        name: 'John Doe',
      }),
    )
  })
})
