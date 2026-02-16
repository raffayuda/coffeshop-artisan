export default defineNuxtPlugin({
  name: 'cart-loader',
  enforce: 'post', // Run after nuxt-auth-utils
  async setup(nuxtApp) {
    const { loadCart } = useCart()
    
    // Load cart after auth is initialized (client-side only)
    if (import.meta.client) {
      await loadCart()
    }
  }
})
