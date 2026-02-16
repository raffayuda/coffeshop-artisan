<template>
  <div class="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
    <div class="p-6">
      <NuxtLink to="/" class="flex items-center space-x-3 mb-6 group">
        <div class="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
          <Icon name="mdi:coffee" class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="font-bold text-lg text-gray-900">Admin Panel</div>
          <div class="text-xs text-gray-500">Coffee Shop</div>
        </div>
      </NuxtLink>
      
      <nav class="space-y-2">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          active-class="bg-amber-100 text-amber-700 font-medium"
          exact-active-class="bg-amber-100 text-amber-700 font-medium"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
        
        <button @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4">
          <Icon name="mdi:logout" class="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'mdi:view-dashboard' },
  { label: 'Orders', path: '/admin/orders', icon: 'mdi:receipt' },
  { label: 'Menu', path: '/admin/menu', icon: 'mdi:food' },
  { label: 'Users', path: '/admin/users', icon: 'mdi:account-group' },
  { label: 'Inventory', path: '/admin/inventory', icon: 'mdi:package-variant' },
  { label: 'Vouchers', path: '/admin/vouchers', icon: 'mdi:ticket-percent' },
  { label: 'Settings', path: '/admin/settings', icon: 'mdi:cog' }
]

const handleLogout = async () => {
  await logout()
}
</script>
