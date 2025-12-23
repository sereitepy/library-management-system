import prisma from '@/lib/prisma'
import { addDays } from 'date-fns'

export async function getPendingPickups() {
  return prisma.borrowingTransaction.findMany({
    where: { status: 'PENDING_PICKUP' },
    include: { book: true, user: true },
  })
}

export async function cancelPendingPickup(transactionId: string) {
  return prisma.$transaction(async prisma => {
    const transaction = await prisma.borrowingTransaction.update({
      where: { id: transactionId },
      data: { status: 'CANCELLED' },
    })

    await prisma.book.update({
      where: { id: transaction.bookId },
      data: {
        availableCopies: { increment: 1 },
      },
    })

    return transaction
  })
}

export async function getActiveBorrows(filters?: {
  dueSoon?: boolean
  overdue?: boolean
  dateRange?: { start: Date; end: Date }
  userId?: string
}) {
  const where: any = { status: 'BORROWED' }

  if (filters?.dueSoon) {
    where.dueDate = {
      gte: new Date(),
      lte: addDays(new Date(), 3),
    }
  }

  if (filters?.overdue) {
    where.dueDate = { lt: new Date() }
  }

  if (filters?.dateRange) {
    where.borrowedDate = {
      gte: filters.dateRange.start,
      lte: filters.dateRange.end,
    }
  }

  if (filters?.userId) {
    where.userId = filters.userId
  }

  return prisma.borrowingTransaction.findMany({
    where,
    include: { book: true, user: true },
    orderBy: { dueDate: 'asc' },
  })
}

export async function confirmPickup(transactionId: string) {
  const transaction = await prisma.borrowingTransaction.update({
    where: { id: transactionId },
    data: {
      status: 'BORROWED',
      borrowedDate: new Date(),
      dueDate: addDays(new Date(), 14),
    },
  })

  return transaction
}

export async function markReturned(transactionId: string) {
  return prisma.$transaction(async prisma => {
    const transaction = await prisma.borrowingTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'RETURNED',
        returnedDate: new Date(),
      },
    })

    await prisma.book.update({
      where: { id: transaction.bookId },
      data: {
        availableCopies: { increment: 1 },
      },
    })

    return transaction
  })
}

export async function autoExpirePendingPickups() {
  const expired = await prisma.borrowingTransaction.findMany({
    where: {
      status: 'PENDING_PICKUP',
      pickupDeadline: { lt: new Date() },
    },
  })

  for (const transaction of expired) {
    await cancelPendingPickup(transaction.id)
  }

  return expired.length
}