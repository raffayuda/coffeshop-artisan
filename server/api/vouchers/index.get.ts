import prisma from '../../utils/prisma'
import { optionalAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await optionalAuth(event)
    
    // Get active vouchers
    const now = new Date()
    
    const vouchers = await prisma.voucher.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validTo: { gte: now },
        quotaUsed: { lt: prisma.voucher.fields.quotaLimit }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // If user is logged in, check which vouchers they've used
    let usedVoucherIds: string[] = []
    if (user) {
      const userVouchers = await prisma.userVoucher.findMany({
        where: { userId: user.id },
        select: { voucherId: true }
      })
      usedVoucherIds = userVouchers.map(v => v.voucherId)
    }

    const vouchersWithStatus = vouchers.map(voucher => ({
      ...voucher,
      isUsed: usedVoucherIds.includes(voucher.id),
      remainingQuota: voucher.quotaLimit - voucher.quotaUsed
    }))

    return {
      success: true,
      vouchers: vouchersWithStatus
    }
  } catch (error: any) {
    console.error('Get vouchers error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get vouchers'
    })
  }
})
