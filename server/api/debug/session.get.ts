export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    const cookies = parseCookies(event)
    
    return {
      success: true,
      hasSession: !!session,
      hasUser: !!session?.user,
      user: session?.user || null,
      cookies: Object.keys(cookies),
      headers: {
        cookie: getHeader(event, 'cookie') || 'none',
        userAgent: getHeader(event, 'user-agent') || 'none'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
