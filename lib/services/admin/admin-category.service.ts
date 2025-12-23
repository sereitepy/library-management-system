import prisma from '@/lib/prisma'

export async function adminGetCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { books: true },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export async function adminCreateCategory(data: {
  name: string
  slug: string
  description?: string
}) {
  return prisma.category.create({ data })
}

export async function adminUpdateCategory(
  categoryId: string,
  data: { name?: string; slug?: string; description?: string }
) {
  return prisma.category.update({
    where: { id: categoryId },
    data,
  })
}

export async function adminDeleteCategory(categoryId: string) {
  return prisma.category.delete({
    where: { id: categoryId },
  })
}
