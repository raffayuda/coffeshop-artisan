import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)

    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        menu: {
          include: {
            prices: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      cartItems
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get cart'
    })
  }
})
