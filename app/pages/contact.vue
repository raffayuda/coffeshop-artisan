<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <section class="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-28">
            <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-4">
                    <Icon name="mdi:email" class="w-5 h-5" />
                    <span class="text-sm font-medium">Get In Touch</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-3">
                    Contact Us
                </h1>
                <p class="text-white/90 text-lg">
                    We'd love to hear from you
                </p>
            </div>
        </section>

        <!-- Contact Content -->
        <section class="py-20">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Contact Form -->
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                        <ContactForm />
                    </div>

                    <!-- Contact Info -->
                    <div class="space-y-8">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                            <p class="text-gray-600 leading-relaxed mb-6">
                                Have a question or feedback? We're here to help! Reach out to us through the form or
                                visit us at our location.
                            </p>
                        </div>

                        <!-- Contact Cards -->
                        <div class="space-y-4">
                            <div class="bg-white border border-gray-100 p-6 rounded-2xl flex items-start space-x-4 hover:shadow-lg hover:border-amber-200 transition-all">
                                <div class="bg-amber-100 p-3 rounded-xl">
                                    <Icon name="mdi:map-marker" class="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-900 mb-1">Address</h3>
                                    <p class="text-gray-600">{{ storeInfo.contact?.address }}</p>
                                </div>
                            </div>

                            <div class="bg-white border border-gray-100 p-6 rounded-2xl flex items-start space-x-4 hover:shadow-lg hover:border-amber-200 transition-all">
                                <div class="bg-amber-100 p-3 rounded-xl">
                                    <Icon name="mdi:phone" class="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-900 mb-1">Phone</h3>
                                    <p class="text-gray-600">{{ storeInfo.contact?.phone }}</p>
                                </div>
                            </div>

                            <div class="bg-white border border-gray-100 p-6 rounded-2xl flex items-start space-x-4 hover:shadow-lg hover:border-amber-200 transition-all">
                                <div class="bg-amber-100 p-3 rounded-xl">
                                    <Icon name="mdi:email" class="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-900 mb-1">Email</h3>
                                    <p class="text-gray-600">{{ storeInfo.contact?.email }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Hours -->
                        <div class="bg-white border border-gray-100 p-6 rounded-2xl hover:shadow-lg hover:border-amber-200 transition-all">
                            <h3 class="font-bold text-gray-900 mb-4 flex items-center">
                                <Icon name="mdi:clock-outline" class="w-5 h-5 mr-2 text-amber-600" />
                                Opening Hours
                            </h3>
                            <div class="space-y-2 text-gray-600">
                                <div class="flex justify-between">
                                    <span>Monday - Friday:</span>
                                    <span class="font-semibold text-gray-900">{{ storeInfo.hours?.weekdays }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Saturday - Sunday:</span>
                                    <span class="font-semibold text-gray-900">{{ storeInfo.hours?.weekend }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Public Holidays:</span>
                                    <span class="font-semibold text-gray-900">{{ storeInfo.hours?.holiday }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Map Placeholder -->
                        <div
                            class="bg-white border border-gray-100 rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center hover:shadow-lg hover:border-amber-200 transition-all">
                            <div class="text-center">
                                <Icon name="mdi:map-search" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p class="text-gray-400">Interactive map coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from 'nuxt/app'

const storeInfo = ref<any>({})

onMounted(async () => {
    const data = await import('../data/store-info.json')
    storeInfo.value = data.default
})

useHead({
    title: 'Contact Us - Artisan Coffee House',
    meta: [
        { name: 'description', content: 'Get in touch with Artisan Coffee House. Visit us, call us, or send us a message.' }
    ]
})
</script>
