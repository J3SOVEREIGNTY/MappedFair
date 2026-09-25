import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'MappedFair — your local fair plan',
      short_name: 'MappedFair',
      description: 'A small offline venue list and itinerary for the Minnesota State Fair.',
      start_url: './',
      scope: './',
      display: 'standalone',
      theme_color: '#303b31',
      background_color: '#f8f7f0',
      icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    },
    includeAssets: ['icon.svg'],
    workbox: { globPatterns: ['**/*.{html,js,css,svg}'], navigateFallback: 'index.html' },
  })],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
