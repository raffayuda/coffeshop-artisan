import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const query = getQuery(event)
    const period = query.period as string || '7d'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get orders in period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        },
        payment: {
          status: 'SUCCESS'
        }
      },
      include: {
        items: true,
        payment: true
      }
    })

    // Calculate metrics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Group by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      _count: true
    })

    // Top selling items
    const itemSales = await prisma.orderItem.groupBy({
      by: ['menuId'],
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: now
          },
          payment: {
            status: 'SUCCESS'
          }
        }
      },
      _sum: {
        quantity: true
      },
      _count: true,
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    })

    // Get menu details for top items
    const menuIds = itemSales.map(item => item.menuId)
    const menus = await prisma.menu.findMany({
      where: {
        id: { in: menuIds }
      },
      select: {
        id: true,
        name: true,
        category: true,
        image: true
      }
    })

    const topItems = itemSales.map(item => {
      const menu = menus.find(m => m.id === item.menuId)
      return {
        menu,
        totalQuantity: item._sum.quantity,
        orderCount: item._count
      }
    })

    // Revenue by day
    const dailyRevenue = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += order.total
      return acc
    }, {})

    return {
      success: true,
      period,
      statistics: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        topItems,
        dailyRevenue
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get reports error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get reports'
    })
  }
})
