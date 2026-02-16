import { useState } from 'nuxt/app'

export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    popular?: boolean
    isAvailable?: boolean
    sizes?: any[]
}

export const useProducts = () => {
    const products = useState<Product[]>('products', () => [])
    const loading = useState<boolean>('products-loading', () => false)

    const loadProducts = async () => {
        loading.value = true
        try {
            const response = await $fetch('/api/menu/all')
            products.value = response.menus || []
        } catch (error) {
            console.error('Failed to load products:', error)
            // Fallback to local data if API fails
            try {
                const data = await import('../data/products.json')
                products.value = data.default as Product[]
            } catch (err) {
                console.error('Failed to load fallback products:', err)
            }
        } finally {
            loading.value = false
        }
    }

    const getProductsByCategory = (category: string) => {
        if (category === 'all') return products.value
        return products.value.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    const getFeaturedProducts = () => {
        return products.value.filter(p => p.popular)
    }

    const searchProducts = (query: string) => {
        const search = query.toLowerCase()
        return products.value.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        )
    }

    const getProductById = (id: string) => {
        return products.value.find(p => p.id === id)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    return {
        products,
        loading,
        loadProducts,
        getProductsByCategory,
        getFeaturedProducts,
        searchProducts,
        getProductById,
        formatPrice
    }
}
