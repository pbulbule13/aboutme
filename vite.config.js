import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use root path for Cloud Run, subdirectory for GitHub Pages
  const base = process.env.DEPLOY_TARGET === 'cloudrun' ? '/' : '/aboutme/'

  return {
    plugins: [react()],
    base: base,
  }
})
