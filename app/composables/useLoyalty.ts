export const useLoyalty = () => {
  const loyaltyPoints = useState<number>('loyaltyPoints', () => 0)
  const vouchers = useState<any[]>('vouchers', () => [])

  const fetchLoyaltyPoints = async () => {
    try {
      const response = await $fetch('/api/loyalty/points')
      loyaltyPoints.value = response.points
      return { success: true, points: response.points }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch points' }
    }
  }

  const fetchVouchers = async () => {
    try {
      const response = await $fetch('/api/vouchers/available')
      vouchers.value = response.vouchers
      return { success: true, vouchers: response.vouchers }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch vouchers' }
    }
  }

  const claimVoucher = async (voucherId: string) => {
    try {
      const response = await $fetch(`/api/vouchers/${voucherId}/claim`, {
        method: 'POST'
      })
      return { success: true, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to claim voucher' }
    }
  }

  const fetchLoyaltyHistory = async () => {
    try {
      const response = await $fetch('/api/loyalty/history')
      return { success: true, history: response.history }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch history' }
    }
  }

  return {
    loyaltyPoints,
    vouchers,
    fetchLoyaltyPoints,
    fetchVouchers,
    claimVoucher,
    fetchLoyaltyHistory
  }
}
