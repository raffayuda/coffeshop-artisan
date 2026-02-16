import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Verify admin access
  const user = await requireAuth(event, ['ADMIN'])
  
  try {
    // Get ALL menus (including unavailable ones) for admin
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

    return {
      success: true,
      menus
    }
  } catch (error: any) {
    console.error('Get all menus error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get menus'
    })
  }
})
