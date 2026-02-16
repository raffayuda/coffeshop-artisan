import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const body = await readBody(event)
    const { day, openTime, closeTime, isOpen } = body

    if (!day || !openTime || !closeTime) {
      throw createError({
        statusCode: 400,
        message: 'Day, open time, and close time are required'
      })
    }

    const operational = await prisma.operationalHour.upsert({
      where: { day },
      create: {
        day,
        openTime,
        closeTime,
        isOpen: isOpen !== undefined ? isOpen : true
      },
      update: {
        openTime,
        closeTime,
        isOpen
      }
    })

    return {
      success: true,
      operational
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Update operational hour error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update operational hour'
    })
  }
})
