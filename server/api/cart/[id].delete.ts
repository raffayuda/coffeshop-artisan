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

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Cart item ID is required'
      })
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id }
    })

    if (!cartItem || cartItem.userId !== session.user.id) {
      throw createError({
        statusCode: 404,
        message: 'Cart item not found'
      })
    }

    await prisma.cartItem.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'Item removed from cart'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Remove from cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to remove from cart'
    })
  }
})
