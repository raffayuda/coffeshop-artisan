import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const user = await requireAuth(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Fetch user's orders with all related data
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        items: {
          include: {
            menu: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        },
        payment: true,
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        type: order.type,
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        deliveryFee: order.deliveryFee,
        total: order.total,
        qrCode: order.qrCode,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          iceLevel: item.iceLevel,
          sugarLevel: item.sugarLevel,
          notes: item.notes,
          menu: item.menu,
          toppings: item.toppings
        })),
        payment: order.payment ? {
          status: order.payment.status,
          paymentMethod: order.payment.method,
          paidAt: order.payment.paidAt
        } : null,
        address: order.address
      }))
    }
  } catch (error: any) {
    console.error('Error fetching order history:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch order history'
    })
  }
})
