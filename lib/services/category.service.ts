import prisma from '@/lib/prisma'

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getBooksByCategory(slug: string) {
  return prisma.book.findMany({
    where: {
      category: { slug },
    },
    include: { category: true },
  })
}
