import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get all menus with prices and toppings
    const menus = await prisma.menu.findMany({
      where: {
        isAvailable: true
      },
      include: {
        prices: {
          orderBy: {
            size: 'asc'
          }
        },
        toppings: {
          include: {
            topping: {
              where: {
                isAvailable: true
              }
            }
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
    console.error('Get menu error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get menu'
    })
  }
})
