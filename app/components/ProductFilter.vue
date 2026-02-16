<template>
    <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button v-for="category in categories" :key="category.value" @click="$emit('update:modelValue', category.value)"
            class="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift" :class="modelValue === category.value
                ? 'bg-gradient-to-r from-medium-roast to-caramel text-cream shadow-lg'
                : 'bg-white text-dark-roast hover:bg-cream border-2 border-medium-roast/20'">
            <span class="mr-2">{{ category.icon }}</span>
            {{ category.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()

const categories = [
    { value: 'all', label: 'All Items', icon: '🍽️' },
    { value: 'coffee', label: 'Coffee', icon: '☕' },
    { value: 'food', label: 'Food', icon: '🥐' },
    { value: 'drinks', label: 'Drinks', icon: '🥤' }
]
</script>
