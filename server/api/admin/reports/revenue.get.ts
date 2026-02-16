import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const query = getQuery(event)
    const period = query.period as string || 'daily' // daily, weekly, monthly

    const now = new Date()
    let startDate: Date
    
    if (period === 'daily') {
      // Last 7 days
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (period === 'weekly') {
      // Last 8 weeks
      startDate = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000)
    } else {
      // Last 12 months
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        payment: {
          status: 'SUCCESS'
        }
      },
      include: {
        payment: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by period
    const revenueByPeriod: { [key: string]: number } = {}
    
    orders.forEach(order => {
      let periodKey: string
      const date = new Date(order.createdAt)
      
      if (period === 'daily') {
        periodKey = date.toISOString().split('T')[0] || ''
      } else if (period === 'weekly') {
        // Get week number
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        periodKey = weekStart.toISOString().split('T')[0] || ''
      } else {
        // Monthly
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }
      
      revenueByPeriod[periodKey] = (revenueByPeriod[periodKey] || 0) + order.total
    })

    return {
      success: true,
      period,
      data: Object.entries(revenueByPeriod).map(([date, revenue]) => ({
        date,
        revenue
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get revenue report error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get revenue report'
    })
  }
})
