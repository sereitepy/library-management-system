import prisma from '@/lib/prisma'

export async function getAdminStats() {
  const users = await prisma.user.count()
  const books = await prisma.book.count()
  const borrowed = await prisma.borrowingTransaction.count({
    where: { status: 'BORROWED' },
  })

  return { users, books, borrowed }
}

export async function getBorrowAnalytics() {
  return prisma.borrowingTransaction.groupBy({
    by: ['status'],
    _count: true,
  })
}

export async function getRecentActivity() {
  const recentBorrows = await prisma.borrowingTransaction.findMany({
    where: { status: { in: ['PENDING_PICKUP', 'BORROWED'] } },
    include: { book: true, user: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const recentReturns = await prisma.borrowingTransaction.findMany({
    where: { status: 'RETURNED' },
    include: { book: true, user: true },
    orderBy: { returnedDate: 'desc' },
    take: 10,
  })

  const newUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return { recentBorrows, recentReturns, newUsers }
}

export async function getOverdueCount() {
  return prisma.borrowingTransaction.count({
    where: {
      status: 'BORROWED',
      dueDate: { lt: new Date() },
    },
  })
}
