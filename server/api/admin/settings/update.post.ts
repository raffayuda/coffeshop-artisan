import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const body = await readBody(event)
    const { key, value, type } = body

    if (!key || value === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Key and value are required'
      })
    }

    const setting = await prisma.storeSetting.upsert({
      where: { key },
      create: {
        key,
        value,
        type: type || 'string'
      },
      update: {
        value,
        type: type || 'string'
      }
    })

    return {
      success: true,
      setting
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Update setting error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update setting'
    })
  }
})
