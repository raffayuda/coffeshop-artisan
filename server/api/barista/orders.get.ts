import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['BARISTA', 'ADMIN'])
    const query = getQuery(event)
    const status = query.status as string || 'PENDING'

    // Get orders for barista (show all orders regardless of payment status)
    const orders = await prisma.order.findMany({
      where: {
        status: status === 'all' ? undefined : status as any
      },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true
          }
        },
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
        address: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'asc'
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
    
    console.error('Get barista orders error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get orders'
    })
  }
})
