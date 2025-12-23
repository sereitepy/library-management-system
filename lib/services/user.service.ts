import prisma from '@/lib/prisma'

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}

export async function getUserStats(userId: string) {
  const total = await prisma.borrowingTransaction.count({
    where: { userId },
  })

  const active = await prisma.borrowingTransaction.count({
    where: {
      userId,
      status: 'BORROWED',
    },
  })

  return { totalBorrows: total, activeBorrows: active }
}

export async function getUserOverdueCount(userId: string) {
  return prisma.borrowingTransaction.count({
    where: {
      userId,
      status: 'BORROWED',
      dueDate: { lt: new Date() },
    },
  })
}

export async function getUserReturnedCount(userId: string) {
  return prisma.borrowingTransaction.count({
    where: {
      userId,
      status: 'RETURNED',
    },
  })
}