import prisma from '@/lib/prisma'
import { UserRole } from '@/types/enums'

export async function adminGetUsers() {
  return prisma.user.findMany()
}

export async function adminGetUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { transactions: true },
  })
}

export async function adminChangeUserRole(userId: string, role: UserRole) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  })
}

export async function getAdminRequests() {
  return prisma.user.findMany({
    where: { role: 'PENDING_ADMIN' },
    orderBy: { createdAt: 'desc' },
  })
}

export async function approveAdminRequest(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  })
}

export async function rejectAdminRequest(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: 'USER' },
  })
}