export const useBarista = () => {
  const orders = useState<any[]>('baristaOrders', () => [])
  const loading = useState<boolean>('baristaLoading', () => false)

  const fetchOrders = async (status: string = 'all') => {
    loading.value = true
    try {
      const response = await $fetch('/api/barista/orders', {
        params: { status }
      })
      orders.value = response.orders
      return { success: true, orders: response.orders }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Failed to fetch orders' }
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      const response = await $fetch('/api/barista/update-status', {
        method: 'POST',
        body: { orderId, status, notes }
      })
      
      // Update local orders
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index].status = status
      }
      
      return { success: true, order: response.order }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Failed to update order status' }
    }
  }

  const getOrderDetail = async (orderId: string) => {
    try {
      const response = await $fetch(`/api/barista/orders/${orderId}`)
      console.log('Get order detail response:', response)
      return { success: true, order: response.order }
    } catch (error: any) {
      console.error('Get order detail error:', error)
      const errorMessage = error.data?.message || error.message || error.statusMessage || 'Failed to fetch order detail'
      return { success: false, error: errorMessage }
    }
  }

  const scanQR = async (qrCode: string) => {
    try {
      const response = await $fetch('/api/barista/scan-qr', {
        method: 'POST',
        body: { qrCode }
      })
      return { success: true, order: response.order }
    } catch (error: any) {
      console.error('Scan QR error:', error)
      const errorMessage = error.data?.message || error.message || error.statusMessage || 'Failed to scan QR code'
      return { success: false, error: errorMessage }
    }
  }

  const updateMenuAvailability = async (menuId: string, isAvailable: boolean) => {
    try {
      const response = await $fetch('/api/barista/menu/availability', {
        method: 'POST',
        body: { menuId, isAvailable }
      })
      return { success: true, menu: response.menu }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Failed to update menu availability' }
    }
  }

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    getOrderDetail,
    scanQR,
    updateMenuAvailability
  }
}
