<template>
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        :class="scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center space-x-3 group">
                    <div class="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <Icon name="mdi:coffee" class="w-6 h-6 text-white" />
                    </div>
                    <div class="hidden sm:block">
                        <div class="font-bold text-lg text-gray-900 tracking-tight">
                            Artisan Coffee
                        </div>
                    </div>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-1">
                    <NuxtLink v-for="link in navLinks" :key="link.path" :to="link.path"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                        :class="isActive(link.path) ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'">
                        {{ link.name }}
                    </NuxtLink>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Cart Button -->
                    <button @click="toggleCart"
                        class="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                        aria-label="Shopping Cart">
                        <Icon name="mdi:shopping-outline" class="w-5 h-5 text-gray-700 group-hover:text-amber-700" />
                        <span v-if="cartCount > 0"
                            class="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md">
                            {{ cartCount }}
                        </span>
                    </button>

                    <!-- User Menu -->
                    <div v-if="isAuthenticated" class="relative hidden md:block">
                        <button @click="showUserMenu = !showUserMenu"
                            class="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
                            <div class="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                                <span class="text-white text-sm font-semibold">{{ userInitial }}</span>
                            </div>
                        </button>
                        
                        <!-- Dropdown -->
                        <Transition name="fade">
                            <div v-if="showUserMenu" @click="showUserMenu = false"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                                <div class="px-4 py-2 border-b border-gray-100">
                                    <p class="text-sm font-semibold text-gray-900">{{ user?.fullName }}</p>
                                    <p class="text-xs text-gray-500">{{ user?.email }}</p>
                                </div>
                                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Profile
                                </NuxtLink>
                                <NuxtLink to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    My Orders
                                </NuxtLink>
                                <NuxtLink v-if="userRole === 'BARISTA'" to="/barista/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Barista Dashboard
                                </NuxtLink>
                                <NuxtLink v-if="userRole === 'ADMIN'" to="/admin/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Admin Dashboard
                                </NuxtLink>
                                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    Logout
                                </button>
                            </div>
                        </Transition>
                    </div>

                    <!-- Login Button -->
                    <NuxtLink v-else to="/login"
                        class="hidden md:block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg hover:shadow-lg transition-all duration-200">
                        Login
                    </NuxtLink>

                    <!-- Mobile Menu Toggle -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen"
                        class="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
                        aria-label="Toggle Menu">
                        <Icon v-if="!mobileMenuOpen" name="mdi:menu" class="w-5 h-5 text-gray-700" />
                        <Icon v-else name="mdi:close" class="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <Transition name="slide-down">
                <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100">
                    <div class="flex flex-col space-y-1">
                        <NuxtLink v-for="link in navLinks" :key="link.path" :to="link.path"
                            @click="mobileMenuOpen = false"
                            class="px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                            :class="isActive(link.path) ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'">
                            {{ link.name }}
                        </NuxtLink>
                    </div>
                </div>
            </Transition>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useState, useRoute } from 'nuxt/app'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

const { cartCount } = useCart()
const { user, isAuthenticated, userRole, logout } = useAuth()
const cartSidebarOpen = useState('cartSidebarOpen', () => false)
const route = useRoute()

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
]

const isActive = (path: string) => {
    return route.path === path
}

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

const userInitial = computed(() => {
    return user.value?.fullName?.charAt(0).toUpperCase() || 'U'
})

const toggleCart = () => {
    cartSidebarOpen.value = !cartSidebarOpen.value
}

const handleLogout = async () => {
    showUserMenu.value = false
    await logout()
}

// Watch for user changes to ensure UI updates
watch(() => user.value, (newUser) => {
    console.log('Navbar: User changed', newUser)
}, { immediate: true })

const handleScroll = () => {
    scrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
