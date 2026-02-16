import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const body = await readBody(event)
    
    const { name, description, category, image, prices, ingredients } = body

    // Validate required fields
    if (!name || !category || !prices || prices.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Name, category, and prices are required'
      })
    }

    // Create menu
    const menu = await prisma.menu.create({
      data: {
        name,
        description: description || '',
        category: category as any,
        image,
        isAvailable: true,
        prices: {
          create: prices.map((p: any) => ({
            size: p.size,
            price: p.price
          }))
        },
        ingredients: ingredients ? {
          create: ingredients.map((ing: any) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity
          }))
        } : undefined
      },
      include: {
        prices: true,
        ingredients: {
          include: {
            ingredient: true
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
    
    console.error('Create menu error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create menu'
    })
  }
})
