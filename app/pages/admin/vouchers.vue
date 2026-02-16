<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Vouchers & Promotions</h1>
          <button 
            @click="showCreateModal = true"
            class="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
            <Icon name="mdi:plus" class="w-5 h-5 inline-block mr-2" />
            Create Voucher
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex gap-4">
            <button 
              v-for="filter in ['all', 'active', 'expired', 'exhausted']" 
              :key="filter"
              @click="statusFilter = filter"
              :class="statusFilter === filter ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors">
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- Vouchers Grid -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
        </div>

        <div v-else-if="filteredVouchers.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Icon name="mdi:ticket-percent" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-600 mb-4">No vouchers found</p>
          <button 
            @click="showCreateModal = true"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            Create First Voucher
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="voucher in filteredVouchers" 
            :key="voucher.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <!-- Voucher Header with Gradient -->
            <div class="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold">{{ voucher.code }}</h3>
                  <p class="text-sm opacity-90">{{ voucher.name }}</p>
                </div>
                <div v-if="voucher.isExpired" class="px-2 py-1 bg-red-500 rounded text-xs font-medium">
                  Expired
                </div>
                <div v-else-if="voucher.remainingQuota === 0" class="px-2 py-1 bg-gray-500 rounded text-xs font-medium">
                  Exhausted
                </div>
                <div v-else-if="voucher.isActive" class="px-2 py-1 bg-green-500 rounded text-xs font-medium">
                  Active
                </div>
                <div v-else class="px-2 py-1 bg-gray-500 rounded text-xs font-medium">
                  Inactive
                </div>
              </div>
              
              <div class="text-3xl font-bold">
                <span v-if="voucher.type === 'PERCENTAGE'">{{ voucher.value }}%</span>
                <span v-else>Rp {{ formatPrice(voucher.value) }}</span>
              </div>
              <p class="text-sm opacity-90">
                {{ voucher.type === 'PERCENTAGE' ? 'Discount' : 'Fixed Discount' }}
              </p>
            </div>

            <!-- Voucher Body -->
            <div class="p-6">
              <div v-if="voucher.description" class="mb-4">
                <p class="text-sm text-gray-600">{{ voucher.description }}</p>
              </div>

              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Min. Purchase:</span>
                  <span class="font-medium">Rp {{ formatPrice(voucher.minPurchase) }}</span>
                </div>
                <div v-if="voucher.maxDiscount" class="flex justify-between">
                  <span class="text-gray-600">Max. Discount:</span>
                  <span class="font-medium">Rp {{ formatPrice(voucher.maxDiscount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Used / Quota:</span>
                  <span class="font-medium">{{ voucher.quotaUsed }} / {{ voucher.quotaLimit }}</span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="bg-gray-200 rounded-full h-2">
                  <div 
                    :style="{ width: `${(voucher.quotaUsed / voucher.quotaLimit) * 100}%` }"
                    class="bg-amber-600 h-full rounded-full transition-all"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ voucher.remainingQuota }} remaining</p>
              </div>

              <!-- Valid Period -->
              <div class="text-xs text-gray-600 mb-4">
                <div class="flex items-center gap-2 mb-1">
                  <Icon name="mdi:calendar-start" class="w-4 h-4" />
                  <span>Valid from: {{ formatFullDate(voucher.validFrom) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="mdi:calendar-end" class="w-4 h-4" />
                  <span>Valid to: {{ formatFullDate(voucher.validTo) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button 
                  @click="openEditModal(voucher)"
                  class="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
                  Edit
                </button>
                <button 
                  @click="toggleVoucherStatus(voucher)"
                  :class="voucher.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'"
                  class="flex-1 px-3 py-2 rounded-lg text-sm font-medium">
                  {{ voucher.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Voucher Modal -->
    <Transition name="modal">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeCreateModal">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ editingVoucher ? 'Edit Voucher' : 'Create New Voucher' }}
          </h2>
          
          <form @submit.prevent="handleSaveVoucher" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Voucher Code *</label>
                <input 
                  v-model="voucherForm.code" 
                  type="text" 
                  required
                  placeholder="WELCOME50"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 uppercase">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Voucher Name *</label>
                <input 
                  v-model="voucherForm.name" 
                  type="text" 
                  required
                  placeholder="Welcome Discount"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                v-model="voucherForm.description" 
                rows="2"
                placeholder="Special discount for new customers"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select 
                  v-model="voucherForm.type" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (Rp)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ voucherForm.type === 'PERCENTAGE' ? 'Percentage *' : 'Amount (Rp) *' }}
                </label>
                <input 
                  v-model.number="voucherForm.value" 
                  type="number" 
                  required
                  :min="voucherForm.type === 'PERCENTAGE' ? 1 : 1000"
                  :max="voucherForm.type === 'PERCENTAGE' ? 100 : undefined"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Min. Purchase (Rp) *</label>
                <input 
                  v-model.number="voucherForm.minPurchase" 
                  type="number" 
                  required
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max. Discount (Rp)</label>
                <input 
                  v-model.number="voucherForm.maxDiscount" 
                  type="number" 
                  min="0"
                  placeholder="Leave empty for no limit"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quota Limit *</label>
              <input 
                v-model.number="voucherForm.quotaLimit" 
                type="number" 
                required
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Valid From *</label>
                <input 
                  v-model="voucherForm.validFrom" 
                  type="datetime-local" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Valid To *</label>
                <input 
                  v-model="voucherForm.validTo" 
                  type="datetime-local" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input 
                v-model="voucherForm.isActive" 
                type="checkbox" 
                id="isActive"
                class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
              <label for="isActive" class="text-sm font-medium text-gray-700">Activate immediately</label>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button"
                @click="closeCreateModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                {{ saving ? 'Saving...' : editingVoucher ? 'Update Voucher' : 'Create Voucher' }}
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

const { fetchAllVouchers, createVoucher, updateVoucher } = useAdmin()
const { success, error: showError } = useToast()

const loading = ref(false)
const saving = ref(false)
const vouchers = ref<any[]>([])
const statusFilter = ref('all')
const showCreateModal = ref(false)
const editingVoucher = ref<any>(null)

const voucherForm = ref({
  code: '',
  name: '',
  description: '',
  type: 'PERCENTAGE',
  value: 0,
  minPurchase: 0,
  maxDiscount: null,
  quotaLimit: 100,
  validFrom: '',
  validTo: '',
  isActive: true
})

const filteredVouchers = computed(() => {
  let filtered = vouchers.value
  const now = new Date()
  
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(v => v.isActive && !v.isExpired && v.remainingQuota > 0)
  } else if (statusFilter.value === 'expired') {
    filtered = filtered.filter(v => v.isExpired)
  } else if (statusFilter.value === 'exhausted') {
    filtered = filtered.filter(v => v.remainingQuota === 0)
  }
  
  return filtered
})

const loadVouchers = async () => {
  loading.value = true
  const result = await fetchAllVouchers()
  loading.value = false
  
  if (result.success && result.vouchers) {
    vouchers.value = result.vouchers
  } else {
    showError(result.error)
  }
}

const handleSaveVoucher = async () => {
  saving.value = true
  
  const data = {
    ...voucherForm.value,
    maxDiscount: voucherForm.value.maxDiscount || null
  }
  
  let result
  if (editingVoucher.value) {
    result = await updateVoucher(editingVoucher.value.id, data)
  } else {
    result = await createVoucher(data)
  }
  
  saving.value = false
  
  if (result.success) {
    success(editingVoucher.value ? 'Voucher updated successfully' : 'Voucher created successfully')
    closeCreateModal()
    loadVouchers()
  } else {
    showError(result.error)
  }
}

const openEditModal = (voucher: any) => {
  editingVoucher.value = voucher
  voucherForm.value = {
    code: voucher.code,
    name: voucher.name,
    description: voucher.description || '',
    type: voucher.type,
    value: voucher.value,
    minPurchase: voucher.minPurchase,
    maxDiscount: voucher.maxDiscount,
    quotaLimit: voucher.quotaLimit,
    validFrom: new Date(voucher.validFrom).toISOString().slice(0, 16),
    validTo: new Date(voucher.validTo).toISOString().slice(0, 16),
    isActive: voucher.isActive
  }
  showCreateModal.value = true
}

const toggleVoucherStatus = async (voucher: any) => {
  const result = await updateVoucher(voucher.id, { isActive: !voucher.isActive })
  if (result.success) {
    success(`Voucher ${result.voucher.isActive ? 'activated' : 'deactivated'}`)
    loadVouchers()
  } else {
    showError(result.error)
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingVoucher.value = null
  voucherForm.value = {
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE',
    value: 0,
    minPurchase: 0,
    maxDiscount: null,
    quotaLimit: 100,
    validFrom: '',
    validTo: '',
    isActive: true
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price || 0)
}

const formatFullDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadVouchers()
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
