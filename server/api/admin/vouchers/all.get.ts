import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const vouchers = await prisma.voucher.findMany({
      include: {
        _count: {
          select: {
            userVouchers: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const now = new Date()

    return {
      success: true,
      vouchers: vouchers.map(v => ({
        ...v,
        isExpired: new Date(v.validTo) < now,
        usedCount: v._count.userVouchers,
        remainingQuota: v.quotaLimit - v.quotaUsed
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get vouchers error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get vouchers'
    })
  }
})
