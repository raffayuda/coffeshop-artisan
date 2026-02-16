import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['CUSTOMER'])
    
    const orders = await prisma.order.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      orders
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get orders error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get orders'
    })
  }
})
