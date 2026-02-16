export const useAuth = () => {
  // Use nuxt-auth-utils session
  const { user: sessionUser, clear: clearSession } = useUserSession()
  
  // Keep backward compatibility with existing code
  const user = computed({
    get: () => sessionUser.value,
    set: (val) => {
      sessionUser.value = val
    }
  })
  
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)

  const register = async (data: {
    email: string
    password: string
    fullName: string
    phoneNumber: string
  }) => {
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data
      })
      
      // Force refresh the session from cookie
      if (import.meta.client) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Session is set by server via cookie
      // Manually update the user value to trigger reactivity immediately
      user.value = response.user
      
      // Load cart after successful registration
      const { loadCart } = useCart()
      await loadCart()
      
      return { success: true, user: response.user }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Registration failed' }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      // Session is set by server via cookie
      // Manually update the user value to trigger reactivity immediately
      user.value = response.user
      
      // Force refresh Nuxt data to reload session
      if (import.meta.client) {
        await refreshNuxtData()
      }
      
      // Load cart after successful login
      const { loadCart } = useCart()
      await loadCart()
      
      return { success: true, user: response.user }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      // Clear cart first (will clear state immediately, then database)
      const { clearCart } = useCart()
      await clearCart()
      
      // Then logout from server
      await $fetch('/api/auth/logout', { method: 'POST' })
      
      // Clear session
      await clearSession()
      
      navigateTo('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchUser = async () => {
    // nuxt-auth-utils automatically handles session persistence
    // This function is kept for backward compatibility
    // Session is already populated by nuxt-auth-utils
    return user.value
  }

  const updateProfile = async (data: any) => {
    try {
      const response = await $fetch('/api/auth/profile', {
        method: 'PUT',
        body: data
      })
      user.value = response.user
      return { success: true, user: response.user }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Update failed' }
    }
  }

  return {
    user,
    isAuthenticated,
    userRole,
    register,
    login,
    logout,
    fetchUser,
    updateProfile
  }
}
