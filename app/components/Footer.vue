<template>
    <footer class="bg-gray-900 text-gray-300">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <!-- About -->
                <div>
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
                            <Icon name="mdi:coffee" class="w-6 h-6 text-white" />
                        </div>
                        <h3 class="text-lg font-bold text-white">Artisan Coffee</h3>
                    </div>
                    <p class="text-sm leading-relaxed mb-6 text-gray-400">
                        Crafting memorable coffee experiences with passion and precision.
                    </p>
                    <div class="flex space-x-3">
                        <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                            aria-label="Instagram">
                            <Icon name="mdi:instagram" class="w-5 h-5" />
                        </a>
                        <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                            aria-label="Facebook">
                            <Icon name="mdi:facebook" class="w-5 h-5" />
                        </a>
                        <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                            aria-label="Twitter">
                            <Icon name="mdi:twitter" class="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="text-base font-semibold mb-4 text-white">Quick Links</h4>
                    <ul class="space-y-3">
                        <li>
                            <NuxtLink to="/"
                                class="text-sm text-gray-400 hover:text-amber-500 transition-colors duration-300 inline-flex items-center space-x-2">
                                <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                <span>Home</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/menu"
                                class="text-sm text-gray-400 hover:text-amber-500 transition-colors duration-300 inline-flex items-center space-x-2">
                                <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                <span>Menu</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/about"
                                class="text-sm text-gray-400 hover:text-amber-500 transition-colors duration-300 inline-flex items-center space-x-2">
                                <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                <span>About</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact"
                                class="text-sm text-gray-400 hover:text-amber-500 transition-colors duration-300 inline-flex items-center space-x-2">
                                <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                <span>Contact</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h4 class="text-base font-semibold mb-4 text-white">Contact</h4>
                    <ul class="space-y-4 text-sm">
                        <li class="flex items-start space-x-3">
                            <Icon name="mdi:map-marker" class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span class="text-gray-400">Jl. Kopi Kenangan No. 123<br>Jakarta Selatan 12345</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <Icon name="mdi:email" class="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <span class="text-gray-400">hello@artisancoffee.com</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <Icon name="mdi:phone" class="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <span class="text-gray-400">+62 812-3456-7890</span>
                        </li>
                    </ul>
                </div>

                <!-- Hours -->
                <div>
                    <h4 class="text-base font-semibold mb-4 text-white">Opening Hours</h4>
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-center justify-between text-gray-400">
                            <span>Mon - Fri</span>
                            <span class="font-semibold text-white">07:00 - 21:00</span>
                        </li>
                        <li class="flex items-center justify-between text-gray-400">
                            <span>Sat - Sun</span>
                            <span class="font-semibold text-white">08:00 - 22:00</span>
                        </li>
                        <li class="flex items-center justify-between text-gray-400">
                            <span>Holidays</span>
                            <span class="font-semibold text-white">09:00 - 18:00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-gray-800 mt-12 pt-8 text-center">
                <p class="text-sm text-gray-500">
                    &copy; {{ new Date().getFullYear() }} Artisan Coffee. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
</script>
