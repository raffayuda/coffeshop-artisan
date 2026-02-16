import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const body = await readBody(event)
    const { name, unit, minStock, currentStock } = body

    if (!name || !unit) {
      throw createError({
        statusCode: 400,
        message: 'Name and unit are required'
      })
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        unit,
        minStock: minStock || 0,
        currentStock: currentStock || 0
      }
    })

    // Create stock history
    if (currentStock && currentStock > 0) {
      await prisma.stockHistory.create({
        data: {
          ingredientId: ingredient.id,
          quantity: currentStock,
          type: 'IN',
          notes: 'Initial stock'
        }
      })
    }

    return {
      success: true,
      ingredient
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Create ingredient error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create ingredient'
    })
  }
})
