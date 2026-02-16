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
    const { password: _, ...userWithoutPassword } = user
    
    await setUserSession(event, {
      user: userWithoutPassword,
      loggedInAt: Date.now()
    })

    return {
      success: true,
      user: userWithoutPassword
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
