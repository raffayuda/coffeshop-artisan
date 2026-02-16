<template>
    <div class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <!-- Product Image -->
        <div class="relative overflow-hidden h-48 bg-gradient-to-br from-gray-50 to-amber-50">
            <img :src="product.image" :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy">
            <div v-if="product.popular"
                class="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                <Icon name="mdi:star" class="w-3.5 h-3.5" />
                <span>Popular</span>
            </div>
            <div v-if="isInCart"
                class="absolute top-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                <Icon name="mdi:check" class="w-3.5 h-3.5" />
                <span>In Cart</span>
            </div>
        </div>

        <!-- Product Info -->
        <div class="p-5 flex-1 flex flex-col">
            <h3 class="text-lg font-bold text-gray-900 mb-2">
                {{ product.name }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                {{ product.description }}
            </p>

            <div class="space-y-3 mt-auto pt-4">
                <div class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {{ formatPrice(product.price) }}
                </div>
                <div class="flex items-center gap-2">
                    <button @click="$emit('showDetail', product)"
                        class="flex-1 inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                        <Icon name="mdi:eye" class="w-4 h-4" />
                        <span class="text-sm">Detail</span>
                    </button>
                    <button @click="handleAddToCart" :disabled="isAdding"
                        class="flex-1 group/btn inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                        :class="{ 'opacity-50 cursor-not-allowed': isAdding }">
                        <Icon v-if="isAdding" name="mdi:check-circle" class="w-4 h-4" />
                        <Icon v-else name="mdi:plus" class="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                        <span class="text-sm">{{ isAdding ? 'Added' : 'Add' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProducts, type Product } from '../composables/useProducts'
import { useCart } from '../composables/useCart';

const props = defineProps<{
    product: Product
}>()

const { addToCart, isInCart: checkInCart } = useCart()
const { formatPrice } = useProducts()
const isAdding = ref(false)

const isInCart = computed(() => checkInCart(props.product.id))

const handleAddToCart = () => {
    addToCart({
        id: props.product.id,
        name: props.product.name,
        price: props.product.price,
        image: props.product.image
    })

    isAdding.value = true
    setTimeout(() => {
        isAdding.value = false
    }, 1000)
}
</script>
