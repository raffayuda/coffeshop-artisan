import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const ingredients = await prisma.ingredient.findMany({
      include: {
        stockHistories: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
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

    // Check for low stock items
    const lowStockCount = ingredients.filter(i => i.currentStock <= i.minStock).length

    return {
      success: true,
      ingredients: ingredients.map(ing => ({
        ...ing,
        isLowStock: ing.currentStock <= ing.minStock,
        menusCount: ing._count.menus
      })),
      lowStockCount
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get ingredients error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get ingredients'
    })
  }
})
