/* eslint-disable camelcase */
import { prismaClient } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return await prismaClient.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prismaClient.user.findUnique({ where: { email } })
  }

  async create({ email, name, password_hash }: Prisma.UserCreateInput) {
    return await prismaClient.user.create({
      data: { email, name, password_hash },
    })
  }
}
