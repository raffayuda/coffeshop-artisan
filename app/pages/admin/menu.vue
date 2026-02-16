<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Menu Management</h1>
          <button @click="openCreateModal"
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Icon name="mdi:plus" class="w-5 h-5" />
            <span>Add New Item</span>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b border-gray-200 px-6">
            <nav class="flex space-x-8" aria-label="Tabs">
              <button
                v-for="cat in categories"
                :key="cat.value"
                @click="activeCategory = cat.value"
                :class="[
                  activeCategory === cat.value
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ cat.label }}
                <span class="ml-2 text-xs">{{ getCountByCategory(cat.value) }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
        </div>

        <!-- Menu Items Grid -->
<div v-else-if="filteredMenus.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div v-for="item in filteredMenus" :key="item.id" 
    class="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
    
    <!-- Image Container -->
    <div class="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <img v-if="item.image" 
        :src="item.image" 
        :alt="item.name" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="mdi:coffee" class="w-20 h-20 text-gray-300" />
      </div>
      
      <!-- Availability Badge -->
      <div class="absolute top-3 right-3">
        <button @click="toggleAvailability(item)"
          :class="[
            item.isAvailable 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-800 hover:bg-gray-900',
            'px-3 py-1.5 text-xs text-white rounded-full font-medium transition-all duration-200 shadow-lg backdrop-blur-sm'
          ]">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-white" 
              :class="item.isAvailable ? 'animate-pulse' : ''"></span>
            {{ item.isAvailable ? 'Available' : 'Sold Out' }}
          </span>
        </button>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-3 left-3">
        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
          {{ item.category.replace('_', ' ') }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Title & Description -->
      <div class="mb-4">
        <h3 class="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {{ item.name }}
        </h3>
        <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {{ item.description }}
        </p>
      </div>

      <!-- Price Section -->
      <div class="mb-4 pb-4 border-b border-gray-100">
        <div class="flex items-baseline gap-1.5">
          <span class="text-xs text-gray-500 font-medium">Starting from</span>
          <span class="text-2xl font-bold text-amber-600">
            Rp {{ formatPrice(getLowestPrice(item)) }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2.5">
        <button @click="openEditModal(item)"
          class="flex-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group/edit">
          <Icon name="mdi:pencil" class="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button @click="confirmDelete(item)"
          class="flex-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group/delete">
          <Icon name="mdi:delete" class="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
</div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <Icon name="mdi:food-off" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No menu items found in this category</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" @click="closeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ editMode ? 'Edit Menu Item' : 'Create New Menu Item' }}
              </h2>
            </div>
            
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Menu Name</label>
                <input v-model="formData.name" type="text" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea v-model="formData.description" rows="3" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select v-model="formData.category" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="COFFEE">Coffee</option>
                  <option value="NON_COFFEE">Non Coffee</option>
                  <option value="SNACK">Snack</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input v-model="formData.image" type="url" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://..." />
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Small Price</label>
                  <input v-model.number="formData.priceSmall" type="number" required min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="25000" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Medium Price</label>
                  <input v-model.number="formData.priceMedium" type="number" required min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="30000" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Large Price</label>
                  <input v-model.number="formData.priceLarge" type="number" required min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="35000" />
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input v-model="formData.isAvailable" type="checkbox" id="available"
                  class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                <label for="available" class="text-sm font-medium text-gray-700">Available for order</label>
              </div>

              <div class="flex gap-3 pt-4">
                <button type="button" @click="closeModal"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="submitting"
                  class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  {{ submitting ? 'Saving...' : (editMode ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

const { createMenu, updateMenu, deleteMenu } = useAdmin()

const menus = ref<any[]>([])
const loading = ref(true)
const activeCategory = ref('ALL')
const showModal = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const currentMenuId = ref('')

const categories = [
  { label: 'All', value: 'ALL' },
  { label: 'Coffee', value: 'COFFEE' },
  { label: 'Non Coffee', value: 'NON_COFFEE' },
  { label: 'Snack', value: 'SNACK' }
]

const formData = ref({
  name: '',
  description: '',
  category: 'COFFEE',
  image: '',
  priceSmall: 0,
  priceMedium: 0,
  priceLarge: 0,
  isAvailable: true
})

const filteredMenus = computed(() => {
  if (activeCategory.value === 'ALL') return menus.value
  return menus.value.filter(m => m.category === activeCategory.value)
})

const fetchMenus = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/menu')
    menus.value = response.menus || []
  } catch (error) {
    console.error('Failed to fetch menus:', error)
  } finally {
    loading.value = false
  }
}

const getCountByCategory = (category: string) => {
  if (category === 'ALL') return menus.value.length
  return menus.value.filter(m => m.category === category).length
}

const getLowestPrice = (item: any) => {
  if (item.prices && item.prices.length > 0) {
    return Math.min(...item.prices.map((p: any) => p.price))
  }
  return 0
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const openCreateModal = () => {
  editMode.value = false
  formData.value = {
    name: '',
    description: '',
    category: 'COFFEE',
    image: '',
    priceSmall: 0,
    priceMedium: 0,
    priceLarge: 0,
    isAvailable: true
  }
  showModal.value = true
}

const openEditModal = (item: any) => {
  editMode.value = true
  currentMenuId.value = item.id
  
  const prices = item.prices || []
  const smallPrice = prices.find((p: any) => p.size === 'SMALL')?.price || 0
  const mediumPrice = prices.find((p: any) => p.size === 'MEDIUM')?.price || 0
  const largePrice = prices.find((p: any) => p.size === 'LARGE')?.price || 0
  
  formData.value = {
    name: item.name,
    description: item.description,
    category: item.category,
    image: item.image,
    priceSmall: smallPrice,
    priceMedium: mediumPrice,
    priceLarge: largePrice,
    isAvailable: item.isAvailable
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

watch(showModal, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

const handleSubmit = async () => {
  submitting.value = true
  
  const payload = {
    name: formData.value.name,
    description: formData.value.description,
    category: formData.value.category,
    image: formData.value.image,
    isAvailable: formData.value.isAvailable,
    prices: [
      { size: 'SMALL', price: formData.value.priceSmall },
      { size: 'MEDIUM', price: formData.value.priceMedium },
      { size: 'LARGE', price: formData.value.priceLarge }
    ]
  }

  let result
  if (editMode.value) {
    result = await updateMenu(currentMenuId.value, payload)
  } else {
    result = await createMenu(payload)
  }

  if (result.success) {
    await fetchMenus()
    closeModal()
    // Success notification (optional - could use toast library)
    console.log('Menu saved successfully')
  } else {
    alert(result.error || 'Failed to save menu. Please try again.')
  }

  submitting.value = false
}

const toggleAvailability = async (item: any) => {
  const result = await updateMenu(item.id, { isAvailable: !item.isAvailable })
  if (result.success) {
    await fetchMenus()
    console.log('Availability updated')
  } else {
    alert(result.error || 'Failed to update availability')
  }
}

const confirmDelete = async (item: any) => {
  if (confirm(`Are you sure you want to delete "${item.name}"?\nThis action cannot be undone.`)) {
    const result = await deleteMenu(item.id)
    if (result.success) {
      await fetchMenus()
      console.log('Menu deleted successfully')
    } else {
      alert(result.error || 'Failed to delete menu. Please try again.')
    }
  }
}

onMounted(() => {
  fetchMenus()
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

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
