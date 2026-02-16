import prisma from '../../../../utils/prisma'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const id = event.context.params?.id
    const body = await readBody(event)
    const { quantity, type, notes } = body // type: IN, OUT, ADJUSTMENT

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Ingredient ID is required'
      })
    }

    if (quantity === undefined || !type) {
      throw createError({
        statusCode: 400,
        message: 'Quantity and type are required'
      })
    }

    const ingredient = await prisma.ingredient.findUnique({
      where: { id }
    })

    if (!ingredient) {
      throw createError({
        statusCode: 404,
        message: 'Ingredient not found'
      })
    }

    // Calculate new stock
    let newStock = ingredient.currentStock
    if (type === 'IN') {
      newStock += quantity
    } else if (type === 'OUT') {
      newStock -= quantity
    } else if (type === 'ADJUSTMENT') {
      newStock = quantity
    }

    // Update ingredient and create history
    const [updatedIngredient] = await prisma.$transaction([
      prisma.ingredient.update({
        where: { id },
        data: {
          currentStock: newStock
        }
      }),
      prisma.stockHistory.create({
        data: {
          ingredientId: id,
          quantity,
          type,
          notes
        }
      })
    ])

    return {
      success: true,
      ingredient: updatedIngredient
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
