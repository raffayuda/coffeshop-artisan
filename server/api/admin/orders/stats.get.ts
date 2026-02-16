import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Total orders
    const totalOrders = await prisma.order.count()

    // Orders today
    const ordersToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Total revenue (only successful payments)
    const revenueData = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        payment: {
          status: 'SUCCESS'
        }
      }
    })
    const totalRevenue = revenueData._sum.total || 0

    // Revenue today
    const revenueTodayData = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: today
        },
        payment: {
          status: 'SUCCESS'
        }
      }
    })
    const revenueToday = revenueTodayData._sum.total || 0

    // Total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER'
      }
    })

    // New customers this week
    const newCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          gte: thisWeek
        }
      }
    })

    // Total menus
    const totalMenus = await prisma.menu.count()

    // Active menus
    const activeMenus = await prisma.menu.count({
      where: {
        isAvailable: true
      }
    })

    return {
      success: true,
      stats: {
        totalOrders,
        ordersToday,
        totalRevenue,
        revenueToday,
        totalCustomers,
        newCustomers,
        totalMenus,
        activeMenus
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get order stats error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get order statistics'
    })
  }
})
