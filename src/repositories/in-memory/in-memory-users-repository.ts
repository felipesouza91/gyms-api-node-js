import { UserRepository } from '@/repositories/users-repository'
import { Prisma, Role, User } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  public itens: User[] = []

  create({
    email,
    name,
    password_hash,
  }: Prisma.UserCreateInput): Promise<User> {
    const savedUser = {
      name,
      id: randomUUID(),
      password_hash,
      created_at: new Date(),
      email,
      role: Role.ADMIN,
    }
    return Promise.resolve(savedUser)
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.itens.find((item) => item.email === email)
    if (!user) {
      return Promise.resolve(null)
    }
    return Promise.resolve(user)
  }

  findById(id: string): Promise<User | null> {
    const user = this.itens.find((item) => item.id === id)
    if (!user) {
      return Promise.resolve(null)
    }
    return Promise.resolve(user)
  }
}
