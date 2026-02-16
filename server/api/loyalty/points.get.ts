import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['CUSTOMER'])

    // Get loyalty points
    const userWithPoints = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        loyaltyPoint: true
      }
    })

    // Get loyalty transactions
    const transactions = await prisma.loyaltyTransaction.findMany({
      where: {
        userId: user.id
      },
      include: {
        order: {
          select: {
            orderNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return {
      success: true,
      loyaltyPoints: userWithPoints?.loyaltyPoint || 0,
      transactions
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get loyalty points error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get loyalty points'
    })
  }
})
