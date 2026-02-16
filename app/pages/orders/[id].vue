<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        <span>Back to Orders</span>
      </button>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
      </div>

      <div v-else-if="order" class="space-y-6">
        <!-- Order Header -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">
                Order #{{ order.orderNumber }}
              </h1>
              <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span :class="statusClasses(order.status)" class="px-4 py-2 rounded-full text-sm font-medium">
              {{ order.status }}
            </span>
          </div>

          <!-- Order Progress Tracker -->
          <div class="mt-6">
            <div class="flex items-center justify-between">
              <div v-for="(step, index) in orderSteps" :key="step.status"
                class="flex-1 relative"
                :class="{ 'flex-none': index === orderSteps.length - 1 }">
                
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors"
                    :class="isStepActive(step.status) ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500'">
                    <Icon :name="step.icon" class="w-5 h-5" />
                  </div>
                  <p class="text-xs text-center font-medium"
                    :class="isStepActive(step.status) ? 'text-amber-600' : 'text-gray-500'">
                    {{ step.label }}
                  </p>
                </div>
                
                <div v-if="index < orderSteps.length - 1"
                  class="absolute top-5 left-1/2 w-full h-1"
                  :class="isStepConnected(index) ? 'bg-amber-600' : 'bg-gray-200'">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code (if order is ready) -->
        <div v-if="order.status === 'READY'" class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-sm p-6 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Your order is ready!</h3>
          <p class="text-sm text-gray-600 mb-4">Show this QR code to collect your order</p>
          <div class="inline-block p-4 bg-white rounded-lg">
            <!-- QR Code would go here -->
            <div class="w-48 h-48 bg-gray-100 flex items-center justify-center">
              <Icon name="mdi:qrcode" class="w-32 h-32 text-gray-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-amber-600 mt-4">{{ order.orderNumber }}</p>
        </div>

        <!-- Order Items -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex gap-4">
              <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="mdi:coffee" class="w-8 h-8 text-amber-600" />
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ item.menu?.name }}</h4>
                <p class="text-sm text-gray-600">Size: {{ item.size }}</p>
                <p v-if="item.iceLevel" class="text-sm text-gray-600">Ice: {{ item.iceLevel }}</p>
                <p v-if="item.sugarLevel" class="text-sm text-gray-600">Sugar: {{ item.sugarLevel }}</p>
                <p v-if="item.notes" class="text-sm text-gray-600 italic">Note: {{ item.notes }}</p>
                
                <!-- Toppings -->
                <div v-if="item.toppings && item.toppings.length > 0" class="mt-1">
                  <p class="text-xs text-gray-500">
                    Toppings: {{ item.toppings.map((t: any) => t.topping.name).join(', ') }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">{{ item.quantity }}x</p>
                <p class="font-semibold text-gray-900">Rp {{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">Rp {{ formatPrice(order.subtotal) }}</span>
            </div>
            <div v-if="order.discount > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Discount</span>
              <span class="font-medium text-green-600">-Rp {{ formatPrice(order.discount) }}</span>
            </div>
            <div v-if="order.tax > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium">Rp {{ formatPrice(order.tax) }}</span>
            </div>
            <div class="border-t pt-2 flex justify-between">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="font-bold text-amber-600 text-lg">Rp {{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Payment Method</span>
              <span class="font-medium">{{ order.payment?.paymentMethod || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Payment Status</span>
              <span :class="paymentStatusClasses(order.payment?.status)">
                {{ order.payment?.status || 'PENDING' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Order Type</span>
              <span class="font-medium">{{ order.orderType }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Address (if applicable) -->
        <div v-if="order.orderType === 'DELIVERY' && order.address" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <p class="text-gray-600">{{ order.address.recipientName }}</p>
          <p class="text-gray-600">{{ order.address.recipientPhone }}</p>
          <p class="text-gray-600 mt-2">{{ order.address.fullAddress }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const orderId = route.params.id as string

const { fetchOrderById } = useOrders()
const loading = ref(true)
const order = ref<any>(null)

const orderSteps = [
  { status: 'PENDING', label: 'Placed', icon: 'mdi:receipt' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: 'mdi:check-circle' },
  { status: 'PROCESSING', label: 'Preparing', icon: 'mdi:coffee-maker' },
  { status: 'READY', label: 'Ready', icon: 'mdi:check-all' },
  { status: 'COMPLETED', label: 'Completed', icon: 'mdi:emoticon-happy' }
]

const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED']

const isStepActive = (stepStatus: string) => {
  if (!order.value) return false
  const currentIndex = statusOrder.indexOf(order.value.status)
  const stepIndex = statusOrder.indexOf(stepStatus)
  return stepIndex <= currentIndex
}

const isStepConnected = (index: number) => {
  if (!order.value) return false
  const currentIndex = statusOrder.indexOf(order.value.status)
  return index < currentIndex
}

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
    'PENDING': 'text-yellow-600 font-medium',
    'SUCCESS': 'text-green-600 font-medium',
    'FAILED': 'text-red-600 font-medium'
  }
  return classes[status] || 'text-gray-600'
}

onMounted(async () => {
  const result = await fetchOrderById(orderId)
  if (result.success) {
    order.value = result.order
  }
  loading.value = false
})
</script>
