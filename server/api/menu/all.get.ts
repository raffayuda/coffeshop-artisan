import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const menus = await prisma.menu.findMany({
      where: {
        isAvailable: true
      },
      include: {
        prices: {
          orderBy: {
            price: 'asc' // Order by price ascending (Small, Medium, Large)
          }
        },
        toppings: {
          include: {
            topping: true // Include topping details (name, price)
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      data: menus
    }
  } catch (error: any) {
    console.error('Error fetching menus:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch menus',
      data: []
    }
  }
})
