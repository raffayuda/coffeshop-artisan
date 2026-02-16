<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Loyalty & Rewards</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Loyalty Points Card -->
        <div class="lg:col-span-1">
          <div class="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">Your Points</h2>
              <Icon name="mdi:star" class="w-8 h-8" />
            </div>
            <p class="text-5xl font-bold mb-2">{{ loyaltyPoints }}</p>
            <p class="text-white/80 mb-6">points available</p>
            
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p class="text-sm mb-1">Next reward at</p>
              <p class="text-2xl font-bold">{{ nextRewardPoints }} pts</p>
              <div class="mt-2 bg-white/30 rounded-full h-2">
                <div class="bg-white h-2 rounded-full" :style="`width: ${pointsProgress}%`"></div>
              </div>
            </div>

            <NuxtLink to="/profile"
              class="block w-full text-center bg-white text-amber-600 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors">
              View History
            </NuxtLink>
          </div>

          <!-- How to Earn -->
          <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">How to Earn Points</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:shopping" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Every Purchase</p>
                  <p class="text-sm text-gray-600">Earn 1 point for every Rp 1,000 spent</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:account-plus" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">New Account</p>
                  <p class="text-sm text-gray-600">Get 50 bonus points on signup</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:share-variant" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Refer Friends</p>
                  <p class="text-sm text-gray-600">Earn 100 points per referral</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vouchers Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Available Vouchers -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-semibold text-gray-900">Available Vouchers</h2>
              <p class="text-sm text-gray-600 mt-1">Claim vouchers and use them on your next order</p>
            </div>

            <div v-if="loading" class="p-8 text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto"></div>
            </div>

            <div v-else-if="vouchers.length === 0" class="p-8 text-center">
              <Icon name="mdi:ticket-outline" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500">No vouchers available at the moment</p>
            </div>

            <div v-else class="p-6 space-y-4">
              <div v-for="voucher in vouchers" :key="voucher.id"
                class="border border-gray-200 rounded-lg p-5 hover:border-amber-300 hover:shadow-md transition-all">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <Icon :name="voucherIcon(voucher.discountType)" class="w-5 h-5 text-amber-600" />
                      <h3 class="text-lg font-semibold text-gray-900">{{ voucher.name }}</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">{{ voucher.description }}</p>
                    
                    <div class="flex items-center gap-4 text-sm">
                      <div class="flex items-center gap-1 text-amber-600 font-semibold">
                        <Icon name="mdi:tag" class="w-4 h-4" />
                        <span>{{ voucher.code }}</span>
                      </div>
                      <div class="flex items-center gap-1 text-gray-600">
                        <Icon name="mdi:calendar" class="w-4 h-4" />
                        <span>Valid until {{ formatDate(voucher.validTo) }}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Min. purchase: Rp {{ formatPrice(voucher.minPurchase) }}</span>
                      <span>{{ voucher.quotaUsed }}/{{ voucher.quotaLimit }} claimed</span>
                    </div>
                  </div>

                  <button @click="claimVoucher(voucher.id)" :disabled="claiming === voucher.id"
                    class="ml-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 whitespace-nowrap">
                    {{ claiming === voucher.id ? 'Claiming...' : 'Claim' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- My Vouchers -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">My Vouchers</h2>
            </div>
            
            <div class="p-6">
              <div v-if="myVouchers.length === 0" class="text-center py-8">
                <Icon name="mdi:inbox" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p class="text-gray-500 text-sm">You don't have any vouchers yet</p>
              </div>
              
              <div v-else class="space-y-3">
                <div v-for="voucher in myVouchers" :key="voucher.id"
                  class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">{{ voucher.name }}</p>
                    <p class="text-sm text-gray-600">Code: {{ voucher.code }}</p>
                  </div>
                  <span v-if="voucher.isUsed"
                    class="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                    Used
                  </span>
                  <button v-else @click="useVoucher(voucher.code)"
                    class="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                    Use Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loyaltyPoints, vouchers: availableVouchers, fetchLoyaltyPoints, fetchVouchers, claimVoucher: claimVoucherApi } = useLoyalty()
const router = useRouter()

const loading = ref(true)
const claiming = ref('')
const vouchers = ref<any[]>([])
const myVouchers = ref<any[]>([])

const nextRewardPoints = computed(() => {
  const currentPoints = loyaltyPoints.value
  const milestones = [100, 250, 500, 1000, 2000, 5000]
  return milestones.find(m => m > currentPoints) || 10000
})

const pointsProgress = computed(() => {
  const current = loyaltyPoints.value
  const next = nextRewardPoints.value
  const previous = [0, 100, 250, 500, 1000, 2000, 5000].reverse().find(m => m < current) || 0
  return Math.min(((current - previous) / (next - previous)) * 100, 100)
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const voucherIcon = (type: string) => {
  return type === 'PERCENTAGE' ? 'mdi:percent' : 'mdi:cash'
}

const claimVoucher = async (voucherId: string) => {
  claiming.value = voucherId
  
  const result = await claimVoucherApi(voucherId)
  
  if (result.success) {
    // Refresh vouchers
    await fetchVouchers()
    await loadMyVouchers()
  } else {
    alert(result.error || 'Failed to claim voucher')
  }
  
  claiming.value = ''
}

const useVoucher = (code: string) => {
  // Navigate to menu with voucher code
  router.push(`/menu?voucher=${code}`)
}

const loadMyVouchers = async () => {
  try {
    const response = await $fetch('/api/vouchers/my-vouchers')
    myVouchers.value = response.vouchers || []
  } catch (error) {
    console.error('Failed to load user vouchers')
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    fetchLoyaltyPoints(),
    fetchVouchers(),
    loadMyVouchers()
  ])
  vouchers.value = availableVouchers.value
  loading.value = false
})
</script>
