export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUserSession()

  // If no authenticated user, redirect to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
