<template>
    <div class="bg-white border border-gray-100 p-8 rounded-2xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-semibold text-gray-900 mb-2">
                    Name *
                </label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon name="mdi:account" class="w-5 h-5 text-gray-400" />
                    </div>
                    <input id="name" v-model="formData.name" type="text" required 
                        class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="Your name">
                </div>
            </div>

            <div>
                <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                </label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon name="mdi:email" class="w-5 h-5 text-gray-400" />
                    </div>
                    <input id="email" v-model="formData.email" type="email" required 
                        class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com">
                </div>
            </div>

            <div>
                <label for="subject" class="block text-sm font-semibold text-gray-900 mb-2">
                    Subject *
                </label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon name="mdi:message-text" class="w-5 h-5 text-gray-400" />
                    </div>
                    <input id="subject" v-model="formData.subject" type="text" required 
                        class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="How can we help you?">
                </div>
            </div>

            <div>
                <label for="message" class="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                </label>
                <textarea id="message" v-model="formData.message" required rows="5" 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more..."></textarea>
            </div>

            <button type="submit" :disabled="isSubmitting" 
                class="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2"
                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                <Icon v-if="isSubmitting" name="mdi:loading" class="w-5 h-5 animate-spin" />
                <Icon v-else name="mdi:send" class="w-5 h-5" />
                <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
            </button>

            <Transition name="fade">
                <div v-if="showSuccess"
                    class="bg-green-50 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl text-center flex items-center justify-center space-x-2">
                    <Icon name="mdi:check-circle" class="w-6 h-6" />
                    <span>Thank you! Your message has been sent successfully.</span>
                </div>
            </Transition>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const handleSubmit = async () => {
    isSubmitting.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Reset form
    formData.name = ''
    formData.email = ''
    formData.subject = ''
    formData.message = ''

    isSubmitting.value = false
    showSuccess.value = true

    // Hide success message after 5 seconds
    setTimeout(() => {
        showSuccess.value = false
    }, 5000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
