/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                espresso: 'rgb(var(--color-espresso) / <alpha-value>)',
                'dark-roast': 'rgb(var(--color-dark-roast) / <alpha-value>)',
                'medium-roast': 'rgb(var(--color-medium-roast) / <alpha-value>)',
                'light-roast': 'rgb(var(--color-light-roast) / <alpha-value>)',
                cream: 'rgb(var(--color-cream) / <alpha-value>)',
                foam: 'rgb(var(--color-foam) / <alpha-value>)',
                caramel: 'rgb(var(--color-caramel) / <alpha-value>)',
                mocha: 'rgb(var(--color-mocha) / <alpha-value>)',
                cinnamon: 'rgb(var(--color-cinnamon) / <alpha-value>)',
            },
        },
    },
    plugins: [],
}
