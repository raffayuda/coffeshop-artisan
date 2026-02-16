import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['CUSTOMER'])
    const orderId = event.context.params?.id

    if (!orderId) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      })
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      },
      include: {
        items: {
          include: {
            menu: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        },
        payment: true,
        address: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }

    return {
      success: true,
      order
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get order error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get order'
    })
  }
})
