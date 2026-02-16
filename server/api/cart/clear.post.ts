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

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    return {
      success: true,
      message: 'Cart cleared'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Clear cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to clear cart'
    })
  }
})
