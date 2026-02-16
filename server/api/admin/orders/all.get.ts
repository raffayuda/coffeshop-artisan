import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            menu: true
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    return {
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        user: order.user,
        orderType: order.type,
        status: order.status,
        totalAmount: order.total,
        itemCount: order.items.length,
        paymentStatus: order.payment?.status || 'PENDING',
        paymentMethod: order.payment?.method || null,
        createdAt: order.createdAt
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get all orders error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get orders'
    })
  }
})
