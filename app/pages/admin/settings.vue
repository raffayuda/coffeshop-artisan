<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    
    <div class="ml-64 flex-1 p-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Store Settings</h1>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
        </div>

        <div v-else class="space-y-6">
          <!-- Store Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Store Information</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input 
                  v-model="settings.storeName" 
                  type="text" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                <textarea 
                  v-model="settings.storeAddress" 
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    v-model="settings.storePhone" 
                    type="tel" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    v-model="settings.storeEmail" 
                    type="email" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button 
                  @click="saveStoreInfo"
                  :disabled="savingStoreInfo"
                  class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                  {{ savingStoreInfo ? 'Saving...' : 'Save Store Info' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Operational Hours -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Operational Hours</h2>
            
            <div class="space-y-3">
              <div 
                v-for="day in daysOfWeek" 
                :key="day"
                class="flex items-center gap-4">
                <div class="w-32">
                  <span class="text-sm font-medium text-gray-900">{{ day }}</span>
                </div>
                
                <div class="flex items-center gap-2 flex-1">
                  <input 
                    v-model="operationalHours[day].isOpen" 
                    type="checkbox" 
                    :id="`${day}-open`"
                    class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
                  <label :for="`${day}-open`" class="text-sm text-gray-600 w-16">Open</label>
                  
                  <template v-if="operationalHours[day].isOpen">
                    <input 
                      v-model="operationalHours[day].openTime" 
                      type="time" 
                      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm">
                    <span class="text-gray-500">to</span>
                    <input 
                      v-model="operationalHours[day].closeTime" 
                      type="time" 
                      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm">
                  </template>
                  <span v-else class="text-sm text-gray-400 italic">Closed</span>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-6">
              <button 
                @click="saveOperationalHours"
                :disabled="savingOperational"
                class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                {{ savingOperational ? 'Saving...' : 'Save Operational Hours' }}
              </button>
            </div>
          </div>

          <!-- Payment Settings -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Payment Settings</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                <input 
                  v-model.number="settings.taxRate" 
                  type="number" 
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                <p class="text-xs text-gray-500 mt-1">Enter tax percentage (e.g., 10 for 10%)</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (Rp)</label>
                <input 
                  v-model.number="settings.deliveryFee" 
                  type="number" 
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Enabled Payment Methods</label>
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="method in paymentMethods" :key="method.value" class="flex items-center gap-2">
                    <input 
                      v-model="enabledPayments[method.value]" 
                      type="checkbox" 
                      :id="method.value"
                      class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
                    <label :for="method.value" class="text-sm text-gray-700">{{ method.label }}</label>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button 
                  @click="savePaymentSettings"
                  :disabled="savingPayment"
                  class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                  {{ savingPayment ? 'Saving...' : 'Save Payment Settings' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Loyalty Settings -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Loyalty & Rewards</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Points per Rp 10,000 Spent</label>
                <input 
                  v-model.number="settings.loyaltyPointsRate" 
                  type="number" 
                  min="1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                <p class="text-xs text-gray-500 mt-1">Customer earns this many points for every Rp 10,000 spent</p>
              </div>

              <div class="flex items-center gap-2">
                <input 
                  v-model="settings.loyaltyEnabled" 
                  type="checkbox" 
                  id="loyaltyEnabled"
                  class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
                <label for="loyaltyEnabled" class="text-sm font-medium text-gray-700">
                  Enable Loyalty Program
                </label>
              </div>

              <div class="flex justify-end pt-4">
                <button 
                  @click="saveLoyaltySettings"
                  :disabled="savingLoyalty"
                  class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                  {{ savingLoyalty ? 'Saving...' : 'Save Loyalty Settings' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Order Settings -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Settings</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Base Preparation Time (minutes)</label>
                <input 
                  v-model.number="settings.basePrepTime" 
                  type="number" 
                  min="1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                <p class="text-xs text-gray-500 mt-1">Base time + 2 minutes per item</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount (Rp)</label>
                <input 
                  v-model.number="settings.minOrderAmount" 
                  type="number" 
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              </div>

              <div class="flex justify-end pt-4">
                <button 
                  @click="saveOrderSettings"
                  :disabled="savingOrder"
                  class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
                  {{ savingOrder ? 'Saving...' : 'Save Order Settings' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

const { fetchSettings, updateSetting, updateOperationalHour } = useAdmin()
const { success, error: showError } = useToast()

const loading = ref(false)
const savingStoreInfo = ref(false)
const savingOperational = ref(false)
const savingPayment = ref(false)
const savingLoyalty = ref(false)
const savingOrder = ref(false)

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const paymentMethods = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Credit/Debit Card' },
  { value: 'DANA', label: 'DANA' },
  { value: 'OVO', label: 'OVO' },
  { value: 'GOPAY', label: 'GoPay' },
  { value: 'VIRTUAL_ACCOUNT', label: 'Virtual Account' }
]

const settings = ref({
  storeName: 'Artisan Coffee House',
  storeAddress: '',
  storePhone: '',
  storeEmail: '',
  taxRate: 10,
  deliveryFee: 10000,
  loyaltyPointsRate: 1,
  loyaltyEnabled: true,
  basePrepTime: 5,
  minOrderAmount: 0
})

const operationalHours = ref<any>({})

const enabledPayments = ref<any>({
  CASH: true,
  CARD: true,
  DANA: true,
  OVO: true,
  GOPAY: true,
  VIRTUAL_ACCOUNT: true
})

// Initialize operational hours for all days
daysOfWeek.forEach(day => {
  operationalHours.value[day] = {
    isOpen: true,
    openTime: '08:00',
    closeTime: '22:00'
  }
})

const loadSettings = async () => {
  loading.value = true
  const result = await fetchSettings()
  loading.value = false
  
  if (result.success) {
    // Parse settings
    if (result.settings && result.settings.length > 0) {
      result.settings.forEach((setting: any) => {
        const key = setting.key
        let value = setting.value
        
        // Parse value based on type
        if (setting.type === 'number') {
          value = parseFloat(value)
        } else if (setting.type === 'boolean') {
          value = value === 'true'
        } else if (setting.type === 'json') {
          value = JSON.parse(value)
        }
        
        if (key in settings.value) {
          (settings.value as any)[key] = value
        } else if (key === 'enabledPayments') {
          enabledPayments.value = value
        }
      })
    }
    
    // Parse operational hours
    if (result.operational && result.operational.length > 0) {
      result.operational.forEach((op: any) => {
        operationalHours.value[op.day] = {
          isOpen: op.isOpen,
          openTime: op.openTime,
          closeTime: op.closeTime
        }
      })
    }
  } else {
    showError(result.error)
  }
}

const saveStoreInfo = async () => {
  savingStoreInfo.value = true
  
  const updates = [
    { key: 'storeName', value: settings.value.storeName, type: 'string' },
    { key: 'storeAddress', value: settings.value.storeAddress, type: 'string' },
    { key: 'storePhone', value: settings.value.storePhone, type: 'string' },
    { key: 'storeEmail', value: settings.value.storeEmail, type: 'string' }
  ]
  
  for (const update of updates) {
    await updateSetting(update.key, update.value, update.type)
  }
  
  savingStoreInfo.value = false
  success('Store information saved successfully')
}

const saveOperationalHours = async () => {
  savingOperational.value = true
  
  for (const day of daysOfWeek) {
    const data = operationalHours.value[day]
    await updateOperationalHour({
      day,
      openTime: data.openTime,
      closeTime: data.closeTime,
      isOpen: data.isOpen
    })
  }
  
  savingOperational.value = false
  success('Operational hours saved successfully')
}

const savePaymentSettings = async () => {
  savingPayment.value = true
  
  await updateSetting('taxRate', settings.value.taxRate.toString(), 'number')
  await updateSetting('deliveryFee', settings.value.deliveryFee.toString(), 'number')
  await updateSetting('enabledPayments', JSON.stringify(enabledPayments.value), 'json')
  
  savingPayment.value = false
  success('Payment settings saved successfully')
}

const saveLoyaltySettings = async () => {
  savingLoyalty.value = true
  
  await updateSetting('loyaltyPointsRate', settings.value.loyaltyPointsRate.toString(), 'number')
  await updateSetting('loyaltyEnabled', settings.value.loyaltyEnabled.toString(), 'boolean')
  
  savingLoyalty.value = false
  success('Loyalty settings saved successfully')
}

const saveOrderSettings = async () => {
  savingOrder.value = true
  
  await updateSetting('basePrepTime', settings.value.basePrepTime.toString(), 'number')
  await updateSetting('minOrderAmount', settings.value.minOrderAmount.toString(), 'number')
  
  savingOrder.value = false
  success('Order settings saved successfully')
}

onMounted(() => {
  loadSettings()
})
</script>
