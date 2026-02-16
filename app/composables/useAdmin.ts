export const useAdmin = () => {
  // Menu Management
  const createMenu = async (data: any) => {
    try {
      const response = await $fetch('/api/admin/menu/create', {
        method: 'POST',
        body: data
      })
      return { success: true, menu: response.menu }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to create menu' }
    }
  }

  const updateMenu = async (menuId: string, data: any) => {
    try {
      const response = await $fetch(`/api/admin/menu/${menuId}`, {
        method: 'PUT',
        body: data
      })
      return { success: true, menu: response.menu }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Failed to update menu' }
    }
  }

  const deleteMenu = async (menuId: string) => {
    try {
      await $fetch(`/api/admin/menu/${menuId}`, {
        method: 'DELETE'
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Failed to delete menu' }
    }
  }

  // Order Management
  const fetchAllOrders = async () => {
    try {
      const response = await $fetch('/api/admin/orders/all')
      return { success: true, orders: response.orders }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch orders' }
    }
  }

  const fetchOrderStats = async () => {
    try {
      const response = await $fetch('/api/admin/orders/stats')
      return { success: true, stats: response.stats }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch stats' }
    }
  }

  const fetchOrders = async (params?: any) => {
    try {
      const response = await $fetch('/api/admin/orders', { query: params })
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch orders' }
    }
  }

  const fetchRevenueReport = async (period: string = 'daily') => {
    try {
      const response = await $fetch('/api/admin/reports/revenue', { query: { period } })
      return { success: true, data: response.data, period: response.period }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch revenue report' }
    }
  }

  const fetchMenuAnalytics = async () => {
    try {
      const response = await $fetch('/api/admin/reports/menu-analytics')
      return { success: true, analytics: response.analytics }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch menu analytics' }
    }
  }

  // User Management
  const fetchAllUsers = async () => {
    try {
      const response = await $fetch('/api/admin/users/all')
      return { success: true, users: response.users }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch users' }
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await $fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: { role }
      })
      return { success: true, user: response.user }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update role' }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await $fetch(`/api/admin/users/${userId}/delete`, {
        method: 'DELETE'
      })
      return { success: true, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to delete user' }
    }
  }

  // Inventory Management
  const fetchIngredients = async () => {
    try {
      const response = await $fetch('/api/admin/inventory/all')
      return { success: true, ingredients: response.ingredients, lowStockCount: response.lowStockCount }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch ingredients' }
    }
  }

  const createIngredient = async (data: any) => {
    try {
      const response = await $fetch('/api/admin/inventory/create', {
        method: 'POST',
        body: data
      })
      return { success: true, ingredient: response.ingredient }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to create ingredient' }
    }
  }

  const updateStock = async (ingredientId: string, data: any) => {
    try {
      const response = await $fetch(`/api/admin/inventory/${ingredientId}/stock`, {
        method: 'PUT',
        body: data
      })
      return { success: true, ingredient: response.ingredient }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update stock' }
    }
  }

  const updateIngredient = async (ingredientId: string, data: any) => {
    try {
      const response = await $fetch(`/api/admin/inventory/${ingredientId}`, {
        method: 'PUT',
        body: data
      })
      return { success: true, ingredient: response.ingredient }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update ingredient' }
    }
  }

  // Voucher Management
  const createVoucher = async (data: any) => {
    try {
      const response = await $fetch('/api/admin/vouchers/create', {
        method: 'POST',
        body: data
      })
      return { success: true, voucher: response.voucher }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to create voucher' }
    }
  }

  const fetchAllVouchers = async () => {
    try {
      const response = await $fetch('/api/admin/vouchers/all')
      return { success: true, vouchers: response.vouchers }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch vouchers' }
    }
  }

  const updateVoucher = async (voucherId: string, data: any) => {
    try {
      const response = await $fetch(`/api/admin/vouchers/${voucherId}`, {
        method: 'PUT',
        body: data
      })
      return { success: true, voucher: response.voucher }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update voucher' }
    }
  }

  // Settings Management
  const fetchSettings = async () => {
    try {
      const response = await $fetch('/api/admin/settings')
      return { success: true, settings: response.settings, operational: response.operational }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch settings' }
    }
  }

  const updateSetting = async (key: string, value: string, type: string = 'string') => {
    try {
      const response = await $fetch('/api/admin/settings/update', {
        method: 'POST',
        body: { key, value, type }
      })
      return { success: true, setting: response.setting }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update setting' }
    }
  }

  const updateOperationalHour = async (data: any) => {
    try {
      const response = await $fetch('/api/admin/settings/operational', {
        method: 'POST',
        body: data
      })
      return { success: true, operational: response.operational }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update operational hour' }
    }
  }

  return {
    // Menu
    createMenu,
    updateMenu,
    deleteMenu,
    // Orders
    fetchAllOrders,
    fetchOrderStats,
    fetchOrders,
    fetchRevenueReport,
    fetchMenuAnalytics,
    // Users
    fetchAllUsers,
    updateUserRole,
    deleteUser,
    // Inventory
    fetchIngredients,
    createIngredient,
    updateStock,
    updateIngredient,
    // Vouchers
    createVoucher,
    fetchAllVouchers,
    updateVoucher,
    // Settings
    fetchSettings,
    updateSetting,
    updateOperationalHour
  }
}
