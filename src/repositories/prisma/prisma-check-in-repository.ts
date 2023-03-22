import { prismaClient } from '@/lib/prisma'
import { CheckInRepository } from '@/repositories/check-in-repository'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

export class PrismaCheckInRepository implements CheckInRepository {
  async save(data: CheckIn): Promise<CheckIn> {
    const savedCheckIn = await prismaClient.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return savedCheckIn
  }

  async findById(checkInId: string): Promise<CheckIn | null> {
    const checkIn = await prismaClient.checkIn.findFirst({
      where: {
        id: checkInId,
      },
    })
    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prismaClient.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prismaClient.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prismaClient.checkIn.create({
      data,
    })
    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    const checkIn = await prismaClient.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          lte: endOfTheDay.toDate(),
          gte: startOfTheDay.toDate(),
        },
      },
    })
    return checkIn
  }
}
