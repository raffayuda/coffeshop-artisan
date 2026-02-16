import { useState } from "nuxt/app"
import { computed } from "vue"

export interface CartItem {
    id: string
    menuId: string // Original menu ID
    name: string
    price: number
    quantity: number
    image: string
    size: string // SMALL, MEDIUM, LARGE
    iceLevel?: string // LESS, NORMAL, EXTRA
    sugarLevel?: string // LESS, NORMAL, EXTRA
    toppingIds?: string[] // Array of topping IDs
    notes?: string // Special notes
    customization?: string // Store customization details as string for display
}

export const useCart = () => {
    const cartItems = useState<CartItem[]>('cart', () => [])
    const { user } = useAuth()

    // Load cart from database if user is authenticated
    const loadCart = async () => {
        if (!user.value) {
            cartItems.value = []
            return
        }

        try {
            const response = await $fetch('/api/cart')
            if (response.success && response.cartItems) {
                // Transform database cart items to match CartItem interface
                cartItems.value = response.cartItems.map((item: any) => {
                    const priceForSize = item.menu.prices.find((p: any) => p.size === item.size)
                    return {
                        id: item.id,
                        menuId: item.menuId,
                        name: item.menu.name,
                        price: priceForSize?.price || 0,
                        quantity: item.quantity,
                        image: item.menu.image,
                        size: item.size,
                        iceLevel: item.iceLevel,
                        sugarLevel: item.sugarLevel,
                        toppingIds: item.toppingIds,
                        notes: item.notes,
                        customization: item.customization
                    }
                })
            }
        } catch (error: any) {
            // Only log error if it's not authentication error
            if (error.statusCode !== 401) {
                console.error('Failed to load cart:', error)
            }
            cartItems.value = []
        }
    }

    const cartCount = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.quantity, 0)
    })

    const cartTotal = computed(() => {
        return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })

    const addToCart = async (product: { 
        id: string
        menuId: string
        name: string
        price: number
        image: string
        size: string
        iceLevel?: string
        sugarLevel?: string
        toppingIds?: string[]
        notes?: string
        customization?: string 
    }) => {
        if (!user.value) {
            throw new Error('Please login to add items to cart')
        }

        try {
            const response = await $fetch('/api/cart/add', {
                method: 'POST',
                body: {
                    menuId: product.menuId,
                    size: product.size,
                    quantity: 1,
                    iceLevel: product.iceLevel,
                    sugarLevel: product.sugarLevel,
                    toppingIds: product.toppingIds,
                    notes: product.notes,
                    customization: product.customization
                }
            })

            if (response.success) {
                await loadCart()
            }
        } catch (error) {
            console.error('Failed to add to cart:', error)
            throw error
        }
    }

    const removeFromCart = async (productId: string) => {
        try {
            const response = await $fetch(`/api/cart/${productId}`, {
                method: 'DELETE'
            })

            if (response.success) {
                cartItems.value = cartItems.value.filter(item => item.id !== productId)
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error)
            throw error
        }
    }

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId)
            return
        }

        try {
            const response = await $fetch(`/api/cart/${productId}`, {
                method: 'PUT',
                body: { quantity }
            })

            if (response.success) {
                const item = cartItems.value.find(item => item.id === productId)
                if (item) {
                    item.quantity = quantity
                }
            }
        } catch (error) {
            console.error('Failed to update quantity:', error)
            throw error
        }
    }

    const clearCart = async () => {
        // Clear state immediately first
        cartItems.value = []
        
        if (!user.value) {
            return
        }

        try {
            await $fetch('/api/cart/clear', {
                method: 'POST'
            })
        } catch (error) {
            console.error('Failed to clear cart from database:', error)
            // State already cleared, so we don't throw error
        }
    }

    const isInCart = (productId: string) => {
        return cartItems.value.some(item => item.id === productId)
    }

    const getItemQuantity = (productId: string) => {
        const item = cartItems.value.find(item => item.id === productId)
        return item ? item.quantity : 0
    }

    return {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
        isInCart,
        getItemQuantity
    }
}
