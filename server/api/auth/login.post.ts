import prisma from '../../utils/prisma'
import { verifyPassword } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Use nuxt-auth-utils to set user session
    // Only store essential user data to avoid cookie size limit (4KB)
    const { password: _, ...userWithoutPassword } = user
    
    const sessionUser = {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      fullName: userWithoutPassword.fullName,
      role: userWithoutPassword.role,
      phone: userWithoutPassword.phone || null,
      avatar: userWithoutPassword.avatar || null,
      loyaltyPoint: userWithoutPassword.loyaltyPoint || 0
    }
    
    await setUserSession(event, {
      user: sessionUser,
      loggedInAt: Date.now()
    })

    console.log('[Login] Session set for user:', {
      userId: sessionUser.id,
      email: sessionUser.email,
      role: sessionUser.role
    })

    return {
      success: true,
      user: sessionUser
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to login'
    })
  }
})
