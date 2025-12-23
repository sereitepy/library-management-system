import prisma from '@/lib/prisma'
import { addDays } from 'date-fns'

export async function searchUsers(query: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } },
      ],
    },
  })
}

export async function quickCreateUser(data: {
  name: string
  email: string
  password: string
}) {
  return prisma.user.create({
    data: {
      ...data,
      role: 'USER',
    },
  })
}

export async function createInstantBorrow(userId: string, bookId: string) {
  return prisma.$transaction(async tx => {

    // Create transaction with pickupDeadline (required field)
    const transaction = await tx.borrowingTransaction.create({
      data: {
        userId,
        bookId,
        status: 'BORROWED',
        borrowedDate: new Date(),
        dueDate: addDays(new Date(), 14),
        pickupDeadline: new Date(),
      },
    })

    await tx.book.update({
      where: { id: bookId },
      data: {
        availableCopies: { decrement: 1 },
      },
    })

    return transaction
  })
}
