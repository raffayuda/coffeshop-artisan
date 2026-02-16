import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const query = getQuery(event)
    const status = query.status as string
    const dateFrom = query.dateFrom as string
    const dateTo = query.dateTo as string

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
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
        payment: true,
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter(o => o.payment?.status === 'SUCCESS')
      .reduce((sum, o) => sum + o.total, 0)

    const statusCounts = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    return {
      success: true,
      orders,
      statistics: {
        totalOrders,
        totalRevenue,
        statusCounts
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get admin orders error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get orders'
    })
  }
})
