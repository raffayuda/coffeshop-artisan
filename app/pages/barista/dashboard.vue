<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <BaristaSidebar />

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Barista Dashboard</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Pending</p>
                <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:clock-outline" class="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Processing</p>
                <p class="text-2xl font-bold text-purple-600">{{ stats.processing }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:coffee-maker" class="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Ready</p>
                <p class="text-2xl font-bold text-green-600">{{ stats.ready }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:check-circle" class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Today's Orders</p>
                <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:receipt" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.status"
                @click="activeTab = tab.status"
                :class="[
                  activeTab === tab.status
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ tab.label }}
                <span v-if="getOrdersByStatus(tab.status).length > 0"
                  :class="[
                    activeTab === tab.status ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600',
                    'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                  ]">
                  {{ getOrdersByStatus(tab.status).length }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Orders List -->
          <div class="p-6">
            <div v-if="filteredOrders.length === 0" class="text-center py-12">
              <Icon name="mdi:inbox" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500">No {{ activeTab.toLowerCase() }} orders</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="order in filteredOrders" :key="order.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Order #{{ order.orderNumber }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ formatTime(order.createdAt) }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span :class="orderTypeClasses(order.type)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ order.type }}
                      </span>
                      <span v-if="order.user" class="text-sm text-gray-600">
                        {{ order.user.fullName }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-amber-600">
                      Rp {{ formatPrice(order.total) }}
                    </p>
                  </div>
                </div>

                <!-- Order Items -->
                <div class="space-y-2 mb-4">
                  <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
                    <div>
                      <span class="font-medium">{{ item.quantity }}x {{ item.menu?.name }}</span>
                      <span class="text-gray-500 ml-2">{{ item.size }}</span>
                      <div v-if="item.iceLevel || item.sugarLevel" class="text-xs text-gray-500 mt-1">
                        <span v-if="item.iceLevel">Ice: {{ item.iceLevel }}</span>
                        <span v-if="item.sugarLevel" class="ml-2">Sugar: {{ item.sugarLevel }}</span>
                      </div>
                      <p v-if="item.notes" class="text-xs text-gray-600 italic mt-1">Note: {{ item.notes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <button v-if="order.status === 'PENDING'" @click="handleStartProcessing(order.id)"
                    class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Icon name="mdi:coffee-maker" class="w-5 h-5" />
                    <span>Start Making</span>
                  </button>
                  <button v-if="order.status === 'PROCESSING'" @click="handleMarkReady(order.id)"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Icon name="mdi:check-circle" class="w-5 h-5" />
                    <span>Mark as Ready</span>
                  </button>
                  <button @click="openDetailModal(order.id)"
                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2">
                    <Icon name="mdi:eye" class="w-5 h-5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeDetailModal">
          <div class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Order Details</h3>
                <p v-if="orderDetail" class="text-sm text-gray-500">#{{ orderDetail.orderNumber }}</p>
              </div>
              <button @click="closeDetailModal" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <!-- Loading -->
            <div v-if="loadingDetail" class="flex-1 flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
            </div>

            <!-- Content -->
            <div v-else-if="orderDetail" class="flex-1 overflow-y-auto p-6 space-y-6">
              <!-- Status & Customer Info -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Status</p>
                    <span :class="statusClasses(orderDetail.status)" class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium">
                      {{ orderDetail.status }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Customer</p>
                    <p class="font-medium text-gray-900 mt-1">{{ orderDetail.user?.fullName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Order Type</p>
                    <div class="flex items-center gap-2 mt-1">
                      <Icon :name="orderTypeIcon(orderDetail.type)" class="w-5 h-5 text-amber-600" />
                      <p class="font-medium text-gray-900">{{ orderDetail.type }}</p>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Created At</p>
                    <p class="font-medium text-gray-900 mt-1">{{ formatTime(orderDetail.createdAt) }}</p>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div class="space-y-3">
                  <div v-for="item in orderDetail.items" :key="item.id" class="p-4 border border-gray-200 rounded-lg">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <h5 class="font-semibold text-gray-900">{{ item.quantity }}x {{ item.menu?.name }}</h5>
                        <p class="text-sm text-gray-600 mt-1">Size: {{ item.size }}</p>
                        <div v-if="item.iceLevel || item.sugarLevel" class="text-sm text-gray-600 mt-1">
                          <span v-if="item.iceLevel">Ice: {{ item.iceLevel }}</span>
                          <span v-if="item.sugarLevel" class="ml-3">Sugar: {{ item.sugarLevel }}</span>
                        </div>
                        <div v-if="item.toppings && item.toppings.length > 0" class="text-sm text-gray-600 mt-1">
                          <span class="font-medium">Toppings:</span> {{ item.toppings.map((t: any) => t.topping.name).join(', ') }}
                        </div>
                        <p v-if="item.notes" class="text-sm text-amber-600 italic mt-2">
                          <Icon name="mdi:note-text" class="w-4 h-4 inline" /> {{ item.notes }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-gray-900">Rp {{ formatPrice(item.price * item.quantity) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Summary -->
              <div class="border-t border-gray-200 pt-4">
                <h4 class="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="text-gray-900">Rp {{ formatPrice(orderDetail.subtotal) }}</span>
                  </div>
                  <div v-if="orderDetail.tax > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">Tax</span>
                    <span class="text-gray-900">Rp {{ formatPrice(orderDetail.tax) }}</span>
                  </div>
                  <div v-if="orderDetail.deliveryFee > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">Delivery Fee</span>
                    <span class="text-gray-900">Rp {{ formatPrice(orderDetail.deliveryFee) }}</span>
                  </div>
                  <div v-if="orderDetail.discount > 0" class="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>- Rp {{ formatPrice(orderDetail.discount) }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-200">
                    <span class="font-semibold text-gray-900">Total</span>
                    <span class="text-xl font-bold text-amber-600">Rp {{ formatPrice(orderDetail.total) }}</span>
                  </div>
                </div>
              </div>

              <!-- QR Code Section (for READY orders) -->
              <div v-if="orderDetail.status === 'READY' && orderDetail.qrCode" class="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div class="text-center">
                  <div class="inline-flex items-center gap-2 mb-3">
                    <Icon name="mdi:qrcode" class="w-5 h-5 text-green-600" />
                    <h4 class="font-semibold text-green-900">Customer Pickup QR Code</h4>
                  </div>
                  <p class="text-sm text-green-700 mb-4">Customer will use this code for pickup verification</p>
                  
                  <!-- QR Code Display -->
                  <div class="bg-white p-6 rounded-lg inline-block shadow-sm mb-4">
                    <div class="text-2xl font-mono font-bold text-gray-900 tracking-wider select-all">
                      {{ orderDetail.qrCode }}
                    </div>
                  </div>
                  
                  <!-- Copy Button -->
                  <button @click="copyQRCode(orderDetail.qrCode)" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Icon name="mdi:content-copy" class="w-5 h-5" />
                    <span>Copy QR Code</span>
                  </button>
                </div>
              </div>

              <!-- Status History -->
              <div v-if="orderDetail.statusHistory && orderDetail.statusHistory.length > 0">
                <h4 class="font-semibold text-gray-900 mb-3">Status History</h4>
                <div class="space-y-2">
                  <div v-for="history in orderDetail.statusHistory" :key="history.id" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ history.status }}</p>
                      <p v-if="history.notes" class="text-sm text-gray-600">{{ history.notes }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ formatTime(history.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div v-if="orderDetail" class="p-6 border-t border-gray-200">
              <div class="flex gap-3">
                <button v-if="orderDetail.status === 'PENDING'" @click="handleStartProcessingFromModal"
                  class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Icon name="mdi:coffee-maker" class="w-5 h-5" />
                  <span>Start Making</span>
                </button>
                <button v-if="orderDetail.status === 'PROCESSING'" @click="handleMarkReadyFromModal"
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Icon name="mdi:check-circle" class="w-5 h-5" />
                  <span>Mark as Ready</span>
                </button>
                <button @click="closeDetailModal"
                  class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'barista',
  layout: false
})

const { user, logout } = useAuth()
const { orders, loading, fetchOrders, updateOrderStatus, getOrderDetail } = useBarista()
const { success: showSuccess, error: showError } = useToast()
const router = useRouter()

const activeTab = ref('PENDING')
const showDetailModal = ref(false)
const orderDetail = ref<any>(null)
const loadingDetail = ref(false)

const tabs = [
  { label: 'New Orders', status: 'PENDING' },
  { label: 'In Progress', status: 'PROCESSING' },
  { label: 'Ready', status: 'READY' },
  { label: 'All', status: 'all' }
]

const stats = computed(() => {
  return {
    pending: orders.value.filter((o: any) => o.status === 'PENDING').length,
    processing: orders.value.filter((o: any) => o.status === 'PROCESSING').length,
    ready: orders.value.filter((o: any) => o.status === 'READY').length,
    total: orders.value.length
  }
})

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter((o: any) => o.status === activeTab.value)
})

const getOrdersByStatus = (status: string) => {
  if (status === 'all') return orders.value
  return orders.value.filter((o: any) => o.status === status)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatTime = (date: string) => {
  const now = new Date()
  const orderTime = new Date(date)
  const diff = Math.floor((now.getTime() - orderTime.getTime()) / 60000) // minutes
  
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff} min ago`
  
  return orderTime.toLocaleTimeString('id-ID', {
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

const orderTypeClasses = (type: string) => {
  const classes: any = {
    'DINE_IN': 'bg-blue-100 text-blue-700',
    'TAKEAWAY': 'bg-green-100 text-green-700',
    'DELIVERY': 'bg-purple-100 text-purple-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

const orderTypeIcon = (type: string) => {
  const icons: any = {
    'DINE_IN': 'mdi:silverware-fork-knife',
    'TAKEAWAY': 'mdi:shopping-outline',
    'DELIVERY': 'mdi:moped'
  }
  return icons[type] || 'mdi:shopping'
}

const handleStartProcessing = async (orderId: string) => {
  const result = await updateOrderStatus(orderId, 'PROCESSING', 'Barista started preparing order')
  if (result.success) {
    showSuccess('Order processing started!')
    await fetchOrders('all')
    activeTab.value = 'PROCESSING'
  } else {
    showError(result.error)
  }
}

const handleMarkReady = async (orderId: string) => {
  const result = await updateOrderStatus(orderId, 'READY', 'Order is ready for pickup')
  if (result.success) {
    showSuccess('Order marked as ready!')
    await fetchOrders('all')
    activeTab.value = 'READY'
  } else {
    showError(result.error)
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}

const openDetailModal = async (orderId: string) => {
  showDetailModal.value = true
  loadingDetail.value = true
  orderDetail.value = null
  
  const result = await getOrderDetail(orderId)
  if (result.success) {
    orderDetail.value = result.order
  } else {
    showError(result.error)
    closeDetailModal()
  }
  loadingDetail.value = false
}

const closeDetailModal = () => {
  showDetailModal.value = false
  orderDetail.value = null
}

const copyQRCode = async (qrCode: string) => {
  try {
    await navigator.clipboard.writeText(qrCode)
    showSuccess('QR Code copied to clipboard!')
  } catch (error) {
    showError('Failed to copy QR Code')
  }
}

const handleStartProcessingFromModal = async () => {
  if (!orderDetail.value) return
  const result = await updateOrderStatus(orderDetail.value.id, 'PROCESSING', 'Barista started preparing order')
  if (result.success) {
    showSuccess('Order processing started!')
    await fetchOrders('all')
    closeDetailModal()
    activeTab.value = 'PROCESSING'
  } else {
    showError(result.error)
  }
}

const handleMarkReadyFromModal = async () => {
  if (!orderDetail.value) return
  const result = await updateOrderStatus(orderDetail.value.id, 'READY', 'Order is ready for pickup')
  if (result.success) {
    showSuccess('Order marked as ready!')
    await fetchOrders('all')
    closeDetailModal()
    activeTab.value = 'READY'
  } else {
    showError(result.error)
  }
}

// Auto refresh orders every 30 seconds
let refreshInterval: any = null

onMounted(async () => {
  await fetchOrders('all')
  refreshInterval = setInterval(() => {
    console.log('Auto refreshing orders...')
    fetchOrders('all')
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
