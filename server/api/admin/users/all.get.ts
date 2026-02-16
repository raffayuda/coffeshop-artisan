import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        isActive: true,
        loyaltyPoint: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      users: users.map(user => ({
        ...user,
        ordersCount: user._count.orders
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get users error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get users'
    })
  }
})
