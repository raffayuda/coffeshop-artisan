export const useOrders = () => {
  const orders = useState<any[]>('orders', () => [])
  const currentOrder = useState<any>('currentOrder', () => null)

  const createOrder = async (data: {
    items: any[]
    orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'
    paymentMethod: 'CASH' | 'CARD' | 'E_WALLET'
    addressId?: string
    voucherCode?: string
    notes?: string
  }) => {
    try {
      const response = await $fetch('/api/orders/create', {
        method: 'POST',
        body: data
      })
      return { success: true, order: response.order }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Order creation failed' }
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await $fetch('/api/orders/history')
      orders.value = response.orders
      return { success: true, orders: response.orders }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch orders' }
    }
  }

  const fetchOrderById = async (orderId: string) => {
    try {
      const response = await $fetch(`/api/orders/${orderId}`)
      currentOrder.value = response.order
      return { success: true, order: response.order }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch order' }
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await $fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST'
      })
      return { success: true, order: response.order }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to cancel order' }
    }
  }

  return {
    orders,
    currentOrder,
    createOrder,
    fetchOrders,
    fetchOrderById,
    cancelOrder
  }
}
