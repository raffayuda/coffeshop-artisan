import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const body = await readBody(event)
    
    const { code, name, description, type, value, maxDiscount, quotaLimit, validFrom, validTo } = body

    // Validate required fields
    if (!code || !name || !type || !value || !quotaLimit || !validFrom || !validTo) {
      throw createError({
        statusCode: 400,
        message: 'All fields are required'
      })
    }

    // Check if code already exists
    const existing = await prisma.voucher.findUnique({
      where: { code }
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        message: 'Voucher code already exists'
      })
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        name,
        description,
        type: type as any,
        value,
        maxDiscount,
        quotaLimit,
        quotaUsed: 0,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        isActive: true
      }
    })

    return {
      success: true,
      voucher
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Create voucher error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create voucher'
    })
  }
})
