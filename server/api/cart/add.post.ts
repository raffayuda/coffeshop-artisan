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

    const body = await readBody(event)
    const { menuId, size, quantity, iceLevel, sugarLevel, toppingIds, notes, customization } = body

    if (!menuId || !size) {
      throw createError({
        statusCode: 400,
        message: 'Menu ID and size are required'
      })
    }

    // If there's customization, always add as new item
    // Otherwise, check if similar item exists and update quantity
    if (!customization) {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: session.user.id,
          menuId,
          size,
          customization: null
        }
      })

      if (existingItem) {
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + (quantity || 1)
          },
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
      }
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        menuId,
        size,
        quantity: quantity || 1,
        iceLevel,
        sugarLevel,
        toppingIds: toppingIds || [],
        notes,
        customization
      },
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
      cartItem
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Add to cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to add to cart'
    })
  }
})
