<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        <!-- Filter & Search -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search by name or email..." 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            </div>
            <select v-model="roleFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="all">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="BARISTA">Barista</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <p class="text-sm text-gray-600 mb-1">Total Users</p>
            <p class="text-3xl font-bold text-gray-900">{{ userStats.total }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <p class="text-sm text-gray-600 mb-1">Customers</p>
            <p class="text-3xl font-bold text-blue-600">{{ userStats.customers }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <p class="text-sm text-gray-600 mb-1">Baristas</p>
            <p class="text-3xl font-bold text-green-600">{{ userStats.baristas }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <p class="text-sm text-gray-600 mb-1">Admins</p>
            <p class="text-3xl font-bold text-purple-600">{{ userStats.admins }}</p>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div v-if="loading" class="p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
            <p class="text-gray-500 mt-4">Loading users...</p>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="p-12 text-center">
            <Icon name="mdi:account-group" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-600">No users found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty Points</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-semibold">{{ user.fullName[0] }}</span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ user.phone || '-' }}
                  </td>
                  <td class="px-6 py-4">
                    <select 
                      v-model="user.role" 
                      @change="handleRoleChange(user)"
                      :disabled="updatingUser === user.id"
                      class="text-sm px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-amber-500"
                      :class="roleClasses(user.role)">
                      <option value="CUSTOMER">Customer</option>
                      <option value="BARISTA">Barista</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ user.ordersCount || 0 }} orders
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-amber-600">
                    {{ user.loyaltyPoint }} pts
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="user.isActive" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                    <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                      Inactive
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td class="px-6 py-4">
                    <button 
                      v-if="user.isActive"
                      @click="handleDeactivate(user)"
                      :disabled="deletingUser === user.id"
                      class="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50">
                      Deactivate
                    </button>
                    <span v-else class="text-gray-400 text-sm">Deactivated</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

const { fetchAllUsers, updateUserRole, deleteUser } = useAdmin()
const { success, error: showError } = useToast()

const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('all')
const users = ref<any[]>([])
const updatingUser = ref<string | null>(null)
const deletingUser = ref<string | null>(null)

const userStats = computed(() => {
  return {
    total: users.value.length,
    customers: users.value.filter(u => u.role === 'CUSTOMER').length,
    baristas: users.value.filter(u => u.role === 'BARISTA').length,
    admins: users.value.filter(u => u.role === 'ADMIN').length
  }
})

const filteredUsers = computed(() => {
  let filtered = users.value

  // Filter by role
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(u => u.role === roleFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query))
    )
  }

  return filtered
})

const loadUsers = async () => {
  loading.value = true
  const result = await fetchAllUsers()
  loading.value = false
  
  if (result.success && result.users) {
    users.value = result.users
  } else {
    showError(result.error)
  }
}

const handleRoleChange = async (user: any) => {
  if (!confirm(`Change ${user.fullName}'s role to ${user.role}?`)) {
    // Revert on cancel
    loadUsers()
    return
  }

  updatingUser.value = user.id
  const result = await updateUserRole(user.id, user.role)
  updatingUser.value = null
  
  if (result.success) {
    success(`Role updated to ${user.role}`)
  } else {
    showError(result.error)
    loadUsers()
  }
}

const handleDeactivate = async (user: any) => {
  if (!confirm(`Are you sure you want to deactivate ${user.fullName}?`)) {
    return
  }

  deletingUser.value = user.id
  const result = await deleteUser(user.id)
  deletingUser.value = null
  
  if (result.success) {
    success('User deactivated successfully')
    loadUsers()
  } else {
    showError(result.error)
  }
}

const roleClasses = (role: string) => {
  const classes: any = {
    'CUSTOMER': 'bg-blue-100 text-blue-700',
    'BARISTA': 'bg-green-100 text-green-700',
    'ADMIN': 'bg-purple-100 text-purple-700'
  }
  return classes[role] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadUsers()
})
</script>
