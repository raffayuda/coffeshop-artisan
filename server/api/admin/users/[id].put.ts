import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const userId = event.context.params?.id
    const body = await readBody(event)
    
    const { role, fullName } = body

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role || undefined,
        fullName: fullName || undefined
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        loyaltyPoint: true,
        createdAt: true,
        updatedAt: true
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
    
    console.error('Update user error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update user'
    })
  }
})
