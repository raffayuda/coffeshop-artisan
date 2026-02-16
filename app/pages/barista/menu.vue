<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <BaristaSidebar />

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Menu Management</h1>
          <p class="text-gray-600">Manage menu availability (mark items as out of stock)</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent"></div>
        </div>

        <!-- Category Tabs -->
        <div v-else class="space-y-6">
          <div class="flex gap-2 border-b border-gray-200 pb-2">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'px-4 py-2 font-medium rounded-lg transition-colors',
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <!-- Menu Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="menu in filteredMenus"
              :key="menu.id"
              :class="[
                'bg-white rounded-lg shadow-sm overflow-hidden transition-all',
                !menu.isAvailable && 'opacity-60'
              ]"
            >
              <div class="relative">
                <img
                  :src="menu.image"
                  :alt="menu.name"
                  class="w-full h-48 object-cover"
                />
                <div
                  v-if="!menu.isAvailable"
                  class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  Out of Stock
                </div>
              </div>
              
              <div class="p-5">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ menu.name }}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ menu.description }}</p>
                
                <!-- Prices -->
                <div class="mb-4 space-y-1">
                  <div v-for="price in menu.prices" :key="price.id" class="flex justify-between text-sm">
                    <span class="text-gray-600">{{ price.size }}</span>
                    <span class="font-medium text-gray-900">Rp {{ formatPrice(price.price) }}</span>
                  </div>
                </div>

                <!-- Toggle Switch -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span class="text-sm font-medium text-gray-700">Availability</span>
                  <button
                    @click="toggleAvailability(menu)"
                    :disabled="updatingMenuId === menu.id"
                    :class="[
                      'relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                      menu.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                        menu.isAvailable ? 'translate-x-8' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredMenus.length === 0" class="text-center py-20">
            <Icon name="mdi:food-off" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600">No menu items in this category</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'barista',
  layout: false
})

const router = useRouter()
const { logout } = useAuth()
const { updateMenuAvailability } = useBarista()
const { success: showSuccess, error: showError } = useToast()

const loading = ref(true)
const menus = ref<any[]>([])
const selectedCategory = ref('ALL')
const updatingMenuId = ref<string | null>(null)

const categories = ['ALL', 'COFFEE', 'NON_COFFEE', 'SNACK']

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const filteredMenus = computed(() => {
  if (selectedCategory.value === 'ALL') {
    return menus.value
  }
  return menus.value.filter(menu => menu.category === selectedCategory.value)
})

const toggleAvailability = async (menu: any) => {
  updatingMenuId.value = menu.id
  
  const newAvailability = !menu.isAvailable
  const result = await updateMenuAvailability(menu.id, newAvailability)
  
  if (result.success) {
    // Update local state
    menu.isAvailable = newAvailability
    showSuccess(
      newAvailability 
        ? `${menu.name} is now available` 
        : `${menu.name} marked as out of stock`
    )
  } else {
    showError(result.error)
  }
  
  updatingMenuId.value = null
}

const fetchMenus = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/barista/menu')
    menus.value = response
  } catch (error: any) {
    showError('Failed to load menu items')
  }
  loading.value = false
}

onMounted(async () => {
  await fetchMenus()
})
</script>
