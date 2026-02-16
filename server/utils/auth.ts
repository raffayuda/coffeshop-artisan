import type { H3Event } from 'h3'

/**
 * Require authentication using nuxt-auth-utils
 * @param event H3Event
 * @param allowedRoles Optional array of allowed roles
 * @returns User object from session
 */
export async function requireAuth(event: H3Event, allowedRoles?: string[]) {
  try {
    const session = await getUserSession(event)

    // Debug logging for production
    if (!session || !session.user) {
      console.error('[requireAuth] No session or user found', {
        hasSession: !!session,
        sessionKeys: session ? Object.keys(session) : [],
        path: event.path
      })
      
      throw createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    const user = session.user as any

    // Check role if specified
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.error('[requireAuth] Insufficient permissions', {
        userRole: user.role,
        allowedRoles,
        path: event.path
      })
      
      throw createError({
        statusCode: 403,
        message: 'Insufficient permissions'
      })
    }

    return user
  } catch (error: any) {
    // Re-throw if already an H3Error
    if (error.statusCode) {
      throw error
    }
    
    console.error('[requireAuth] Unexpected error:', error)
    throw createError({
      statusCode: 500,
      message: 'Authentication error'
    })
  }
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 * @param event H3Event
 * @returns User object or null
 */
export async function optionalAuth(event: H3Event) {
  try {
    const session = await getUserSession(event)

    if (!session || !session.user) {
      return null
    }

    return session.user as any
  } catch (error) {
    console.error('[optionalAuth] Error getting session:', error)
    return null
  }
}
