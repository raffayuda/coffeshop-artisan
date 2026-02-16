import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const orderItems = await prisma.orderItem.groupBy({
      by: ['menuId'],
      _count: {
        id: true
      },
      _sum: {
        quantity: true,
        price: true
      }
    })

    // Get menu details
    const menuIds = orderItems.map(item => item.menuId)
    const menus = await prisma.menu.findMany({
      where: {
        id: {
          in: menuIds
        }
      }
    })

    const menuMap = new Map(menus.map(m => [m.id, m]))

    const analytics = orderItems.map(item => {
      const menu = menuMap.get(item.menuId)
      return {
        menuId: item.menuId,
        menuName: menu?.name || 'Unknown',
        category: menu?.category || 'UNKNOWN',
        ordersCount: item._count.id,
        quantitySold: item._sum.quantity || 0,
        totalRevenue: item._sum.price || 0
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)

    return {
      success: true,
      analytics
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get menu analytics error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get menu analytics'
    })
  }
})
