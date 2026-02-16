import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Require authentication and BARISTA/ADMIN role
  await requireAuth(event, ['BARISTA', 'ADMIN'])

  try {
    // Get all menus (including unavailable ones) with prices
    const menus = await prisma.menu.findMany({
      include: {
        prices: {
          orderBy: {
            size: 'asc'
          }
        },
        toppings: {
          include: {
            topping: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return menus
  } catch (error: any) {
    console.error('Get barista menu error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get menu list'
    })
  }
})
