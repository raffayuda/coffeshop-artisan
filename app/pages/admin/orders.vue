<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Order Management & Analytics</h1>
        
        <!-- Tabs -->
        <div class="mb-6 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="activeTab = 'orders'"
              :class="activeTab === 'orders' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              All Orders
            </button>
            <button 
              @click="activeTab = 'analytics'"
              :class="activeTab === 'analytics' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Analytics & Reports
            </button>
          </nav>
        </div>

        <!-- Orders Tab -->
        <div v-if="activeTab === 'orders'">
          <!-- Filters -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select v-model="filters.status" @change="loadOrders" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="READY">Ready</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input v-model="filters.dateFrom" @change="loadOrders" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input v-model="filters.dateTo" @change="loadOrders" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div v-if="statistics" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <p class="text-sm text-gray-600 mb-1">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900">{{ statistics.totalOrders }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p class="text-3xl font-bold text-green-600">Rp {{ formatPrice(statistics.totalRevenue) }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <p class="text-sm text-gray-600 mb-1">Status Breakdown</p>
              <div class="space-y-1 mt-2">
                <div v-for="(count, status) in statistics.statusCounts" :key="status" class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ status }}:</span>
                  <span class="font-medium">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders Table -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div v-if="loading" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
              <p class="text-gray-500 mt-4">Loading orders...</p>
            </div>
            
            <div v-else-if="orders.length === 0" class="p-12 text-center">
              <Icon name="mdi:receipt" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-600">No orders found</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ order.orderNumber }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ order.user.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ order.user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {{ order.items.length }} items
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="orderTypeClasses(order.type)" class="px-2 py-1 text-xs rounded-full">
                        {{ order.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="statusClasses(order.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="paymentStatusClasses(order.payment?.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ order.payment?.status || 'PENDING' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp {{ formatPrice(order.total) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {{ formatDate(order.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'">
          <!-- Revenue Report Period Selector -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700">Report Period:</label>
              <div class="flex gap-2">
                <button 
                  v-for="period in ['daily', 'weekly', 'monthly']" 
                  :key="period"
                  @click="loadRevenueReport(period)"
                  :class="selectedPeriod === period ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors">
                  {{ period }}
                </button>
              </div>
            </div>
          </div>

          <!-- Revenue Chart -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <div v-if="loadingRevenue" class="py-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            </div>
            <div v-else-if="revenueData.length === 0" class="py-12 text-center text-gray-500">
              No data available
            </div>
            <div v-else class="space-y-3">
              <div v-for="item in revenueData" :key="item.date" class="flex items-center gap-4">
                <div class="w-24 text-sm text-gray-600">{{ item.date }}</div>
                <div class="flex-1 bg-gray-100 rounded-full h-8 relative">
                  <div 
                    :style="{ width: `${(item.revenue / maxRevenue * 100)}%` }"
                    class="bg-gradient-to-r from-amber-600 to-orange-600 h-full rounded-full flex items-center justify-end px-3">
                    <span class="text-white text-sm font-medium">Rp {{ formatPrice(item.revenue) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Menu Sales Analytics -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Best Selling Menu</h2>
            <div v-if="loadingAnalytics" class="py-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            </div>
            <div v-else-if="menuAnalytics.length === 0" class="py-12 text-center text-gray-500">
              No data available
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Menu</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty Sold</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(item, index) in menuAnalytics" :key="item.menuId">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">#{{ index + 1 }}</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ item.menuName }}</td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {{ item.category }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ item.ordersCount }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ item.quantitySold }}</td>
                    <td class="px-4 py-3 text-sm font-medium text-green-600">
                      Rp {{ formatPrice(item.totalRevenue) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

const { fetchOrders, fetchRevenueReport, fetchMenuAnalytics } = useAdmin()

const activeTab = ref('orders')
const loading = ref(false)
const loadingRevenue = ref(false)
const loadingAnalytics = ref(false)

const filters = ref({
  status: 'all',
  dateFrom: '',
  dateTo: ''
})

const orders = ref<any[]>([])
const statistics = ref<any>(null)
const selectedPeriod = ref('daily')
const revenueData = ref<any[]>([])
const menuAnalytics = ref<any[]>([])

const maxRevenue = computed(() => {
  if (revenueData.value.length === 0) return 0
  return Math.max(...revenueData.value.map(d => d.revenue))
})

const loadOrders = async () => {
  loading.value = true
  const params: any = {}
  
  if (filters.value.status !== 'all') {
    params.status = filters.value.status
  }
  if (filters.value.dateFrom) {
    params.dateFrom = filters.value.dateFrom
  }
  if (filters.value.dateTo) {
    params.dateTo = filters.value.dateTo
  }

  const result = await fetchOrders(params)
  loading.value = false
  
  if (result.success && result.data) {
    orders.value = result.data.orders || []
    statistics.value = result.data.statistics || null
  }
}

const loadRevenueReport = async (period: string) => {
  selectedPeriod.value = period
  loadingRevenue.value = true
  const result = await fetchRevenueReport(period)
  loadingRevenue.value = false
  
  if (result.success && result.data) {
    revenueData.value = result.data
  }
}

const loadMenuAnalytics = async () => {
  loadingAnalytics.value = true
  const result = await fetchMenuAnalytics()
  loadingAnalytics.value = false
  
  if (result.success && result.analytics) {
    menuAnalytics.value = result.analytics
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price || 0)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClasses = (status: string) => {
  const classes: any = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'PROCESSING': 'bg-blue-100 text-blue-700',
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

const paymentStatusClasses = (status: string) => {
  const classes: any = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'SUCCESS': 'bg-green-100 text-green-700',
    'FAILED': 'bg-red-100 text-red-700',
    'REFUNDED': 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

watch(activeTab, (newTab) => {
  if (newTab === 'analytics') {
    if (revenueData.value.length === 0) {
      loadRevenueReport('daily')
    }
    if (menuAnalytics.value.length === 0) {
      loadMenuAnalytics()
    }
  }
})

onMounted(() => {
  loadOrders()
})
</script>
