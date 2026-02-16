import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const ingredients = await prisma.ingredient.findMany({
      include: {
        _count: {
          select: {
            menus: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      ingredients
    }
  } catch (error: any) {
    console.error('Get ingredients error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get ingredients'
    })
  }
})
