<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Modern Cart Header -->
        <section class="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
            <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-4">
                    <Icon name="mdi:shopping" class="w-5 h-5" />
                    <span class="text-sm font-medium">Shopping Cart</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-3">
                    Review Your Order
                </h1>
                <p class="text-white/90 text-lg">
                    {{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }} ready for checkout
                </p>
            </div>
        </section>

        <!-- Cart Content -->
        <section class="py-12">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <!-- Warning for Invalid Items -->
                <div v-if="cartItems.length > 0 && hasInvalidItems" class="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div class="flex items-start">
                        <Icon name="mdi:alert" class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div class="flex-1">
                            <h3 class="text-sm font-semibold text-yellow-800 mb-1">Invalid Items Detected</h3>
                            <p class="text-sm text-yellow-700 mb-3">
                                Some items in your cart are from an older version and cannot be processed. Please remove them and add new items.
                            </p>
                            <button @click="removeInvalidItems"
                                class="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Remove Invalid Items
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty Cart -->
                <div v-if="cartItems.length === 0" class="text-center py-20">
                    <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="mdi:cart-off" class="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p class="text-gray-600 mb-8 text-lg">Add some delicious items from our menu!</p>
                    <NuxtLink to="/menu" class="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <Icon name="mdi:silverware-fork-knife" class="w-5 h-5" />
                        <span>Browse Menu</span>
                    </NuxtLink>
                </div>

                <!-- Cart Items -->
                <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Items List -->
                    <div class="lg:col-span-2 space-y-4">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-gray-900">Cart Items ({{ cartCount }})</h2>
                            <button @click="clearCart"
                                class="text-red-500 hover:text-red-700 transition-colors duration-300 text-sm font-medium flex items-center space-x-2">
                                <Icon name="mdi:delete-outline" class="w-5 h-5" />
                                <span>Clear All</span>
                            </button>
                        </div>

                        <TransitionGroup name="cart-list" tag="div" class="space-y-4">
                            <div v-for="item in cartItems" :key="item.id" 
                                class="bg-white p-6 rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                                <div class="flex gap-6">
                                    <!-- Product Image -->
                                    <div class="relative flex-shrink-0">
                                        <img :src="item.image" :alt="item.name"
                                            class="w-32 h-32 object-cover rounded-xl ring-2 ring-gray-100">
                                        <button @click="openDetailModal(item)"
                                            class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors shadow-md">
                                            <Icon name="mdi:eye" class="w-4 h-4 text-amber-600" />
                                        </button>
                                    </div>

                                    <!-- Product Info -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 class="text-xl font-bold text-gray-900 mb-1">{{ item.name }}</h3>
                                                <!-- Customization Details -->
                                                <p v-if="item.customization" class="text-sm text-gray-600 mb-2">
                                                    {{ item.customization }}
                                                </p>
                                                <p class="text-amber-600 font-bold text-2xl">{{ formatPrice(item.price) }}</p>
                                            </div>
                                            <button @click="removeFromCart(item.id)"
                                                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                                aria-label="Remove item">
                                                <Icon name="mdi:trash-can-outline" class="w-6 h-6" />
                                            </button>
                                        </div>

                                        <!-- Quantity Controls -->
                                        <div class="flex items-center justify-between mt-4">
                                            <div class="flex items-center space-x-3">
                                                <span class="text-gray-600 font-medium text-sm">Quantity:</span>
                                                <div class="flex items-center bg-gray-100 rounded-xl">
                                                    <button @click="updateQuantity(item.id, item.quantity - 1)"
                                                        class="p-2.5 hover:bg-gray-200 rounded-l-xl transition-colors"
                                                        aria-label="Decrease quantity">
                                                        <Icon name="mdi:minus" class="w-5 h-5 text-gray-700" />
                                                    </button>
                                                    <span class="px-6 text-gray-900 font-bold text-lg">{{ item.quantity }}</span>
                                                    <button @click="updateQuantity(item.id, item.quantity + 1)"
                                                        class="p-2.5 hover:bg-gray-200 rounded-r-xl transition-colors"
                                                        aria-label="Increase quantity">
                                                        <Icon name="mdi:plus" class="w-5 h-5 text-gray-700" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-sm text-gray-500 mb-1">Subtotal</p>
                                                <p class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                                    {{ formatPrice(item.price * item.quantity) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>

                    <!-- Order Summary -->
                    <div class="lg:col-span-1">
                        <div class="bg-white p-8 rounded-2xl border border-gray-200 sticky top-24 shadow-lg">
                            <h3 class="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

                            <div class="space-y-4 mb-6">
                                <div class="flex justify-between text-gray-600">
                                    <span>Subtotal ({{ cartCount }} items)</span>
                                    <span class="font-semibold">{{ formatPrice(cartTotal) }}</span>
                                </div>
                                <div class="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span class="font-semibold">{{ formatPrice(cartTotal * 0.1) }}</span>
                                </div>
                                <div class="flex justify-between text-gray-600">
                                    <span>Delivery</span>
                                    <span class="text-green-600 font-semibold">FREE</span>
                                </div>
                                <div class="border-t border-gray-200 pt-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-lg font-semibold text-gray-900">Total</span>
                                        <span class="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                            {{ formatPrice(cartTotal * 1.1) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button @click="openPaymentModal" 
                                class="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 mb-3">
                                <Icon name="mdi:credit-card" class="w-5 h-5" />
                                <span>Proceed to Payment</span>
                            </button>

                            <NuxtLink to="/menu" 
                                class="w-full text-center block py-3 text-gray-600 hover:text-amber-600 font-medium transition-colors">
                                Continue Shopping
                            </NuxtLink>

                            <!-- Promo Code -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <label class="block text-sm font-semibold text-gray-900 mb-3">
                                    Have a promo code?
                                </label>
                                <div class="flex space-x-2">
                                    <input type="text" placeholder="Enter code" 
                                        class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm">
                                    <button class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <!-- Trust Badges -->
                            <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                <div class="flex items-center space-x-3 text-sm text-gray-600">
                                    <Icon name="mdi:shield-check" class="w-5 h-5 text-green-500" />
                                    <span>Secure Payment</span>
                                </div>
                                <div class="flex items-center space-x-3 text-sm text-gray-600">
                                    <Icon name="mdi:truck-fast" class="w-5 h-5 text-blue-500" />
                                    <span>Fast Delivery</span>
                                </div>
                                <div class="flex items-center space-x-3 text-sm text-gray-600">
                                    <Icon name="mdi:cash-refund" class="w-5 h-5 text-amber-500" />
                                    <span>Money Back Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Payment Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showPaymentModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closePaymentModal">
                    <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl my-8 relative max-h-[90vh] flex flex-col">
                        <!-- Close Button -->
                        <button @click="closePaymentModal" :disabled="isProcessing"
                            class="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-gray-100 transition-all shadow-lg">
                            <Icon name="mdi:close" class="w-5 h-5 text-gray-700" />
                        </button>
                        
                        <!-- Scrollable Content -->
                        <div class="overflow-y-auto p-8 pt-12">
                        <!-- Modal Header -->
                        <div class="text-center mb-6">
                            <div class="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="mdi:credit-card-outline" class="w-8 h-8 text-white" />
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h3>
                            <p class="text-gray-600">Complete your order</p>
                        </div>

                        <!-- Payment Details -->
                        <div class="bg-gray-50 rounded-2xl p-6 mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-gray-600">Order Total</span>
                                <span class="text-2xl font-bold text-gray-900">{{ formatPrice(cartTotal * 1.1) }}</span>
                            </div>
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                                <Icon name="mdi:information" class="w-4 h-4" />
                                <span>Includes tax & delivery</span>
                            </div>
                        </div>

                        <!-- Order Type Selection -->
                        <div class="mb-6">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">Order Type</h4>
                            <div class="space-y-3">
                                <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-500 transition-colors"
                                    :class="selectedOrderType === 'DINE_IN' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'">
                                    <input type="radio" v-model="selectedOrderType" value="DINE_IN" class="w-5 h-5 text-amber-600">
                                    <Icon name="mdi:silverware-fork-knife" class="w-6 h-6 mx-3 text-gray-600" />
                                    <span class="font-medium text-gray-900">Dine In</span>
                                </label>
                                <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-500 transition-colors"
                                    :class="selectedOrderType === 'TAKEAWAY' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'">
                                    <input type="radio" v-model="selectedOrderType" value="TAKEAWAY" class="w-5 h-5 text-amber-600">
                                    <Icon name="mdi:shopping-outline" class="w-6 h-6 mx-3 text-gray-600" />
                                    <span class="font-medium text-gray-900">Take Away</span>
                                </label>
                                <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-500 transition-colors"
                                    :class="selectedOrderType === 'DELIVERY' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'">
                                    <input type="radio" v-model="selectedOrderType" value="DELIVERY" class="w-5 h-5 text-amber-600">
                                    <Icon name="mdi:moped" class="w-6 h-6 mx-3 text-gray-600" />
                                    <span class="font-medium text-gray-900">Delivery</span>
                                </label>
                            </div>
                        </div>

                        <!-- Payment Method Selection -->
                        <div class="mb-6">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">Payment Method</h4>
                            <div class="space-y-3">
                                <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-500 transition-colors"
                                    :class="selectedPaymentMethod === 'CARD' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'">
                                    <input type="radio" v-model="selectedPaymentMethod" value="CARD" class="w-5 h-5 text-amber-600">
                                    <Icon name="mdi:credit-card" class="w-6 h-6 mx-3 text-gray-600" />
                                    <span class="font-medium text-gray-900">Credit Card</span>
                                </label>
                                <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-500 transition-colors"
                                    :class="selectedPaymentMethod === 'E_WALLET' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'">
                                    <input type="radio" v-model="selectedPaymentMethod" value="E_WALLET" class="w-5 h-5 text-amber-600">
                                    <Icon name="mdi:wallet" class="w-6 h-6 mx-3 text-gray-600" />
                                    <span class="font-medium text-gray-900">E-Wallet</span>
                                </label>
                                <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-500 transition-colors"
                                    :class="selectedPaymentMethod === 'CASH' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'">
                                    <input type="radio" v-model="selectedPaymentMethod" value="CASH" class="w-5 h-5 text-amber-600">
                                    <Icon name="mdi:cash" class="w-6 h-6 mx-3 text-gray-600" />
                                    <span class="font-medium text-gray-900">Cash</span>
                                </label>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="space-y-3">
                            <button @click="processPayment" :disabled="isProcessing"
                                class="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                                :class="{ 'opacity-50 cursor-not-allowed': isProcessing }">
                                <Icon v-if="isProcessing" name="mdi:loading" class="w-5 h-5 animate-spin" />
                                <Icon v-else name="mdi:check-circle" class="w-5 h-5" />
                                <span>{{ isProcessing ? 'Processing...' : 'Confirm Payment' }}</span>
                            </button>
                            <button @click="closePaymentModal" :disabled="isProcessing"
                                class="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Cancel
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Detail Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showDetailModal && selectedItem" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="closeDetailModal">
                    <div class="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl my-8">
                        <!-- Close Button -->
                        <button @click="closeDetailModal"
                            class="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all shadow-lg">
                            <Icon name="mdi:close" class="w-6 h-6 text-gray-700" />
                        </button>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            <!-- Left: Product Image -->
                            <div class="space-y-4">
                                <div class="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                                    <img :src="selectedItem.image" :alt="selectedItem.name"
                                        class="w-full h-[500px] object-cover">
                                </div>
                            </div>

                            <!-- Right: Product Details -->
                            <div class="space-y-6">
                                <!-- Rating -->
                                <div class="flex items-center space-x-2">
                                    <div class="flex items-center space-x-1">
                                        <Icon v-for="i in 5" :key="i" name="mdi:star" class="w-5 h-5 text-amber-500" />
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">4.8 • Based on 48+ Reviews</span>
                                </div>

                                <!-- Title & Price -->
                                <div>
                                    <h3 class="text-4xl font-bold text-gray-900 mb-4">{{ selectedItem.name }}</h3>
                                    <p class="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
                                        {{ formatPrice(selectedItem.price) }}
                                    </p>
                                </div>

                                <!-- Key Features -->
                                <div class="space-y-3">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <Icon name="mdi:check" class="w-4 h-4 text-green-600" />
                                        </div>
                                        <span class="text-gray-700">Premium quality ingredients</span>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <Icon name="mdi:check" class="w-4 h-4 text-green-600" />
                                        </div>
                                        <span class="text-gray-700">Expertly crafted by our baristas</span>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <Icon name="mdi:check" class="w-4 h-4 text-green-600" />
                                        </div>
                                        <span class="text-gray-700">Made fresh to order</span>
                                    </div>
                                </div>

                                <!-- Cart Status -->
                                <div class="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center space-x-2">
                                            <Icon name="mdi:cart" class="w-6 h-6 text-amber-600" />
                                            <span class="text-gray-900 font-semibold text-lg">Currently in Cart</span>
                                        </div>
                                        <span class="text-3xl font-bold text-amber-600">{{ selectedItem.quantity }}x</span>
                                    </div>
                                    <div class="flex items-center justify-between pt-4 border-t border-amber-200">
                                        <span class="text-gray-700 font-medium">Subtotal:</span>
                                        <span class="text-2xl font-bold text-gray-900">{{ formatPrice(selectedItem.price * selectedItem.quantity) }}</span>
                                    </div>
                                </div>

                                <!-- Additional Details -->
                                <div class="space-y-2">
                                    <details class="group border border-gray-200 rounded-xl overflow-hidden">
                                        <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <span class="font-semibold text-gray-900">Product Details</span>
                                            <Icon name="mdi:chevron-down" class="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div class="p-4 pt-0 text-gray-600 text-sm leading-relaxed space-y-2">
                                            <div class="flex items-start space-x-2">
                                                <Icon name="mdi:coffee" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p class="font-medium text-gray-900">Premium Quality</p>
                                                    <p>Made with the finest beans</p>
                                                </div>
                                            </div>
                                            <div class="flex items-start space-x-2">
                                                <Icon name="mdi:leaf" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p class="font-medium text-gray-900">100% Organic</p>
                                                    <p>Ethically sourced ingredients</p>
                                                </div>
                                            </div>
                                            <div class="flex items-start space-x-2">
                                                <Icon name="mdi:fire" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p class="font-medium text-gray-900">Freshly Prepared</p>
                                                    <p>Made to order for best taste</p>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                <!-- Actions -->
                                <div class="space-y-3 pt-4 border-t border-gray-200">
                                    <button @click="closeDetailModal"
                                        class="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '../composables/useCart'
import { useProducts } from '../composables/useProducts'
import { useAuth } from '../composables/useAuth'
import { useOrders } from '../composables/useOrders'
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'
import { useHead } from 'nuxt/app'

const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart, hasInvalidItems, removeInvalidItems } = useCart()
const { formatPrice } = useProducts()
const { isAuthenticated, user } = useAuth()
const { createOrder } = useOrders()
const { success, error: showError, warning } = useToast()
const router = useRouter()

// Modal states
const showPaymentModal = ref(false)
const showDetailModal = ref(false)
const selectedItem = ref<any>(null)
const isProcessing = ref(false)
const selectedPaymentMethod = ref('CARD')
const selectedOrderType = ref('DINE_IN')

const openPaymentModal = () => {
    // Check authentication
    if (!isAuthenticated.value) {
        if (confirm('You need to login first to place an order. Would you like to login now?')) {
            router.push('/login')
        }
        return
    }
    showPaymentModal.value = true
}

const closePaymentModal = () => {
    if (!isProcessing.value) {
        showPaymentModal.value = false
    }
}

const openDetailModal = (item: any) => {
    selectedItem.value = item
    showDetailModal.value = true
}

const closeDetailModal = () => {
    showDetailModal.value = false
    selectedItem.value = null
}

const processPayment = async () => {
    if (!isAuthenticated.value) {
        warning('Please login first to place an order')
        router.push('/login')
        return
    }

    isProcessing.value = true
    
    try {
        // Validate and filter cart items
        const validItems = cartItems.value.filter(item => {
            if (!item.menuId || !item.size) {
                console.warn('Invalid cart item:', item)
                return false
            }
            return true
        })

        if (validItems.length === 0) {
            showError('Your cart contains invalid items. Please clear cart and add items again.')
            isProcessing.value = false
            return
        }

        // Prepare order items from cart
        const orderItems = validItems.map(item => ({
            menuId: item.menuId,
            size: item.size,
            quantity: item.quantity,
            iceLevel: item.iceLevel || 'NORMAL',
            sugarLevel: item.sugarLevel || 'NORMAL',
            notes: item.notes || '',
            toppingIds: item.toppingIds || []
        }))

        console.log('Sending order:', { orderItems, orderType: selectedOrderType.value, paymentMethod: selectedPaymentMethod.value })

        // Create order
        const result = await createOrder({
            items: orderItems,
            orderType: selectedOrderType.value,
            paymentMethod: selectedPaymentMethod.value,
            voucherCode: null
        })

        if (result.success) {
            // Clear cart
            clearCart()
            
            // Close modal
            showPaymentModal.value = false
            
            // Show success toast
            success(`Order placed successfully! Order #${result.order.orderNumber}`)
            
            // Redirect to orders page
            setTimeout(() => {
                router.push('/orders')
            }, 500)
        } else {
            showError(result.error || 'Failed to place order')
        }
    } catch (error: any) {
        console.error('Order error:', error)
        showError(error.message || 'Failed to place order')
    } finally {
        isProcessing.value = false
    }
}

useHead({
    title: 'Shopping Cart - Artisan Coffee',
    meta: [
        { name: 'description', content: 'Review your order and proceed to checkout.' }
    ]
})
</script>

<style scoped>
.cart-list-enter-active,
.cart-list-leave-active {
    transition: all 0.4s ease;
}

.cart-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.cart-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.cart-list-move {
    transition: transform 0.4s ease;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
