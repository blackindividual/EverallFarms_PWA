import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      includeAssets: ['vite.svg', 'icons/apple-touch-icon-180.png'],
      manifest: {
        name: 'EverallFarm_Lite',
        short_name: 'EverallFarm Lite',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
        description: 'Elder-friendly poultry farm management PWA',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ],
      },
    }),
  ],
})
