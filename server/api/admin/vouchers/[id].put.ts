import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const id = event.context.params?.id
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Voucher ID is required'
      })
    }

    const voucher = await prisma.voucher.update({
      where: { id },
      data: body
    })

    return {
      success: true,
      voucher
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Update voucher error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update voucher'
    })
  }
})
