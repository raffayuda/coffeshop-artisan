<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-3">Our Menu</h1>
        <p class="text-white/90 text-lg">Explore our selection of premium coffee and beverages</p>
      </div>
    </section>

    <!-- Menu Section -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Search & Filter -->
        <div class="mb-8 flex gap-4">
          <div class="flex-1 relative">
            <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Search menu..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
          </div>
          <select v-model="selectedCategory"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            <option value="ALL">All Categories</option>
            <option value="COFFEE">Coffee</option>
            <option value="NON_COFFEE">Non Coffee</option>
            <option value="SNACK">Snacks</option>
          </select>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent">
          </div>
          <p class="text-gray-500 mt-4">Loading menu...</p>
        </div>

        <!-- Product Grid -->
        <div v-else>
          <div v-if="filteredMenus.length === 0" class="text-center py-12">
            <Icon name="mdi:magnify" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-600 text-lg">No menus found</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="menu in filteredMenus" :key="menu.id"
              class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              @click="openDetailModal(menu)">
              <div class="relative h-48 bg-gray-100">
                <img v-if="menu.image" :src="menu.image" :alt="menu.name" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="mdi:coffee" class="w-16 h-16 text-gray-300" />
                </div>
                <div v-if="!menu.isAvailable" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span class="bg-red-500 text-white px-4 py-2 rounded-full font-medium">Sold Out</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ menu.name }}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ menu.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-amber-600">
                    Rp {{ formatPrice(getLowestPrice(menu)) }}
                  </span>
                  <span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{{ menu.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detail Modal with Customization -->
    <Transition name="modal">
      <div v-if="showModal && selectedMenu" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedMenu.name }}</h3>
              <p class="text-gray-600 text-sm">{{ selectedMenu.description }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors ml-4">
              <Icon name="mdi:close" class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <!-- Product Image -->
            <div class="rounded-xl overflow-hidden bg-gray-100 aspect-video">
              <img v-if="selectedMenu.image" :src="selectedMenu.image" :alt="selectedMenu.name"
                class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="mdi:coffee" class="w-24 h-24 text-gray-300" />
              </div>
            </div>

            <!-- Size Selection -->
            <div class="space-y-3">
              <label class="block font-semibold text-gray-900">Size <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-3 gap-3">
                <button v-for="priceData in selectedMenu.prices" :key="priceData.size"
                  @click="customization.size = priceData.size" :class="[
                    'p-4 border-2 rounded-lg transition-all',
                    customization.size === priceData.size
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  ]">
                  <div class="font-medium text-gray-900">{{ formatSize(priceData.size) }}</div>
                  <div class="text-sm text-amber-600 font-semibold mt-1">
                    Rp {{ formatPrice(priceData.price) }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Ice Level -->
            <div class="space-y-3" v-if="selectedMenu.category !== 'SNACK'">
              <label class="block font-semibold text-gray-900">Ice Level <span class="text-red-500">*</span></label>
              <select v-model="customization.iceLevel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="LESS">Less Ice</option>
                <option value="NORMAL">Normal Ice</option>
                <option value="EXTRA">Extra Ice</option>
              </select>
            </div>

            <!-- Sugar Level -->
            <div class="space-y-3" v-if="selectedMenu.category !== 'SNACK'">
              <label class="block font-semibold text-gray-900">Sugar Level <span
                  class="text-red-500">*</span></label>
              <select v-model="customization.sugarLevel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="LESS">Less Sugar</option>
                <option value="NORMAL">Normal Sugar</option>
                <option value="EXTRA">Extra Sugar</option>
              </select>
            </div>

            <!-- Toppings -->
            <div class="space-y-3" v-if="selectedMenu.toppings && selectedMenu.toppings.length > 0">
              <label class="block font-semibold text-gray-900">Toppings (Optional)</label>
              <div class="space-y-2">
                <label v-for="topping in selectedMenu.toppings" :key="topping.topping.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" :value="topping.topping.id" v-model="customization.toppings"
                      class="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500">
                    <span class="font-medium text-gray-900">{{ topping.topping.name }}</span>
                  </div>
                  <span class="text-amber-600 font-semibold">
                    +Rp {{ formatPrice(topping.topping.price) }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-3">
              <label class="block font-semibold text-gray-900">Special Notes (Optional)</label>
              <textarea v-model="customization.notes" rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Any special requests? (e.g., extra hot, less foam)"></textarea>
            </div>

            <!-- Quantity -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span class="font-semibold text-gray-900">Quantity</span>
              <div class="flex items-center gap-3">
                <button @click="quantity > 1 && quantity--"
                  class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 hover:border-amber-600 transition-colors disabled:opacity-50"
                  :disabled="quantity <= 1">
                  <Icon name="mdi:minus" class="w-5 h-5" />
                </button>
                <span class="w-12 text-center font-bold text-lg">{{ quantity }}</span>
                <button @click="quantity++"
                  class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 hover:border-amber-600 transition-colors">
                  <Icon name="mdi:plus" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="bg-amber-50 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Base Price</span>
                <span class="font-medium">Rp {{ formatPrice(getSelectedPrice()) }}</span>
              </div>
              <div v-if="getToppingTotal() > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Toppings</span>
                <span class="font-medium">Rp {{ formatPrice(getToppingTotal()) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-amber-200">
                <span>Total</span>
                <span class="text-amber-600">Rp {{ formatPrice(calculateTotal()) }}</span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button @click="handleAddToCart" :disabled="!customization.size || !selectedMenu.isAvailable"
              class="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <Icon name="mdi:cart-plus" class="w-5 h-5" />
              <span v-if="selectedMenu.isAvailable">Add {{ quantity }} to Cart</span>
              <span v-else>Sold Out</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useHead } from 'nuxt/app'

// Types
interface MenuPrice {
  id: string
  size: string
  price: number
}

interface Topping {
  id: string
  name: string
  price: number
}

interface MenuTopping {
  id: string
  topping: Topping
}

interface Menu {
  id: string
  name: string
  description: string | null
  category: string
  image: string | null
  isAvailable: boolean
  prices: MenuPrice[]
  toppings: MenuTopping[]
}

// Composables
const { addToCart } = useCart()
const { isAuthenticated, fetchUser } = useAuth()
const { success, warning } = useToast()

// State
const menus = ref<Menu[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('ALL')
const showModal = ref(false)
const selectedMenu = ref<Menu | null>(null)
const quantity = ref(1)
const customization = ref({
  size: '',
  iceLevel: 'NORMAL',
  sugarLevel: 'NORMAL',
  toppings: [] as string[],
  notes: ''
})

// Computed
const filteredMenus = computed(() => {
  let filtered = menus.value

  // Filter by category
  if (selectedCategory.value !== 'ALL') {
    filtered = filtered.filter(m => m.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(query) ||
      (m.description?.toLowerCase().includes(query) || false)
    )
  }

  // Only show available menus
  return filtered.filter(m => m.isAvailable)
})

// Methods
const loadMenus = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/menu/all')
    menus.value = (response.data as any) || []
  } catch (error) {
    console.error('Failed to load menus:', error)
    menus.value = []
  } finally {
    loading.value = false
  }
}

const openDetailModal = (menu: Menu) => {
  selectedMenu.value = menu
  showModal.value = true
  quantity.value = 1

  // Set default size to the first (smallest/cheapest)
  if (menu.prices && menu.prices.length > 0) {
    customization.value.size = menu.prices[0]?.size || ''
  } else {
    customization.value.size = ''
  }

  // Reset customization
  customization.value.iceLevel = 'NORMAL'
  customization.value.sugarLevel = 'NORMAL'
  customization.value.toppings = []
  customization.value.notes = ''
}

const closeModal = () => {
  showModal.value = false
  selectedMenu.value = null
}

const getLowestPrice = (menu: Menu) => {
  if (!menu.prices || menu.prices.length === 0) return 0
  return Math.min(...menu.prices.map(p => p.price))
}

const getSelectedPrice = () => {
  if (!selectedMenu.value || !customization.value.size) return 0
  const priceData = selectedMenu.value.prices.find(p => p.size === customization.value.size)
  return priceData ? priceData.price : 0
}

const getToppingTotal = () => {
  if (!selectedMenu.value || !customization.value.toppings.length) return 0

  return customization.value.toppings.reduce((total, toppingId) => {
    const menuTopping = selectedMenu.value!.toppings.find(t => t.topping.id === toppingId)
    return total + (menuTopping ? menuTopping.topping.price : 0)
  }, 0)
}

const calculateTotal = () => {
  const basePrice = getSelectedPrice()
  const toppingsPrice = getToppingTotal()
  return (basePrice + toppingsPrice) * quantity.value
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatSize = (size: string) => {
  const sizeMap: Record<string, string> = {
    'SMALL': 'Small',
    'MEDIUM': 'Medium',
    'LARGE': 'Large'
  }
  return sizeMap[size] || size
}

const handleAddToCart = () => {
  // Check if user is logged in
  if (!isAuthenticated.value) {
    warning('Please login first to add items to cart')
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 1500)
    return
  }

  if (!selectedMenu.value || !customization.value.size) {
    warning('Please select a size')
    return
  }

  // Get size label
  const sizeLabel = formatSize(customization.value.size)

  // Get topping names
  const toppingNames = customization.value.toppings.map(toppingId => {
    const menuTopping = selectedMenu.value!.toppings.find(t => t.topping.id === toppingId)
    return menuTopping ? menuTopping.topping.name : ''
  }).filter(Boolean)

  // Build customization text
  const customDetails = []
  customDetails.push(`Size: ${sizeLabel}`)

  if (selectedMenu.value.category !== 'SNACK') {
    customDetails.push(`Ice: ${customization.value.iceLevel}`)
    customDetails.push(`Sugar: ${customization.value.sugarLevel}`)
  }

  if (toppingNames.length > 0) {
    customDetails.push(`Toppings: ${toppingNames.join(', ')}`)
  }

  if (customization.value.notes) {
    customDetails.push(`Note: ${customization.value.notes}`)
  }

  // Add to cart
  for (let i = 0; i < quantity.value; i++) {
    addToCart({
      id: selectedMenu.value.id + '-' + Date.now() + '-' + i,
      menuId: selectedMenu.value.id,
      name: selectedMenu.value.name,
      price: getSelectedPrice() + getToppingTotal(),
      image: selectedMenu.value.image || '',
      size: customization.value.size,
      iceLevel: selectedMenu.value.category !== 'SNACK' ? customization.value.iceLevel : undefined,
      sugarLevel: selectedMenu.value.category !== 'SNACK' ? customization.value.sugarLevel : undefined,
      toppingIds: customization.value.toppings.length > 0 ? customization.value.toppings : undefined,
      notes: customization.value.notes || undefined,
      customization: customDetails.join(' | ')
    })
  }

  // Show success toast
  success(`${quantity.value} ${selectedMenu.value.name} added to cart!`)

  // Close modal
  closeModal()
}

// Watch modal state for body scroll
watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Load menus on mount
onMounted(() => {
  loadMenus()
  fetchUser() // Restore user session
})

// SEO
useHead({
  title: 'Menu - Coffee Shop',
  meta: [
    { name: 'description', content: 'Browse our full menu of premium coffee, beverages, and snacks.' }
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
</style>
