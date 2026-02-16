export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUserSession()

  // Check if user is authenticated and is barista
  if (!user.value || user.value.role !== 'BARISTA') {
    return navigateTo('/')
  }
})
