<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:receipt" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
            <p class="text sm text-green-600 mt-2">{{ stats.ordersToday }} today</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:cash" class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatPrice(stats.totalRevenue) }}</p>
            <p class="text-sm text-green-600 mt-2">{{ formatPrice(stats.revenueToday) }} today</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:account-group" class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Total Customers</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalCustomers }}</p>
            <p class="text-sm text-blue-600 mt-2">{{ stats.newCustomers }} new this week</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:coffee" class="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Menu Items</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalMenus }}</p>
            <p class="text-sm text-gray-600 mt-2">{{ stats.activeMenus }} active</p>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow-sm mb-8">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <NuxtLink to="/admin/orders" class="text-amber-600 hover:text-amber-700 font-medium text-sm">
                View All
              </NuxtLink>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="order in recentOrders.slice(0, 10)" :key="order.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ order.orderNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ order.user?.fullName || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="orderTypeClasses(order.orderType)" class="px-2 py-1 text-xs rounded-full">
                      {{ order.orderType }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="statusClasses(order.status)" class="px-2 py-1 text-xs rounded-full">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rp {{ formatPrice(order.totalAmount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatTime(order.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink to="/admin/menu" class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="mdi:food" class="w-6 h-6 text-amber-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Menu</h3>
            <p class="text-sm text-gray-600">Add, edit, or remove menu items</p>
          </NuxtLink>

          <NuxtLink to="/admin/vouchers" class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="mdi:ticket-percent" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Vouchers & Promos</h3>
            <p class="text-sm text-gray-600">Create and manage promotions</p>
          </NuxtLink>

          <NuxtLink to="/admin/inventory" class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="mdi:package-variant" class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Inventory</h3>
            <p class="text-sm text-gray-600">Monitor and manage stock levels</p>
          </NuxtLink>
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

const { fetchAllOrders, fetchOrderStats } = useAdmin()

const stats = ref({
  totalOrders: 0,
  ordersToday: 0,
  totalRevenue: 0,
  revenueToday: 0,
  totalCustomers: 0,
  newCustomers: 0,
  totalMenus: 0,
  activeMenus: 0
})

const recentOrders = ref<any[]>([])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClasses = (status: string) => {
  const classes: any = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'CONFIRMED': 'bg-blue-100 text-blue-700',
    'PROCESSING': 'bg-purple-100 text-purple-700',
    'READY': 'bg-green-100 text-green-700',
    'COMPLETED': 'bg-gray-100 text-gray-700',
    'CANCELLED': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const orderTypeClasses = (type: string) => {
  const classes: any = {
    'DINE_IN': 'bg-blue-100 text-blue-700',
    'TAKEAWAY': 'bg-green-100 text-green-700',
    'DELIVERY': 'bg-purple-100 text-purple-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

onMounted(async () => {
  // Fetch statistics
  const statsResult = await fetchOrderStats()
  if (statsResult.success && statsResult.stats) {
    stats.value = statsResult.stats
  }

  // Fetch recent orders
  const ordersResult = await fetchAllOrders()
  if (ordersResult.success && ordersResult.orders) {
    recentOrders.value = ordersResult.orders
  }
})
</script>
