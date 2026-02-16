<template>
    <Teleport to="body">
        <Transition name="overlay">
            <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" @click="closeCart"></div>
        </Transition>

        <Transition name="slide">
            <aside v-if="isOpen"
                class="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col">
                <!-- Header with top padding to account for navbar -->
                <div class="flex items-center justify-between p-6 pt-20 border-b border-gray-100">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Shopping Cart</h2>
                        <p class="text-sm text-gray-500">{{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'items' }}</p>
                    </div>
                    <button @click="closeCart"
                        class="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Close Cart">
                        <Icon name="mdi:close" class="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <!-- Cart Items -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div v-if="cartItems.length === 0"
                        class="flex flex-col items-center justify-center h-full text-center">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Icon name="mdi:shopping-outline" class="w-12 h-12 text-gray-400" />
                        </div>
                        <p class="text-gray-900 text-lg font-semibold">Your cart is empty</p>
                        <p class="text-gray-500 text-sm mt-2 mb-6">Add items from our menu!</p>
                        <NuxtLink to="/menu" @click="closeCart" class="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                            <span>Browse Menu</span>
                            <Icon name="mdi:arrow-right" class="w-5 h-5" />
                        </NuxtLink>
                    </div>

                    <div v-else class="space-y-4">
                        <TransitionGroup name="cart-item">
                            <div v-for="item in cartItems" :key="item.id" class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-200">
                                <div class="flex space-x-4">
                                    <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-xl">
                                    <div class="flex-1 min-w-0">
                                        <h3 class="font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                                        <p class="text-amber-600 font-bold mt-1">{{ formatPrice(item.price) }}</p>

                                        <!-- Quantity Controls -->
                                        <div class="flex items-center space-x-3 mt-3">
                                            <div class="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <button @click="updateQuantity(item.id, item.quantity - 1)"
                                                    class="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                                                    aria-label="Decrease quantity">
                                                    <Icon name="mdi:minus" class="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span class="px-4 text-gray-900 font-semibold min-w-[40px] text-center">{{ item.quantity }}</span>
                                                <button @click="updateQuantity(item.id, item.quantity + 1)"
                                                    class="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                                                    aria-label="Increase quantity">
                                                    <Icon name="mdi:plus" class="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                            <button @click="removeFromCart(item.id)"
                                                class="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                aria-label="Remove item">
                                                <Icon name="mdi:trash-can-outline" class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="cartItems.length > 0" class="border-t border-gray-100 p-6 space-y-4 bg-gray-50">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600 font-medium">Subtotal</span>
                        <span class="text-2xl font-bold text-gray-900">{{ formatPrice(cartTotal) }}</span>
                    </div>

                    <NuxtLink to="/cart" @click="closeCart" class="group flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full">
                        <span>Proceed to Checkout</span>
                        <Icon name="mdi:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>

                    <button @click="clearCart"
                        class="flex items-center justify-center space-x-2 w-full text-gray-500 hover:text-red-500 transition-colors duration-200 text-sm font-medium py-2">
                        <Icon name="mdi:delete-outline" class="w-4 h-4" />
                        <span>Clear Cart</span>
                    </button>
                </div>
            </aside>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useState } from 'nuxt/app'
import { useCart } from '../composables/useCart'
import { useProducts } from '../composables/useProducts'

const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
const { formatPrice } = useProducts()
const isOpen = useState('cartSidebarOpen', () => false)

const closeCart = () => {
    isOpen.value = false
}
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.cart-item-enter-active,
.cart-item-leave-active {
    transition: all 0.3s ease;
}

.cart-item-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.cart-item-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.cart-item-move {
    transition: transform 0.3s ease;
}
</style>