<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <BaristaSidebar />

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p class="text-gray-600 mb-8">Scan customer's QR code to complete their order</p>

        <!-- Scanner Section -->
        <div class="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div class="text-center mb-6">
            <div class="w-32 h-32 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-2xl">
              <Icon name="mdi:qrcode-scan" class="w-20 h-20 text-amber-600" />
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Enter QR Code</h2>
            <p class="text-sm text-gray-600">Type or scan the QR code from customer's order</p>
          </div>

          <!-- Manual Input -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
              <input
                v-model="qrCode"
                type="text"
                placeholder="Enter QR code..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                @keyup.enter="handleScan"
              />
            </div>
            <button
              @click="handleScan"
              :disabled="!qrCode || scanning"
              class="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon name="mdi:check-circle" class="w-5 h-5" />
              <span>{{ scanning ? 'Scanning...' : 'Complete Order' }}</span>
            </button>
          </div>
        </div>

        <!-- Success Result -->
        <div v-if="scannedOrder" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:check-circle" class="w-7 h-7 text-green-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-green-900 mb-2">Order Completed!</h3>
              <div class="space-y-1 text-sm text-green-800">
                <p><span class="font-medium">Order Number:</span> {{ scannedOrder.orderNumber }}</p>
                <p><span class="font-medium">Customer:</span> {{ scannedOrder.user?.fullName }}</p>
                <p><span class="font-medium">Total:</span> Rp {{ formatPrice(scannedOrder.total) }}</p>
                <p><span class="font-medium">Completed At:</span> {{ formatDate(scannedOrder.updatedAt) }}</p>
              </div>
              <NuxtLink 
                :to="`/barista/orders/${scannedOrder.id}`"
                class="inline-flex items-center gap-2 mt-4 text-green-700 hover:text-green-800 font-medium"
              >
                <span>View Order Details</span>
                <Icon name="mdi:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Recent Completed Orders -->
        <div v-if="recentOrders.length > 0" class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Completed Orders</h2>
          <div class="space-y-3">
            <div v-for="order in recentOrders" :key="order.id"
              class="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-900">#{{ order.orderNumber }}</p>
                <p class="text-sm text-gray-600">{{ order.user?.fullName }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(order.updatedAt) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">Rp {{ formatPrice(order.total) }}</p>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'barista',
  layout: false
})

const router = useRouter()
const { logout } = useAuth()
const { scanQR, fetchOrders } = useBarista()
const { success: showSuccess, error: showError } = useToast()

const qrCode = ref('')
const scanning = ref(false)
const scannedOrder = ref<any>(null)
const recentOrders = ref<any[]>([])

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleScan = async () => {
  if (!qrCode.value.trim()) {
    showError('Please enter a QR code')
    return
  }

  scanning.value = true
  console.log('Scanning QR Code:', qrCode.value.trim())
  
  const result = await scanQR(qrCode.value.trim())
  console.log('Scan result:', result)
  
  if (result.success) {
    showSuccess('Order completed successfully!')
    scannedOrder.value = result.order
    qrCode.value = ''
    // Refresh recent orders
    await fetchRecentOrders()
    
    // Clear scanned order after 10 seconds
    setTimeout(() => {
      scannedOrder.value = null
    }, 10000)
  } else {
    console.error('Scan failed:', result.error)
    showError(result.error || 'Failed to scan QR code')
  }
  
  scanning.value = false
}

const fetchRecentOrders = async () => {
  const result = await fetchOrders('COMPLETED')
  if (result.success) {
    // Get last 5 completed orders
    recentOrders.value = result.orders.slice(0, 5)
  }
}

onMounted(async () => {
  await fetchRecentOrders()
})
</script>
