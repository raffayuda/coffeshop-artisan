<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-center mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span class="text-white text-3xl font-bold">{{ userInitial }}</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900">{{ user?.fullName }}</h2>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                {{ user?.role }}
              </span>
            </div>
            
            <!-- Loyalty Points -->
            <div class="border-t pt-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Loyalty Points</span>
                <span class="text-lg font-bold text-amber-600">{{ user?.loyaltyPoint || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <form @submit.prevent="updatePersonalInfo" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  v-model="formData.fullName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="formData.phoneNumber"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>
            </form>
          </div>

          <!-- Preferences -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Drink Preferences</h3>
            <form @submit.prevent="updatePreferences" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ice Level</label>
                <select v-model="preferences.iceLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option value="LESS">Less Ice</option>
                  <option value="NORMAL">Normal Ice</option>
                  <option value="EXTRA">Extra Ice</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sugar Level</label>
                <select v-model="preferences.sugarLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option value="LESS">Less Sugar</option>
                  <option value="NORMAL">Normal Sugar</option>
                  <option value="EXTRA">Extra Sugar</option>
                </select>
              </div>
              <button
                type="submit"
                :disabled="loadingPrefs"
                class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {{ loadingPrefs ? 'Saving...' : 'Save Preferences' }}
              </button>
            </form>
          </div>

          <!-- Change Password -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  v-model="passwordData.currentPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  v-model="passwordData.newPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  v-model="passwordData.confirmPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                :disabled="loadingPassword"
                class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {{ loadingPassword ? 'Changing...' : 'Change Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, updateProfile } = useAuth()

const userInitial = computed(() => {
  return user.value?.fullName?.charAt(0).toUpperCase() || 'U'
})

const formData = ref({
  fullName: user.value?.fullName || '',
  email: user.value?.email || '',
  phoneNumber: user.value?.phoneNumber || ''
})

const preferences = ref({
  iceLevel: 'NORMAL',
  sugarLevel: 'NORMAL'
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const loadingPrefs = ref(false)
const loadingPassword = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 3000)
}

const updatePersonalInfo = async () => {
  loading.value = true
  clearMessages()
  
  const result = await updateProfile(formData.value)
  loading.value = false
  
  if (result.success) {
    successMessage.value = 'Profile updated successfully!'
    clearMessages()
  } else {
    errorMessage.value = result.error
    clearMessages()
  }
}

const updatePreferences = async () => {
  loadingPrefs.value = true
  clearMessages()
  
  try {
    await $fetch('/api/auth/preferences', {
      method: 'PUT',
      body: preferences.value
    })
    successMessage.value = 'Preferences saved successfully!'
  } catch (error: any) {
    errorMessage.value = error.data?.error || 'Failed to save preferences'
  }
  
  loadingPrefs.value = false
  clearMessages()
}

const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    clearMessages()
    return
  }
  
  loadingPassword.value = true
  clearMessages()
  
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword
      }
    })
    successMessage.value = 'Password changed successfully!'
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error: any) {
    errorMessage.value = error.data?.error || 'Failed to change password'
  }
  
  loadingPassword.value = false
  clearMessages()
}

// Fetch user preferences on mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/preferences')
    if (response.preferences) {
      preferences.value = response.preferences
    }
  } catch (error) {
    console.error('Failed to fetch preferences')
  }
})
</script>
