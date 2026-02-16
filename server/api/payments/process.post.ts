import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { generateTransactionId, calculateLoyaltyPoints } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['CUSTOMER'])
    const body = await readBody(event)
    
    const { orderId, paymentProof } = body

    if (!orderId) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      })
    }

    // Get order with payment
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      },
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

    if (order.payment.status === 'SUCCESS') {
      throw createError({
        statusCode: 400,
        message: 'Order already paid'
      })
    }

    // Generate transaction ID
    const transactionId = generateTransactionId()

    // Update payment
    const payment = await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        status: order.payment.method === 'CASH' ? 'PENDING' : 'SUCCESS',
        transactionId,
        proofImage: paymentProof,
        paidAt: order.payment.method === 'CASH' ? null : new Date()
      }
    })

    // If payment successful, update order status and award loyalty points
    if (payment.status === 'SUCCESS') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING'
        }
      })

      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: 'PROCESSING',
          notes: 'Payment confirmed'
        }
      })

      // Calculate and award loyalty points
      const points = calculateLoyaltyPoints(order.total)
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loyaltyPoint: { increment: points }
        }
      })

      await prisma.loyaltyTransaction.create({
        data: {
          userId: user.id,
          orderId,
          points,
          type: 'EARN',
          description: `Earned ${points} points from order ${order.orderNumber}`
        }
      })
    }

    return {
      success: true,
      payment,
      message: payment.status === 'SUCCESS' 
        ? 'Payment confirmed' 
        : 'Payment pending verification'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Process payment error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process payment'
    })
  }
})
