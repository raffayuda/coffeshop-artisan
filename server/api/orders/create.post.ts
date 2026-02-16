import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { generateOrderNumber, generateQRCode, calculateEstimatedTime, calculateTax, calculateLoyaltyPoints } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event, ['CUSTOMER'])
    const body = await readBody(event)
    
    const { 
      items, // [{ menuId, size, quantity, iceLevel, sugarLevel, notes, toppingIds: [] }]
      orderType, // DINE_IN, TAKEAWAY, DELIVERY
      addressId, // for DELIVERY
      voucherCode,
      paymentMethod
    } = body

    // Validate required fields
    if (!items || items.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Order must have at least one item'
      })
    }

    if (!orderType || !['DINE_IN', 'TAKEAWAY', 'DELIVERY'].includes(orderType)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid order type'
      })
    }

    if (orderType === 'DELIVERY' && !addressId) {
      throw createError({
        statusCode: 400,
        message: 'Delivery address is required'
      })
    }

    if (!paymentMethod) {
      throw createError({
        statusCode: 400,
        message: 'Payment method is required'
      })
    }

    // Map payment method to database enum values
    let dbPaymentMethod = paymentMethod
    if (paymentMethod === 'CARD') {
      dbPaymentMethod = 'COD' // Map CARD to COD temporarily
    } else if (paymentMethod === 'E_WALLET') {
      dbPaymentMethod = 'DANA' // Map E_WALLET to DANA temporarily
    }

    // Verify address if delivery
    let deliveryAddress = null
    let deliveryFee = 0
    if (orderType === 'DELIVERY') {
      deliveryAddress = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId: user.id
        }
      })

      if (!deliveryAddress) {
        throw createError({
          statusCode: 404,
          message: 'Address not found'
        })
      }

      deliveryFee = 10000 // Fixed delivery fee
    }

    // Calculate order total
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      // Get menu and price
      const menu = await prisma.menu.findUnique({
        where: { id: item.menuId },
        include: {
          prices: {
            where: { size: item.size }
          }
        }
      })

      if (!menu || !menu.isAvailable) {
        throw createError({
          statusCode: 404,
          message: `Menu item not available: ${item.menuId}`
        })
      }

      const price = menu.prices[0]
      if (!price) {
        throw createError({
          statusCode: 404,
          message: `Price not found for size: ${item.size}`
        })
      }

      let itemTotal = price.price * item.quantity

      // Calculate topping price
      let toppingTotal = 0
      const toppingData = []
      if (item.toppingIds && item.toppingIds.length > 0) {
        const toppings = await prisma.topping.findMany({
          where: {
            id: { in: item.toppingIds },
            isAvailable: true
          }
        })

        for (const topping of toppings) {
          toppingTotal += topping.price * item.quantity
          toppingData.push({
            toppingId: topping.id,
            quantity: item.quantity
          })
        }
      }

      itemTotal += toppingTotal
      subtotal += itemTotal

      orderItems.push({
        menuId: item.menuId,
        size: item.size,
        quantity: item.quantity,
        price: price.price,
        iceLevel: item.iceLevel || 'NORMAL',
        sugarLevel: item.sugarLevel || 'NORMAL',
        notes: item.notes,
        toppings: toppingData
      })
    }

    // Apply voucher if provided
    let discount = 0
    let voucherId = null
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode }
      })

      if (voucher && 
          voucher.isActive && 
          voucher.quotaUsed < voucher.quotaLimit &&
          new Date() >= voucher.validFrom &&
          new Date() <= voucher.validTo) {
        
        // Check if user already used this voucher
        const userVoucher = await prisma.userVoucher.findFirst({
          where: {
            userId: user.id,
            voucherId: voucher.id
          }
        })

        if (!userVoucher) {
          voucherId = voucher.id
          
          if (voucher.type === 'PERCENTAGE') {
            discount = Math.round(subtotal * (voucher.value / 100))
            if (voucher.maxDiscount && discount > voucher.maxDiscount) {
              discount = voucher.maxDiscount
            }
          } else {
            discount = voucher.value
          }
        }
      }
    }

    const tax = calculateTax(subtotal)
    const total = subtotal + tax + deliveryFee - discount

    // Create order
    const orderNumber = generateOrderNumber()
    const qrCode = generateQRCode(orderNumber)
    const estimatedTime = calculateEstimatedTime(items.reduce((sum: number, item: any) => sum + item.quantity, 0))

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        type: orderType,
        subtotal,
        tax,
        deliveryFee,
        discount,
        total,
        qrCode,
        estimatedTime,
        addressId: orderType === 'DELIVERY' ? addressId : null,
        items: {
          create: orderItems.map(item => ({
            menuId: item.menuId,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            iceLevel: item.iceLevel,
            sugarLevel: item.sugarLevel,
            notes: item.notes,
            toppings: {
              create: item.toppings
            }
          }))
        },
        payment: {
          create: {
            method: dbPaymentMethod as any,
            amount: total,
            status: 'SUCCESS' // Auto-success for demo (simulate successful payment)
          }
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Order created'
          }
        }
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
      }
    })

    // Update voucher usage if applied
    if (voucherId) {
      await prisma.voucher.update({
        where: { id: voucherId },
        data: { quotaUsed: { increment: 1 } }
      })

      await prisma.userVoucher.create({
        data: {
          userId: user.id,
          voucherId,
          orderId: order.id
        }
      })
    }

    return {
      success: true,
      order
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Create order error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create order'
    })
  }
})
