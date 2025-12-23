import prisma from '@/lib/prisma'

export async function searchBooks(query: string) {
  return prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { category: true },
  })
}
