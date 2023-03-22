import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { env } from '@/env'
import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { User } from '@prisma/client'

interface RegisterUseCaseData {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseData): Promise<RegisterUseCaseResponse> {
    const userExists = await this.userRepository.findByEmail(email)
    if (userExists) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, env.APP_SALT)

    const user = await this.userRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })
    return { user }
  }
}
