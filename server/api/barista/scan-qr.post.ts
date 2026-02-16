import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['BARISTA', 'ADMIN'])
    const body = await readBody(event)
    
    const { qrCode } = body

    if (!qrCode) {
      throw createError({
        statusCode: 400,
        message: 'QR code is required'
      })
    }

    // Find order by QR code
    const order = await prisma.order.findFirst({
      where: {
        qrCode,
        status: 'READY'
      },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true
          }
        },
        items: {
          include: {
            menu: true
          }
        }
      }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found or not ready for pickup'
      })
    }

    // Complete the order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'COMPLETED',
        notes: `Order completed via QR scan by ${user.fullName}`
      }
    })

    return {
      success: true,
      order: {
        ...updatedOrder,
        user: order.user,
        items: order.items
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Scan QR error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to scan QR code'
    })
  }
})
