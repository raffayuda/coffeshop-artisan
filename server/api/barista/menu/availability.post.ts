import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['BARISTA', 'ADMIN'])
    const body = await readBody(event)
    
    const { menuId, isAvailable } = body

    if (!menuId || typeof isAvailable !== 'boolean') {
      throw createError({
        statusCode: 400,
        message: 'Menu ID and availability status are required'
      })
    }

    // Update menu availability
    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: { isAvailable }
    })

    return {
      success: true,
      menu
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Update menu availability error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update menu availability'
    })
  }
})
