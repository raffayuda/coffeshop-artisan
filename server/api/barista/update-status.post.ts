import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['BARISTA', 'ADMIN'])
    const body = await readBody(event)
    
    const { orderId, status, notes } = body

    if (!orderId || !status) {
      throw createError({
        statusCode: 400,
        message: 'Order ID and status are required'
      })
    }

    // Validate status transition
    const validStatuses = ['PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid status'
      })
    }

    // Get current order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true
      }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      }
    })

    // Add status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: status as any,
        notes: notes || `Status updated to ${status} by ${user.fullName}`
      }
    })

    return {
      success: true,
      order: updatedOrder
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Update order status error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update order status'
    })
  }
})
