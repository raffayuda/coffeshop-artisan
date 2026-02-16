import prisma from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event, ['ADMIN'])
    const query = getQuery(event)
    const search = query.search as string
    const role = query.role as string

    const users = await prisma.user.findMany({
      where: {
        AND: [
          role ? { role: role as any } : {},
          search ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      users
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Get users error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get users'
    })
  }
})
