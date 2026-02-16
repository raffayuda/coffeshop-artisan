import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const user = await requireAuth(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Get order ID from route params
    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      })
    }

    // Check if order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true
      }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }

    if (order.userId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'You do not have permission to cancel this order'
      })
    }

    // Check if order can be cancelled
    if (order.status !== 'PENDING') {
      throw createError({
        statusCode: 400,
        message: 'Order cannot be cancelled at this stage. Only pending orders can be cancelled.'
      })
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        notes: order.notes ? `${order.notes}\nOrder cancelled by customer` : 'Order cancelled by customer'
      },
      include: {
        items: {
          include: {
            menu: true
          }
        },
        payment: true
      }
    })

    // If payment was already made, we should process refund (future implementation)
    // For now, just update payment status if applicable
    if (order.payment && order.payment.status === 'SUCCESS') {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'REFUNDED'
        }
      })
    }

    return {
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder
    }
  } catch (error: any) {
    console.error('Error cancelling order:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to cancel order'
    })
  }
})
