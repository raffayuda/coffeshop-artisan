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
    const body = await readBody(event)
    const { quantity } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Cart item ID is required'
      })
    }

    if (!quantity || quantity < 1) {
      throw createError({
        statusCode: 400,
        message: 'Quantity must be at least 1'
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

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        menu: {
          include: {
            prices: true
          }
        }
      }
    })

    return {
      success: true,
      cartItem: updatedItem
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Update cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update cart'
    })
  }
})
