import prisma from '../../../../utils/prisma'
import { requireAuth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    })

    return {
      success: true,
      message: 'User deactivated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Delete user error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete user'
    })
  }
})
