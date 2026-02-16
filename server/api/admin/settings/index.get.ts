import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])

    const settings = await prisma.storeSetting.findMany()
    const operational = await prisma.operationalHour.findMany({
      orderBy: {
        day: 'asc'
      }
    })

    return {
      success: true,
      settings,
      operational
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get settings error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get settings'
    })
  }
})
