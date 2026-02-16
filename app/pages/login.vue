<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-xl mb-4">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <!-- Alert -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-1 border-t border-gray-300"></div>
        <span class="px-4 text-sm text-gray-500">OR</span>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="text-orange-500 hover:text-orange-600 font-semibold">
            Sign Up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, user, userRole } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

// Check for success message in query params
onMounted(() => {
  if (route.query.registered === 'true') {
    successMessage.value = 'Registration successful! Please sign in.'
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await login(email.value, password.value)
  
  loading.value = false
  
  if (result.success) {
    // Use role from response directly for redirect
    const role = result.user.role
    
    // Use window.location for full page reload to ensure session is loaded
    if (role === 'ADMIN') {
      window.location.href = '/admin/dashboard'
    } else if (role === 'BARISTA') {
      window.location.href = '/barista/dashboard'
    } else {
      window.location.href = '/'
    }
  } else {
    error.value = result.error
  }
}
</script>
