<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!orders || orders.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <Icon name="mdi:receipt-outline" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p class="text-gray-600 mb-6">Start ordering your favorite coffee!</p>
        <NuxtLink to="/menu" class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Browse Menu
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">
                  Order #{{ order.orderNumber }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span :class="statusClasses(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ order.status }}
                </span>
                <span class="text-lg font-bold text-gray-900">
                  Rp {{ formatPrice(order.total) }}
                </span>
              </div>
            </div>

            <!-- Order Items Preview -->
            <div class="mb-4 space-y-2">
              <div v-for="item in order.items?.slice(0, 2)" :key="item.id" class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:coffee" class="w-6 h-6 text-amber-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ item.menu?.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.quantity }}x - {{ item.size }}</p>
                </div>
                <p class="text-sm font-medium text-gray-900">
                  Rp {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
              <p v-if="order.items && order.items.length > 2" class="text-xs text-gray-500 ml-15">
                +{{ order.items.length - 2 }} more items
              </p>
            </div>

            <!-- Order Type & Payment -->
            <div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <Icon :name="orderTypeIcon(order.type)" class="w-4 h-4" />
                <span>{{ order.type }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="mdi:credit-card-outline" class="w-4 h-4" />
                <span>{{ order.payment?.paymentMethod || 'N/A' }}</span>
              </div>
              <span :class="paymentStatusClasses(order.payment?.status)">
                {{ order.payment?.status || 'PENDING' }}
              </span>
            </div>

            <!-- Ready for Pickup Notification -->
            <div v-if="order.status === 'READY'" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600" />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-green-900">Ready for Pickup!</p>
                  <p class="text-xs text-green-700">Click "View Details" to see your QR code</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t">
              <button @click="viewOrderDetail(order)" class="flex-1 text-center bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                {{ order.status === 'READY' ? 'Show QR Code' : 'View Details' }}
              </button>
              <button v-if="order.status === 'PENDING'" @click="openCancelModal(order)" class="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                Cancel Order
              </button>
              <button v-if="order.status === 'COMPLETED'" class="flex-1 text-center bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium py-2 px-4 rounded-lg transition-colors">
                Reorder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Order Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCancelModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeCancelModal">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Cancel Order</h3>
            <p class="text-gray-600 mb-6">
              Are you sure you want to cancel order <strong>#{{ selectedOrder?.orderNumber }}</strong>? 
              This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button @click="closeCancelModal" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                No, Keep Order
              </button>
              <button @click="confirmCancel" 
                :disabled="isCancelling"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isCancelling ? 'Cancelling...' : 'Yes, Cancel Order' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Order Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailModal && selectedOrder" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeDetailModal">
          <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-1">Order Details</h3>
                  <p class="text-sm text-gray-500">#{{ selectedOrder.orderNumber }}</p>
                </div>
                <button @click="closeDetailModal" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <!-- Content - Scrollable -->
            <div class="overflow-y-auto p-6 flex-1">
              <!-- Status & Date -->
              <div class="mb-6 p-4 bg-gray-50 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">Status</span>
                  <span :class="statusClasses(selectedOrder.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ selectedOrder.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">Order Date</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedOrder.createdAt) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Order Type</span>
                  <div class="flex items-center gap-1">
                    <Icon :name="orderTypeIcon(selectedOrder.type)" class="w-4 h-4 text-gray-600" />
                    <span class="text-sm font-medium text-gray-900">{{ selectedOrder.type }}</span>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="mb-6">
                <h4 class="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div class="space-y-3">
                  <div v-for="item in selectedOrder.items" :key="item.id" class="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="mdi:coffee" class="w-8 h-8 text-amber-600" />
                    </div>
                    <div class="flex-1">
                      <h5 class="font-medium text-gray-900">{{ item.menu?.name }}</h5>
                      <p class="text-sm text-gray-500">
                        {{ item.size }} | Ice: {{ item.iceLevel }} | Sugar: {{ item.sugarLevel }}
                      </p>
                      <p v-if="item.toppings && item.toppings.length > 0" class="text-xs text-gray-500 mt-1">
                        + {{ item.toppings.map((t: any) => t.topping?.name).join(', ') }}
                      </p>
                      <p v-if="item.notes" class="text-xs text-gray-500 italic mt-1">
                        Note: {{ item.notes }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900">{{ item.quantity }}x</p>
                      <p class="text-sm font-semibold text-amber-600">Rp {{ formatPrice(item.price * item.quantity) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Summary -->
              <div class="border-t border-gray-200 pt-4">
                <h4 class="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="text-gray-900">Rp {{ formatPrice(selectedOrder.subtotal) }}</span>
                  </div>
                  <div v-if="selectedOrder.tax > 0" class="flex justify-between">
                    <span class="text-gray-600">Tax</span>
                    <span class="text-gray-900">Rp {{ formatPrice(selectedOrder.tax) }}</span>
                  </div>
                  <div v-if="selectedOrder.deliveryFee > 0" class="flex justify-between">
                    <span class="text-gray-600">Delivery Fee</span>
                    <span class="text-gray-900">Rp {{ formatPrice(selectedOrder.deliveryFee) }}</span>
                  </div>
                  <div v-if="selectedOrder.discount > 0" class="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- Rp {{ formatPrice(selectedOrder.discount) }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-200">
                    <span class="font-semibold text-gray-900">Total</span>
                    <span class="font-bold text-lg text-amber-600">Rp {{ formatPrice(selectedOrder.total) }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Info -->
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center gap-2">
                  <Icon name="mdi:credit-card" class="w-5 h-5 text-blue-600" />
                  <div>
                    <p class="text-sm font-medium text-blue-900">{{ selectedOrder.payment?.paymentMethod || 'N/A' }}</p>
                    <p class="text-xs text-blue-700">Status: {{ selectedOrder.payment?.status || 'PENDING' }}</p>
                  </div>
                </div>
              </div>

              <!-- QR Code for Pickup (only show when READY) -->
              <div v-if="selectedOrder.status === 'READY' && selectedOrder.qrCode" class="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div class="text-center">
                  <div class="inline-flex items-center gap-2 mb-3">
                    <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600" />
                    <h4 class="font-semibold text-green-900">Order Ready for Pickup!</h4>
                  </div>
                  <p class="text-sm text-green-700 mb-4">Show this QR code to barista when picking up your order</p>
                  
                  <!-- QR Code Display -->
                  <div class="bg-white p-6 rounded-lg inline-block shadow-sm mb-4">
                    <div class="text-2xl font-mono font-bold text-gray-900 tracking-wider select-all">
                      {{ selectedOrder.qrCode }}
                    </div>
                  </div>
                  
                  <!-- Copy Button -->
                  <button @click="copyQRCode(selectedOrder.qrCode)" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Icon name="mdi:content-copy" class="w-5 h-5" />
                    <span>Copy QR Code</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200">
              <button @click="closeDetailModal" 
                class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { orders: ordersData, fetchOrders, cancelOrder: cancelOrderApi } = useOrders()
const { success, error: showError } = useToast()

const loading = ref(true)
const orders = ref<any[]>([])
const showCancelModal = ref(false)
const showDetailModal = ref(false)
const selectedOrder = ref<any>(null)
const isCancelling = ref(false)

onMounted(async () => {
  const result = await fetchOrders()
  if (result.success) {
    orders.value = result.orders
  }
  loading.value = false
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0'
  }
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

const paymentStatusClasses = (status: string) => {
  const classes: any = {
    'PENDING': 'text-yellow-600',
    'SUCCESS': 'text-green-600',
    'FAILED': 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

const orderTypeIcon = (type: string) => {
  const icons: any = {
    'DINE_IN': 'mdi:table-chair',
    'TAKEAWAY': 'mdi:bag-carry-on',
    'DELIVERY': 'mdi:moped'
  }
  return icons[type] || 'mdi:shopping'
}

const openCancelModal = (order: any) => {
  selectedOrder.value = order
  showCancelModal.value = true
}

const closeCancelModal = () => {
  if (!isCancelling.value) {
    showCancelModal.value = false
    selectedOrder.value = null
  }
}

const confirmCancel = async () => {
  if (!selectedOrder.value) return
  
  isCancelling.value = true
  const result = await cancelOrderApi(selectedOrder.value.id)
  
  if (result.success) {
    success('Order cancelled successfully!')
    // Refresh orders
    const refreshResult = await fetchOrders()
    if (refreshResult.success) {
      orders.value = refreshResult.orders
    }
    closeCancelModal()
  } else {
    showError(result.error || 'Failed to cancel order')
  }
  
  isCancelling.value = false
}

const viewOrderDetail = (order: any) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const copyQRCode = async (qrCode: string) => {
  try {
    await navigator.clipboard.writeText(qrCode)
    success('QR Code copied to clipboard!')
  } catch (error) {
    showError('Failed to copy QR Code')
  }
}
</script>

<style scoped>
/* Modal transitions */
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
