import prisma from '@/lib/prisma'
import { addDays } from 'date-fns'

// User requests to borrow a book
export async function createBorrowRequest(userId: string, bookId: string) {
  const pickupDeadline = addDays(new Date(), 3)

  return prisma.borrowingTransaction.create({
    data: {
      userId,
      bookId,
      pickupDeadline,
      status: 'PENDING_PICKUP',
    },
  })
}

// Cancel before pickup
export async function cancelBorrowRequest(
  transactionId: string,
  userId: string
) {
  return prisma.borrowingTransaction.updateMany({
    where: {
      id: transactionId,
      userId,
      status: 'PENDING_PICKUP',
    },
    data: {
      status: 'CANCELLED',
    },
  })
}

export async function getUserActiveBorrows(userId: string) {
  return prisma.borrowingTransaction.findMany({
    where: {
      userId,
      status: 'BORROWED',
    },
    include: { book: true },
  })
}

export async function getUserBorrowHistory(userId: string) {
  return prisma.borrowingTransaction.findMany({
    where: {
      userId,
      status: {
        in: ['RETURNED', 'CANCELLED'],
      },
    },
    include: { book: true },
    orderBy: { updatedAt: 'desc' },
  })
}
