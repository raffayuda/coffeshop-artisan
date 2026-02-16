<template>
    <div class="bg-white p-8 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start space-x-4 mb-6">
            <img :src="testimonial.avatar" :alt="testimonial.name"
                class="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100">
            <div class="flex-1">
                <h4 class="font-bold text-gray-900">{{ testimonial.name }}</h4>
                <div class="flex items-center space-x-1 mt-1">
                    <Icon v-for="i in 5" :key="i" 
                        :name="i <= testimonial.rating ? 'mdi:star' : 'mdi:star-outline'"
                        class="w-4 h-4"
                        :class="i <= testimonial.rating ? 'text-amber-500' : 'text-gray-300'" />
                </div>
            </div>
        </div>
        <div class="relative">
            <Icon name="mdi:format-quote-open" class="w-8 h-8 text-amber-200 absolute -top-2 -left-2" />
            <p class="text-gray-700 leading-relaxed relative z-10 pl-4">
                {{ testimonial.comment }}
            </p>
        </div>
        <div class="flex items-center space-x-2 mt-4 text-sm text-gray-500">
            <Icon name="mdi:calendar" class="w-4 h-4" />
            <span>{{ formatDate(testimonial.date) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Testimonial {
    id: number
    name: string
    rating: number
    comment: string
    date: string
    avatar: string
}

defineProps<{
    testimonial: Testimonial
}>()

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>
