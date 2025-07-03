import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-ui-2-pages/',
  plugins: [wasm(), react()],
})
