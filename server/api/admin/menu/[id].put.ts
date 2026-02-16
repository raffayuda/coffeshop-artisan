import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const menuId = event.context.params?.id
    const body = await readBody(event)

    if (!menuId) {
      throw createError({
        statusCode: 400,
        message: 'Menu ID is required'
      })
    }

    const { name, description, category, image, isAvailable, prices } = body

    // If prices are provided, update them
    if (prices && Array.isArray(prices)) {
      // Delete existing prices
      await prisma.menuPrice.deleteMany({
        where: { menuId }
      })

      // Create new prices
      await prisma.menuPrice.createMany({
        data: prices.map((p: any) => ({
          menuId,
          size: p.size,
          price: p.price
        }))
      })
    }

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        name: name || undefined,
        description: description || undefined,
        category: category || undefined,
        image: image || undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined
      },
      include: {
        prices: true,
        toppings: {
          include: {
            topping: true
          }
        }
      }
    })

    return {
      success: true,
      menu
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Update menu error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update menu'
    })
  }
})
