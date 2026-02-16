export default defineEventHandler(async (event) => {
  try {
    // Use nuxt-auth-utils to get session
    const session = await getUserSession(event)

    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    return {
      success: true,
      user: session.user
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get user error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get user'
    })
  }
})
