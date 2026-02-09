/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'fikanova-black': '#050505',
                'fikanova-white': '#FFFFFF',
                'fikanova-blue': '#0056D2',
                'fikanova-gold': '#D4AF37',
            },
            fontFamily: {
                sans: ['Inter', 'Manrope', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier Prime', 'monospace'],
            },
        },
    },
    plugins: [],
}
