<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
            <Icon name="mdi:plus" class="w-5 h-5 inline-block mr-2" />
            Add Ingredient
          </button>
        </div>

        <!-- Alert for Low Stock -->
        <div v-if="lowStockCount > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-3">
            <Icon name="mdi:alert" class="w-6 h-6 text-red-600" />
            <div>
              <p class="text-sm font-medium text-red-900">Low Stock Alert!</p>
              <p class="text-sm text-red-700">{{ lowStockCount }} ingredient(s) are running low on stock</p>
            </div>
          </div>
        </div>

        <!-- Ingredients Grid -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
        </div>

        <div v-else-if="ingredients.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Icon name="mdi:package-variant" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-600 mb-4">No ingredients yet</p>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            Add First Ingredient
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="ingredient in ingredients" 
            :key="ingredient.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="p-6">
              <!-- Header -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ ingredient.name }}</h3>
                  <p class="text-sm text-gray-500">Used in {{ ingredient.menusCount }} menu(s)</p>
                </div>
                <div 
                  v-if="ingredient.isLowStock" 
                  class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                  Low Stock
                </div>
              </div>

              <!-- Stock Info -->
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Current Stock:</span>
                  <span class="font-semibold text-gray-900">{{ ingredient.currentStock }} {{ ingredient.unit }}</span>
                </div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Min Stock:</span>
                  <span class="font-semibold text-gray-900">{{ ingredient.minStock }} {{ ingredient.unit }}</span>
                </div>
                
                <!-- Progress Bar -->
                <div class="mt-3 bg-gray-200 rounded-full h-2">
                  <div 
                    :style="{ width: `${Math.min(100, (ingredient.currentStock / ingredient.minStock) * 100)}%` }"
                    :class="ingredient.isLowStock ? 'bg-red-500' : 'bg-green-500'"
                    class="h-full rounded-full transition-all"></div>
                </div>
              </div>

              <!-- Recent History -->
              <div v-if="ingredient.stockHistories && ingredient.stockHistories.length > 0" class="mb-4">
                <p class="text-xs font-medium text-gray-500 uppercase mb-2">Recent Activity</p>
                <div class="space-y-1">
                  <div 
                    v-for="history in ingredient.stockHistories.slice(0, 3)" 
                    :key="history.id"
                    class="text-xs text-gray-600 flex justify-between">
                    <span>
                      <span :class="history.type === 'IN' ? 'text-green-600' : history.type === 'OUT' ? 'text-red-600' : 'text-blue-600'">
                        {{ history.type }}
                      </span>
                      {{ history.quantity }} {{ ingredient.unit }}
                    </span>
                    <span>{{ formatDate(history.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button 
                  @click="openStockModal(ingredient, 'IN')"
                  class="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">
                  Add Stock
                </button>
                <button 
                  @click="openStockModal(ingredient, 'OUT')"
                  class="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                  Remove
                </button>
                <button 
                  @click="openStockModal(ingredient, 'ADJUSTMENT')"
                  class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
                  <Icon name="mdi:cog" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Ingredient Modal -->
    <Transition name="modal">
      <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeAddModal">
        <div class="bg-white rounded-2xl max-w-md w-full p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Ingredient</h2>
          
          <form @submit.prevent="handleAddIngredient" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input 
                v-model="newIngredient.name" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select 
                v-model="newIngredient.unit" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="ml">ml (milliliters)</option>
                <option value="gram">gram</option>
                <option value="pcs">pcs (pieces)</option>
                <option value="kg">kg (kilograms)</option>
                <option value="liter">liter</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
              <input 
                v-model.number="newIngredient.currentStock" 
                type="number" 
                min="0"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Stock (Alert Threshold)</label>
              <input 
                v-model.number="newIngredient.minStock" 
                type="number" 
                min="0"
                step="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button"
                @click="closeAddModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="adding"
                class="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                {{ adding ? 'Adding...' : 'Add Ingredient' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Stock Update Modal -->
    <Transition name="modal">
      <div v-if="showStockModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeStockModal">
        <div class="bg-white rounded-2xl max-w-md w-full p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ stockModalType === 'IN' ? 'Add Stock' : stockModalType === 'OUT' ? 'Remove Stock' : 'Adjust Stock' }}
          </h2>
          <p class="text-sm text-gray-600 mb-6">{{ selectedIngredient?.name }}</p>
          
          <form @submit.prevent="handleUpdateStock" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ stockModalType === 'ADJUSTMENT' ? 'New Stock Level' : 'Quantity' }} ({{ selectedIngredient?.unit }})
              </label>
              <input 
                v-model.number="stockUpdate.quantity" 
                type="number" 
                min="0"
                step="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              
              <p v-if="stockModalType !== 'ADJUSTMENT'" class="text-sm text-gray-500 mt-2">
                Current: {{ selectedIngredient?.currentStock }} {{ selectedIngredient?.unit }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea 
                v-model="stockUpdate.notes" 
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"></textarea>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button"
                @click="closeStockModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="updating"
                class="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                {{ updating ? 'Updating...' : 'Update Stock' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

const { fetchIngredients, createIngredient, updateStock } = useAdmin()
const { success, error: showError } = useToast()

const loading = ref(false)
const adding = ref(false)
const updating = ref(false)
const ingredients = ref<any[]>([])
const lowStockCount = ref(0)

const showAddModal = ref(false)
const showStockModal = ref(false)
const selectedIngredient = ref<any>(null)
const stockModalType = ref<'IN' | 'OUT' | 'ADJUSTMENT'>('IN')

const newIngredient = ref({
  name: '',
  unit: 'ml',
  currentStock: 0,
  minStock: 0
})

const stockUpdate = ref({
  quantity: 0,
  notes: ''
})

const loadIngredients = async () => {
  loading.value = true
  const result = await fetchIngredients()
  loading.value = false
  
  if (result.success && result.ingredients) {
    ingredients.value = result.ingredients
    lowStockCount.value = result.lowStockCount || 0
  } else {
    showError(result.error)
  }
}

const handleAddIngredient = async () => {
  adding.value = true
  const result = await createIngredient(newIngredient.value)
  adding.value = false
  
  if (result.success) {
    success('Ingredient added successfully')
    closeAddModal()
    loadIngredients()
  } else {
    showError(result.error)
  }
}

const openStockModal = (ingredient: any, type: 'IN' | 'OUT' | 'ADJUSTMENT') => {
  selectedIngredient.value = ingredient
  stockModalType.value = type
  stockUpdate.value = {
    quantity: type === 'ADJUSTMENT' ? ingredient.currentStock : 0,
    notes: ''
  }
  showStockModal.value = true
}

const handleUpdateStock = async () => {
  if (!selectedIngredient.value) return
  
  updating.value = true
  const result = await updateStock(selectedIngredient.value.id, {
    quantity: stockUpdate.value.quantity,
    type: stockModalType.value,
    notes: stockUpdate.value.notes || undefined
  })
  updating.value = false
  
  if (result.success) {
    success('Stock updated successfully')
    closeStockModal()
    loadIngredients()
  } else {
    showError(result.error)
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  newIngredient.value = {
    name: '',
    unit: 'ml',
    currentStock: 0,
    minStock: 0
  }
}

const closeStockModal = () => {
  showStockModal.value = false
  selectedIngredient.value = null
  stockUpdate.value = {
    quantity: 0,
    notes: ''
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadIngredients()
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
