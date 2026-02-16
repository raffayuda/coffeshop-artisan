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

    return {
      success: true,
      vouchers
    }
  } catch (error: any) {
    console.error('Get vouchers error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get vouchers'
    })
  }
})
