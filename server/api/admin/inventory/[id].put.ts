import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const ingredientId = event.context.params?.id
    const body = await readBody(event)
    
    const { quantity, notes } = body

    if (!ingredientId || !quantity) {
      throw createError({
        statusCode: 400,
        message: 'Ingredient ID and quantity are required'
      })
    }

    // Update stock
    const ingredient = await prisma.ingredient.update({
      where: { id: ingredientId },
      data: {
        currentStock: { increment: quantity }
      }
    })

    // Record stock history
    await prisma.stockHistory.create({
      data: {
        ingredientId,
        quantity,
        type: quantity > 0 ? 'IN' : 'OUT',
        notes: notes || (quantity > 0 ? 'Stock added' : 'Stock removed')
      }
    })

    return {
      success: true,
      ingredient
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Update stock error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update stock'
    })
  }
})
