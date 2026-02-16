<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id"
          class="bg-white rounded-xl shadow-2xl border overflow-hidden min-w-[300px] transform-gpu"
          :class="[
            toast.type === 'success' ? 'border-green-500' : '',
            toast.type === 'error' ? 'border-red-500' : '',
            toast.type === 'warning' ? 'border-yellow-500' : '',
            toast.type === 'info' ? 'border-blue-500' : ''
          ]">
          <div class="flex items-start p-4 gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <div v-if="toast.type === 'success'" 
                class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon name="mdi:check-circle" class="w-6 h-6 text-green-600" />
              </div>
              <div v-else-if="toast.type === 'error'" 
                class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Icon name="mdi:alert-circle" class="w-6 h-6 text-red-600" />
              </div>
              <div v-else-if="toast.type === 'warning'" 
                class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Icon name="mdi:alert" class="w-6 h-6 text-yellow-600" />
              </div>
              <div v-else 
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="mdi:information" class="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <!-- Message -->
            <div class="flex-1 pt-1">
              <p class="text-sm font-medium text-gray-900 leading-relaxed">{{ toast.message }}</p>
            </div>

            <!-- Close Button -->
            <button @click="removeToast(toast.id)" 
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div v-if="toast.duration && toast.duration > 0" 
            class="h-1 bg-gray-100">
            <div class="h-full transition-all ease-linear"
              :class="[
                toast.type === 'success' ? 'bg-green-500' : '',
                toast.type === 'error' ? 'bg-red-500' : '',
                toast.type === 'warning' ? 'bg-yellow-500' : '',
                toast.type === 'info' ? 'bg-blue-500' : ''
              ]"
              :style="{ 
                animation: `shrink ${toast.duration}ms linear forwards` 
              }">
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const removeToast = (id: string) => {
  remove(id)
}
</script>

<style scoped>
/* Toast transitions */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(400px) scale(0.8);
    opacity: 0;
  }
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
