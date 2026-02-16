import prisma from '../../../../utils/prisma'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const id = event.context.params?.id
    const body = await readBody(event)
    const { role } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    if (!role || !['CUSTOMER', 'BARISTA', 'ADMIN'].includes(role)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid role'
      })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true
      }
    })

    return {
      success: true,
      user
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Update user role error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update user role'
    })
  }
})
