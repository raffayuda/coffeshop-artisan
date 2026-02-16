<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <BaristaSidebar />

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-5xl mx-auto">
        <!-- Back Button -->
        <NuxtLink to="/barista/dashboard" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <Icon name="mdi:arrow-left" class="w-5 h-5" />
          <span>Back to Dashboard</span>
        </NuxtLink>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent"></div>
        </div>

        <!-- Order Detail -->
        <div v-else-if="order" class="space-y-6">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Order #{{ order.orderNumber }}</h1>
                <p class="text-gray-500">{{ formatDate(order.createdAt) }}</p>
              </div>
              <span :class="statusClasses(order.status)" class="px-4 py-2 rounded-full text-sm font-medium">
                {{ order.status }}
              </span>
            </div>

            <!-- Customer Info -->
            <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-600">Customer</p>
                <p class="font-medium text-gray-900">{{ order.user.fullName }}</p>
                <p class="text-sm text-gray-600">{{ order.user.phone || order.user.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Order Type</p>
                <div class="flex items-center gap-2 mt-1">
                  <Icon :name="orderTypeIcon(order.type)" class="w-5 h-5 text-amber-600" />
                  <p class="font-medium text-gray-900">{{ order.type }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" 
                class="p-4 border border-gray-200 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 text-lg">{{ item.quantity }}x {{ item.menu?.name }}</h3>
                    <div class="mt-2 space-y-1">
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Size:</span> {{ item.size }}
                      </p>
                      <p v-if="item.iceLevel" class="text-sm text-gray-600">
                        <span class="font-medium">Ice Level:</span> {{ item.iceLevel }}
                      </p>
                      <p v-if="item.sugarLevel" class="text-sm text-gray-600">
                        <span class="font-medium">Sugar Level:</span> {{ item.sugarLevel }}
                      </p>
                      <div v-if="item.toppings && item.toppings.length > 0" class="text-sm text-gray-600">
                        <span class="font-medium">Toppings:</span>
                        <span class="ml-1">{{ item.toppings.map((t: any) => t.topping.name).join(', ') }}</span>
                      </div>
                      <p v-if="item.notes" class="text-sm text-amber-600 italic mt-2">
                        <Icon name="mdi:note-text" class="w-4 h-4 inline" />
                        Note: {{ item.notes }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-gray-900">Rp {{ formatPrice(item.price * item.quantity) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">Rp {{ formatPrice(order.subtotal) }}</span>
                </div>
                <div v-if="order.tax > 0" class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="text-gray-900">Rp {{ formatPrice(order.tax) }}</span>
                </div>
                <div v-if="order.deliveryFee > 0" class="flex justify-between text-sm">
                  <span class="text-gray-600">Delivery Fee</span>
                  <span class="text-gray-900">Rp {{ formatPrice(order.deliveryFee) }}</span>
                </div>
                <div v-if="order.discount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- Rp {{ formatPrice(order.discount) }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-200">
                  <span class="font-semibold text-gray-900">Total</span>
                  <span class="text-xl font-bold text-amber-600">Rp {{ formatPrice(order.total) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status History -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Status History</h2>
            <div class="space-y-3">
              <div v-for="history in order.statusHistory" :key="history.id" 
                class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ history.status }}</p>
                  <p class="text-sm text-gray-600">{{ history.notes }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(history.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Actions</h2>
            <div class="flex gap-3">
              <button v-if="order.status === 'PENDING'" @click="handleStartProcessing"
                :disabled="processing"
                class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Icon name="mdi:coffee-maker" class="w-5 h-5" />
                <span>{{ processing ? 'Processing...' : 'Start Making' }}</span>
              </button>
              <button v-if="order.status === 'PROCESSING'" @click="handleMarkReady"
                :disabled="processing"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Icon name="mdi:check-circle" class="w-5 h-5" />
                <span>{{ processing ? 'Processing...' : 'Mark as Ready' }}</span>
              </button>
              <button v-if="order.status === 'READY'"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                @click="$router.push('/barista/scanner')">
                <Icon name="mdi:qrcode-scan" class="w-5 h-5" />
                <span>Scan QR to Complete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-20">
          <Icon name="mdi:alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p class="text-gray-600">Order not found</p>
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

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const { getOrderDetail, updateOrderStatus } = useBarista()
const { success: showSuccess, error: showError } = useToast()

const order = ref<any>(null)
const loading = ref(true)
const processing = ref(false)

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClasses = (status: string) => {
  const classes: any = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'PROCESSING': 'bg-purple-100 text-purple-700',
    'READY': 'bg-green-100 text-green-700',
    'COMPLETED': 'bg-blue-100 text-blue-700',
    'CANCELLED': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const orderTypeIcon = (type: string) => {
  const icons: any = {
    'DINE_IN': 'mdi:silverware-fork-knife',
    'TAKEAWAY': 'mdi:shopping-outline',
    'DELIVERY': 'mdi:moped'
  }
  return icons[type] || 'mdi:shopping'
}

const handleStartProcessing = async () => {
  processing.value = true
  const result = await updateOrderStatus(order.value.id, 'PROCESSING', 'Barista started making the order')
  if (result.success) {
    showSuccess('Order processing started!')
    // Refresh order detail
    await fetchOrderDetail()
  } else {
    showError(result.error)
  }
  processing.value = false
}

const handleMarkReady = async () => {
  processing.value = true
  const result = await updateOrderStatus(order.value.id, 'READY', 'Order is ready for pickup')
  if (result.success) {
    showSuccess('Order marked as ready!')
    // Refresh order detail
    await fetchOrderDetail()
  } else {
    showError(result.error)
  }
  processing.value = false
}

const fetchOrderDetail = async () => {
  const orderId = route.params.id as string
  loading.value = true
  const result = await getOrderDetail(orderId)
  if (result.success) {
    order.value = result.order
  } else {
    showError(result.error)
  }
  loading.value = false
}

onMounted(async () => {
  await fetchOrderDetail()
})
</script>
