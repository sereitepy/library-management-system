import prisma from '@/lib/prisma'

export async function adminGetBooks() {
  return prisma.book.findMany({
    include: { category: true },
  })
}

export async function adminCreateBook(data: {
  title: string
  author: string
  isbn: string
  categoryId: string
  totalCopies: number
}) {
  return prisma.book.create({
    data: {
      ...data,
      availableCopies: data.totalCopies,
    },
  })
}

export async function adminUpdateBook(bookId: string, data: Partial<any>) {
  return prisma.book.update({
    where: { id: bookId },
    data,
  })
}

export async function adminDeleteBook(bookId: string) {
  return prisma.book.delete({
    where: { id: bookId },
  })
}

export async function canDeleteBook(bookId: string) {
  const activeTransactions = await prisma.borrowingTransaction.count({
    where: {
      bookId,
      status: { in: ['PENDING_PICKUP', 'BORROWED'] },
    },
  })

  return activeTransactions === 0
}
