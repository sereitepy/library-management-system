import prisma from '@/lib/prisma'
import { addDays } from 'date-fns'

// User requests to borrow a book
export async function createBorrowRequest(userId: string, bookId: string) {
  return prisma.$transaction(async prisma => {
    
    // Check availability
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book || book.availableCopies <= 0) {
      throw new Error('Book not available')
    }

    // Create transaction
    const transaction = await prisma.borrowingTransaction.create({
      data: {
        userId,
        bookId,
        pickupDeadline: addDays(new Date(), 3),
        status: 'PENDING_PICKUP',
      },
    })

    // Decrease NOW (reserve the book)
    await prisma.book.update({
      where: { id: bookId },
      data: {
        availableCopies: { decrement: 1 },
      },
    })

    return transaction
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
