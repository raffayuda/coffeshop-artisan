<template>
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-amber-50/30 pt-16">
        <!-- Decorative Elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div class="text-center max-w-4xl mx-auto space-y-8">
                <!-- Badge -->
                <div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 rounded-full px-5 py-2 text-sm font-medium shadow-sm">
                    <Icon name="mdi:star-circle" class="w-4 h-4" />
                    <span>Premium Artisan Coffee Experience</span>
                </div>

                <!-- Main Heading -->
                <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-tight">
                    Where Every Cup<br>
                    <span class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                        Tells a Story
                    </span>
                </h1>

                <!-- Description -->
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Experience the finest artisan coffee, thoughtfully sourced and expertly crafted in a warm, welcoming atmosphere
                </p>

                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <NuxtLink to="/menu" class="group inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <span>Explore Menu</span>
                        <Icon name="mdi:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                    <NuxtLink to="/about" class="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-amber-600 hover:text-amber-700 transition-all duration-300">
                        <span>Our Story</span>
                    </NuxtLink>
                </div>

                <!-- Modern Features Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                    <!-- Card 1: 100% Organic -->
                    <div class="group relative">
                        <!-- Hover glow effect -->
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                        
                        <!-- Card content -->
                        <div class="relative bg-white p-8 rounded-3xl border border-gray-100 hover:border-green-200 transition-all duration-300 h-full">
                            <!-- Icon wrapper with modern design -->
                            <div class="relative mb-6">
                                <div class="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                                <div class="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Icon name="mdi:leaf" class="w-8 h-8 text-white" />
                                </div>
                            </div>
                            
                            <!-- Text content -->
                            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                100% Organic
                            </h3>
                            <p class="text-gray-600 leading-relaxed">
                                Ethically sourced from sustainable farms, ensuring the highest quality and environmental care
                            </p>

                            <!-- Bottom accent line -->
                            <div class="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                    </div>

                    <!-- Card 2: Expert Craft -->
                    <div class="group relative">
                        <!-- Hover glow effect -->
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                        
                        <!-- Card content -->
                        <div class="relative bg-white p-8 rounded-3xl border border-gray-100 hover:border-amber-200 transition-all duration-300 h-full">
                            <!-- Icon wrapper with modern design -->
                            <div class="relative mb-6">
                                <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                                <div class="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Icon name="mdi:coffee-maker" class="w-8 h-8 text-white" />
                                </div>
                            </div>
                            
                            <!-- Text content -->
                            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                                Expert Craft
                            </h3>
                            <p class="text-gray-600 leading-relaxed">
                                Precision brewing by skilled baristas who understand the art and science of perfect coffee
                            </p>

                            <!-- Bottom accent line -->
                            <div class="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                    </div>

                    <!-- Card 3: Award Winning -->
                    <div class="group relative">
                        <!-- Hover glow effect -->
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                        
                        <!-- Card content -->
                        <div class="relative bg-white p-8 rounded-3xl border border-gray-100 hover:border-yellow-200 transition-all duration-300 h-full">
                            <!-- Icon wrapper with modern design -->
                            <div class="relative mb-6">
                                <div class="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                                <div class="relative w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Icon name="mdi:trophy" class="w-8 h-8 text-white" />
                                </div>
                            </div>
                            
                            <!-- Text content -->
                            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                                Award Winning
                            </h3>
                            <p class="text-gray-600 leading-relaxed">
                                Recognized for exceptional quality and outstanding service in the specialty coffee industry
                            </p>

                            <!-- Bottom accent line -->
                            <div class="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script setup lang="ts">
</script>