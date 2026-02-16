<template>
    <div class="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
      <div class="p-6">
        <NuxtLink to="/" class="flex items-center space-x-3 mb-6 group">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
            <Icon name="mdi:coffee" class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="font-bold text-lg text-gray-900">Barista Panel</div>
            <div class="text-xs text-gray-500">Coffee Shop</div>
          </div>
        </NuxtLink>
        
        <nav class="space-y-2">
          <NuxtLink to="/barista/dashboard"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              route.path === '/barista/dashboard' ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
            ]">
            <Icon name="mdi:view-dashboard" class="w-5 h-5" />
            <span>Orders</span>
          </NuxtLink>
          <NuxtLink to="/barista/menu"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              route.path === '/barista/menu' ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
            ]">
            <Icon name="mdi:food" class="w-5 h-5" />
            <span>Menu</span>
          </NuxtLink>
          <NuxtLink to="/barista/scanner"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              route.path === '/barista/scanner' ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
            ]">
            <Icon name="mdi:qrcode-scan" class="w-5 h-5" />
            <span>QR Scanner</span>
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
const route = useRoute()
const { logout } = useAuth()
const handleLogout = async () => {
  await logout()
}
</script>