import type { H3Event } from 'h3'
import prisma from './prisma'

export async function requireAuth(event: H3Event, allowedRoles?: string[]) {
  const token = getCookie(event, 'session_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find session and include user
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          loyaltyPoint: true,
          avatar: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { token } })
    }
    
    deleteCookie(event, 'session_token')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  // Check role if specified
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions'
    })
  }

  return session.user
}

export async function optionalAuth(event: H3Event) {
  const token = getCookie(event, 'session_token')

  if (!token) {
    return null
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
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
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.user
  } catch (error) {
    return null
  }
}
