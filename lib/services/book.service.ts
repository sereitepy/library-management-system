import prisma from '@/lib/prisma'

export async function getBooks(filters?: {
  categorySlug?: string
  search?: string
}) {
  return prisma.book.findMany({
    where: {
      title: filters?.search
        ? { contains: filters.search, mode: 'insensitive' }
        : undefined,
      category: filters?.categorySlug
        ? { slug: filters.categorySlug }
        : undefined,
    },
    include: { category: true },
  })
}

export async function getBookById(bookId: string) {
  return prisma.book.findUnique({
    where: { id: bookId },
    include: { category: true },
  })
}

export async function getSimilarBooks(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  })

  if (!book) return []

  return prisma.book.findMany({
    where: {
      categoryId: book.categoryId,
      NOT: { id: bookId },
    },
    take: 6,
  })
}

export async function getEarliestReturnDate(bookId: string) {
  const borrowing = await prisma.borrowingTransaction.findFirst({
    where: {
      bookId,
      status: 'BORROWED',
    },
    orderBy: { dueDate: 'asc' },
    select: { dueDate: true },
  })

  return borrowing?.dueDate || null
}