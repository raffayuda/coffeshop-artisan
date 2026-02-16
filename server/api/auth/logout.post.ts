export default defineEventHandler(async (event) => {
  try {
    // Use nuxt-auth-utils to clear session
    await clearUserSession(event)

    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to logout'
    })
  }
})
