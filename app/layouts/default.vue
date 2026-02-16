<template>
    <div class="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main class="flex-1">
            <slot />
        </main>
        <Footer />
        <CartSidebar />
    </div>
    <!-- Toast Container -->
    <ToastContainer />
  </template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProducts } from '../composables/useProducts';
import { useAuth } from '../composables/useAuth';
import { useCart } from '../composables/useCart';

// Preload products data on layout mount
const { loadProducts } = useProducts()

onMounted(() => {
    loadProducts()
    // User and cart are now handled by auth plugin
})
</script>
