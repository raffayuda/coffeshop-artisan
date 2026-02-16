<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <section class="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-28">
            <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-4">
                    <Icon name="mdi:information" class="w-5 h-5" />
                    <span class="text-sm font-medium">About Us</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-3">
                    Our Story
                </h1>
                <p class="text-white/90 text-lg">
                    Discover our passion for exceptional coffee
                </p>
            </div>
        </section>

        <!-- Our Story -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Who We Are</h2>
                    <p class="text-gray-600 text-lg leading-relaxed mb-8">
                        {{ storeInfo.about?.story }}
                    </p>
                    <div class="bg-amber-50 border-l-4 border-amber-600 p-8 rounded-r-2xl">
                        <p class="text-gray-700 text-xl leading-relaxed italic">
                            {{ storeInfo.about?.mission }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Values -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">Our Values</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="value in storeInfo.about?.values" :key="value.title"
                        class="bg-white p-8 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 text-center group">
                        <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">{{ value.icon }}</div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ value.title }}</h3>
                        <p class="text-gray-600 leading-relaxed">{{ value.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Team -->
        <section class="section-padding">
            <div class="container-custom">
                <h2 class="text-4xl md:text-5xl font-bold text-espresso text-center mb-16">Meet Our Team</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div v-for="member in storeInfo.team" :key="member.id"
                        class="glass-card rounded-xl overflow-hidden hover-lift group">
                        <div class="relative h-64 bg-gradient-to-br from-medium-roast/20 to-caramel/20 overflow-hidden">
                            <img :src="member.image" :alt="member.name"
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-bold text-espresso mb-1">{{ member.name }}</h3>
                            <p class="text-caramel font-semibold mb-3">{{ member.role }}</p>
                            <p class="text-dark-roast/70 text-sm leading-relaxed">{{ member.bio }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="section-padding bg-gradient-to-r from-medium-roast to-caramel text-cream text-center">
            <div class="container-custom">
                <div class="max-w-3xl mx-auto">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">
                        Join Our Coffee Community
                    </h2>
                    <p class="text-cream/90 text-lg mb-8">
                        Experience the warmth and quality that makes Artisan Coffee House special
                    </p>
                    <NuxtLink to="/menu"
                        class="btn-primary bg-white text-white hover:bg-cream px-8 py-4 text-lg">
                        Explore Our Menu
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import { onMounted, ref } from 'vue'

const storeInfo = ref<any>({})

onMounted(async () => {
    const data = await import('../data/store-info.json')
    storeInfo.value = data.default
})

useHead({
    title: 'About Us - Artisan Coffee House',
    meta: [
        { name: 'description', content: 'Learn about our story, values, and the passionate team behind Artisan Coffee House.' }
    ]
})
</script>
