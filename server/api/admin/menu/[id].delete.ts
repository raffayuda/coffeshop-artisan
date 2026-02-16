import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const menuId = event.context.params?.id

    if (!menuId) {
      throw createError({
        statusCode: 400,
        message: 'Menu ID is required'
      })
    }

    // Delete menu (cascade will delete related prices, ingredients, toppings)
    await prisma.menu.delete({
      where: { id: menuId }
    })

    return {
      success: true,
      message: 'Menu deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Delete menu error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete menu'
    })
  }
})
