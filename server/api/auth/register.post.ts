import prisma from '../../utils/prisma'
import { hashPassword, generateToken } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, fullName, phone } = body

    // Validate required fields
    if (!email || !password || !fullName) {
      throw createError({
        statusCode: 400,
        message: 'Email, password, and full name are required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid email format'
      })
    }

    // Validate password strength
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'Password must be at least 6 characters long'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          phone ? { phone } : { id: '' }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'User with this email or phone already exists'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with default role CUSTOMER
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    })

    // Create user preferences
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        sugarLevel: 'NORMAL',
        iceLevel: 'NORMAL'
      }
    })

    // Use nuxt-auth-utils to set user session
    // Only store essential user data
    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone || null,
      avatar: user.avatar || null,
      loyaltyPoint: 0
    }
    
    await setUserSession(event, {
      user: sessionUser,
      loggedInAt: Date.now()
    })

    return {
      success: true,
      user: sessionUser
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Registration error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to register user'
    })
  }
})
