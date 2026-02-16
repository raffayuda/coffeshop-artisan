<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{ user?.fullName }}!</h1>
        <p class="text-gray-600 mt-2">Manage your orders, track loyalty points, and explore our menu</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Icon name="mdi:receipt" class="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1">Total Orders</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="mdi:star" class="w-6 h-6" />
            </div>
          </div>
          <p class="text-sm text-white/90 mb-1">Loyalty Points</p>
          <p class="text-3xl font-bold">{{ user?.loyaltyPoint || 0 }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="mdi:ticket-percent" class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1">Available Vouchers</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.availableVouchers }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NuxtLink to="/menu"
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-amber-500">
          <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="mdi:coffee" class="w-6 h-6 text-amber-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Order Now</h3>
          <p class="text-sm text-gray-600">Browse our menu</p>
        </NuxtLink>

        <NuxtLink to="/orders"
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-amber-500">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="mdi:history" class="w-6 h-6 text-blue-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Order History</h3>
          <p class="text-sm text-gray-600">Track your orders</p>
        </NuxtLink>

        <NuxtLink to="/loyalty"
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-amber-500">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="mdi:gift" class="w-6 h-6 text-purple-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Rewards</h3>
          <p class="text-sm text-gray-600">View vouchers</p>
        </NuxtLink>

        <NuxtLink to="/profile"
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-amber-500">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="mdi:account" class="w-6 h-6 text-gray-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Profile</h3>
          <p class="text-sm text-gray-600">Edit your profile</p>
        </NuxtLink>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <NuxtLink to="/orders" class="text-amber-600 hover:text-amber-700 font-medium text-sm">
              View All
            </NuxtLink>
          </div>
        </div>
        
        <div v-if="recentOrders.length === 0" class="p-12 text-center">
          <Icon name="mdi:inbox" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 mb-4">No orders yet</p>
          <NuxtLink to="/menu"
            class="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Start Ordering
          </NuxtLink>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div v-for="order in recentOrders.slice(0, 5)" :key="order.id" class="p-6 hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-gray-900">Order #{{ order.orderNumber }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <span :class="statusClasses(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ order.status }}
                </span>
                <p class="text-lg font-bold text-gray-900 mt-1">Rp {{ formatPrice(order.totalAmount) }}</p>
              </div>
            </div>
            <NuxtLink :to="`/orders/${order.id}`"
              class="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View Details →
            </NuxtLink>
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

const { user } = useAuth()
const { orders, fetchOrders } = useOrders()
const { vouchers, fetchVouchers } = useLoyalty()

const stats = ref({
  totalOrders: 0,
  availableVouchers: 0
})

const recentOrders = ref<any[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
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

onMounted(async () => {
  const ordersResult = await fetchOrders()
  if (ordersResult.success) {
    recentOrders.value = ordersResult.orders || []
    stats.value.totalOrders = recentOrders.value.length
  }

  const vouchersResult = await fetchVouchers()
  if (vouchersResult.success) {
    stats.value.availableVouchers = vouchersResult.vouchers?.length || 0
  }
})
</script>
