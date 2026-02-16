// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils',
    '@nuxt/icon',
  ],

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Server-only runtime config
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'default-secret-key-change-in-production-min-32-chars',
      name: 'nuxt-session',
      cookie: {
        sameSite: 'lax', // or 'none' if using cross-origin
        path: '/',
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        domain: undefined // Let browser handle domain automatically
      }
    },
    // Public runtime config (accessible on both client and server)
    public: {
      apiBase: process.env.API_BASE_URL || ''
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  app: {
    head: {
      title: 'Artisan Coffee House - Premium Coffee Experience',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Experience the finest artisan coffee, fresh pastries, and a cozy atmosphere at Artisan Coffee House.' },
        { name: 'keywords', content: 'coffee, cafe, espresso, latte, cappuccino, pastries, coffee shop' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    },
    pageTransition: false
  },

  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: ''
        }
      }
    }
  },

  // Nitro configuration for serverless deployment
  nitro: {
    preset: 'vercel',
    storage: {
      // Use memory storage for sessions in serverless
      data: { driver: 'memory' }
    },
    experimental: {
      // Enable async context for better session handling
      asyncContext: true
    }
  }
})