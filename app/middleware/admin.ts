export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUserSession()

  // Check if user is authenticated and is admin
  if (!user.value || user.value.role !== 'ADMIN') {
    return navigateTo('/')
  }
})
