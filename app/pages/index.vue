<template>
    <div class="bg-white">
        <!-- Hero Section -->
        <Hero />

        <!-- Featured Products Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 rounded-full px-5 py-2 text-sm font-medium mb-4">
                        <Icon name="mdi:fire" class="w-4 h-4" />
                        <span>Popular Picks</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Featured Products
                    </h2>
                    <p class="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover our most loved items, carefully crafted by expert baristas
                    </p>
                </div>

                <div v-if="loading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent">
                    </div>
                    <p class="text-gray-500 mt-4">Loading products...</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" 
                        @show-detail="openDetailModal" />
                </div>

                <div class="text-center mt-12">
                    <NuxtLink to="/menu" class="group inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <span>View Full Menu</span>
                        <Icon name="mdi:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- About Preview Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 rounded-full px-5 py-2 text-sm font-medium mb-6">
                            <Icon name="mdi:heart" class="w-4 h-4" />
                            <span>Our Story</span>
                        </div>
                        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Crafting Moments, One Cup at a Time
                        </h2>
                        <p class="text-gray-600 leading-relaxed mb-6 text-lg">
                            Founded in 2018, Artisan Coffee House was born from a simple passion: to share exceptional
                            coffee with our community. What started as a small roastery has grown into a beloved
                            gathering place.
                        </p>
                        <p class="text-gray-600 leading-relaxed mb-8">
                            Every cup we serve is a testament to our commitment to quality, sustainability, and the art
                            of coffee making.
                        </p>
                        <NuxtLink to="/about" class="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold group">
                            <span>Learn More About Us</span>
                            <Icon name="mdi:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </NuxtLink>
                    </div>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100 text-center hover:shadow-lg transition-shadow">
                            <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Icon name="mdi:coffee" class="w-7 h-7 text-white" />
                            </div>
                            <div class="text-3xl font-bold text-gray-900 mb-1">500+</div>
                            <div class="text-gray-600 text-sm">Cups Daily</div>
                        </div>
                        <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 text-center hover:shadow-lg transition-shadow">
                            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Icon name="mdi:earth" class="w-7 h-7 text-white" />
                            </div>
                            <div class="text-3xl font-bold text-gray-900 mb-1">15+</div>
                            <div class="text-gray-600 text-sm">Coffee Origins</div>
                        </div>
                        <div class="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl border border-yellow-100 text-center hover:shadow-lg transition-shadow">
                            <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Icon name="mdi:star" class="w-7 h-7 text-white" />
                            </div>
                            <div class="text-3xl font-bold text-gray-900 mb-1">4.9</div>
                            <div class="text-gray-600 text-sm">Average Rating</div>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 text-center hover:shadow-lg transition-shadow">
                            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Icon name="mdi:account-group" class="w-7 h-7 text-white" />
                            </div>
                            <div class="text-3xl font-bold text-gray-900 mb-1">1000+</div>
                            <div class="text-gray-600 text-sm">Happy Customers</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 rounded-full px-5 py-2 text-sm font-medium mb-4">
                        <Icon name="mdi:comment-quote" class="w-4 h-4" />
                        <span>Testimonials</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p class="text-gray-600 text-lg">
                        Don't just take our word for it
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TestimonialCard v-for="testimonial in storeInfo.testimonials" :key="testimonial.id"
                        :testimonial="testimonial" />
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-center">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="max-w-3xl mx-auto">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">
                        Visit Us Today
                    </h2>
                    <p class="text-white/90 text-lg mb-8">
                        Experience the perfect blend of quality coffee, delicious food, and warm hospitality
                    </p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <NuxtLink to="/menu" class="inline-flex items-center space-x-2 bg-white text-amber-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            <Icon name="mdi:silverware-fork-knife" class="w-5 h-5" />
                            <span>Order Now</span>
                        </NuxtLink>
                        <NuxtLink to="/contact" class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                            <Icon name="mdi:email" class="w-5 h-5" />
                            <span>Contact Us</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Detail Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="detailModalOpen && selectedProduct" @click="detailModalOpen = false"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div @click.stop class="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-8">
                        <!-- Close Button -->
                        <button @click="detailModalOpen = false"
                            class="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all shadow-lg">
                            <Icon name="mdi:close" class="w-6 h-6 text-gray-700" />
                        </button>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            <!-- Left: Image Gallery -->
                            <div class="space-y-4">
                                <div class="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                                    <img :src="selectedProduct.image" :alt="selectedProduct.name"
                                        class="w-full h-[500px] object-cover">
                                    <div v-if="selectedProduct.popular"
                                        class="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
                                        <Icon name="mdi:star" class="w-4 h-4" />
                                        <span>Popular Choice</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Product Info -->
                            <div class="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                                <!-- Rating -->
                                <div class="flex items-center space-x-2">
                                    <div class="flex items-center space-x-1">
                                        <Icon v-for="i in 5" :key="i" name="mdi:star" class="w-5 h-5 text-amber-500" />
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">4.8 • Based on 48+ Reviews</span>
                                </div>

                                <!-- Title -->
                                <div>
                                    <h2 class="text-4xl font-bold text-gray-900 mb-2">{{ selectedProduct.name }}</h2>
                                    <div class="flex items-center space-x-3">
                                        <span class="inline-flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                                            <Icon name="mdi:tag" class="w-4 h-4" />
                                            <span class="capitalize">{{ selectedProduct.category }}</span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Key Benefits -->
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

                                <!-- Info Box -->
                                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex space-x-3">
                                    <Icon name="mdi:information" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div class="text-sm text-blue-900">
                                        <p class="font-medium mb-1">Important Information</p>
                                        <p class="text-blue-700">This item is prepared fresh and may contain allergens. Please inform staff of any dietary restrictions.</p>
                                    </div>
                                </div>

                                <!-- Price & CTA -->
                                <div class="space-y-3 pt-4 border-t border-gray-200">
                                    <div class="flex items-baseline space-x-2">
                                        <span class="text-sm text-gray-500">Price</span>
                                        <span class="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                            {{ formatPrice(selectedProduct.price) }}
                                        </span>
                                    </div>
                                    <button @click="handleAddFromModal"
                                        class="w-full bg-gradient-to-r from-green-700 to-green-800 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                                        <span>Add to Cart — {{ formatPrice(selectedProduct.price) }}</span>
                                    </button>
                                    <button @click="detailModalOpen = false"
                                        class="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                                        Continue Shopping
                                    </button>
                                </div>

                                <!-- Accordion Sections -->
                                <div class="space-y-2 pt-4">
                                    <details class="group border border-gray-200 rounded-xl overflow-hidden">
                                        <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <span class="font-semibold text-gray-900">Details</span>
                                            <Icon name="mdi:chevron-down" class="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div class="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                                            <p class="mb-3">{{ selectedProduct.description }}</p>
                                            <p><strong>Origin:</strong> Premium Arabica beans</p>
                                            <p><strong>Preparation:</strong> Made to order</p>
                                            <p><strong>Serving:</strong> Hot or iced available</p>
                                        </div>
                                    </details>

                                    <details class="group border border-gray-200 rounded-xl overflow-hidden">
                                        <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <span class="font-semibold text-gray-900">Ingredients & Allergens</span>
                                            <Icon name="mdi:chevron-down" class="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div class="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                                            <p class="mb-2"><strong>Main Ingredients:</strong></p>
                                            <ul class="list-disc list-inside space-y-1 mb-3">
                                                <li>Premium coffee beans</li>
                                                <li>Fresh milk (dairy)</li>
                                                <li>Filtered water</li>
                                            </ul>
                                            <p class="text-amber-900 bg-amber-50 p-2 rounded">
                                                <strong>Allergen Info:</strong> Contains dairy. May contain traces of nuts.
                                            </p>
                                        </div>
                                    </details>

                                    <details class="group border border-gray-200 rounded-xl overflow-hidden">
                                        <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <span class="font-semibold text-gray-900">Pickup & Delivery</span>
                                            <Icon name="mdi:chevron-down" class="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div class="p-4 pt-0 text-gray-600 text-sm leading-relaxed space-y-2">
                                            <div class="flex items-start space-x-2">
                                                <Icon name="mdi:store" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p class="font-medium text-gray-900">In-Store Pickup</p>
                                                    <p>Ready in 5-10 minutes after order</p>
                                                </div>
                                            </div>
                                            <div class="flex items-start space-x-2">
                                                <Icon name="mdi:bike-fast" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p class="font-medium text-gray-900">Delivery</p>
                                                    <p>Available within 5km radius (30-45 mins)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
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
import { useProducts, type Product } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useHead } from 'nuxt/app'
import { onMounted, ref, computed } from 'vue'

const { products, loading, loadProducts, getFeaturedProducts, formatPrice } = useProducts()
const { addToCart } = useCart()

const storeInfo = ref<any>({})
const detailModalOpen = ref(false)
const selectedProduct = ref<Product | null>(null)

const featuredProducts = computed(() => {
    return getFeaturedProducts()
})

watch(detailModalOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

const openDetailModal = (product: Product) => {
    selectedProduct.value = product
    detailModalOpen.value = true
}

const handleAddFromModal = () => {
    if (selectedProduct.value) {
        addToCart({
            id: selectedProduct.value.id + '-' + Date.now(),
            menuId: selectedProduct.value.id,
            name: selectedProduct.value.name,
            price: selectedProduct.value.price,
            image: selectedProduct.value.image,
            size: 'REGULAR',
            iceLevel: 'NORMAL',
            sugarLevel: 'NORMAL',
            toppingIds: [],
            notes: '',
            customization: 'Regular | Normal Ice | Normal Sugar'
        })
        detailModalOpen.value = false
    }
}

onMounted(async () => {
    await loadProducts() 
    const data = await import('../data/store-info.json')
    storeInfo.value = data.default
})

useHead({
    title: 'Home - Artisan Coffee House',
    meta: [
        { name: 'description', content: 'Experience the finest artisan coffee, fresh pastries, and a cozy atmosphere at Artisan Coffee House.' }
    ]
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
    transform: scale(0.9);
}
.modal-overlay {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

.modal-overlay::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}
</style>
