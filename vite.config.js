import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow network access
    port: 5173,      // Match what backend expects
    strictPort: true, // Fail if port is already in use
  }
})