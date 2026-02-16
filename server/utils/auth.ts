import type { H3Event } from 'h3'

/**
 * Require authentication using nuxt-auth-utils
 * @param event H3Event
 * @param allowedRoles Optional array of allowed roles
 * @returns User object from session
 */
export async function requireAuth(event: H3Event, allowedRoles?: string[]) {
  const session = await getUserSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const user = session.user as any

  // Check role if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions'
    })
  }

  return user
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
    return null
  }
}
