import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/ai': {
        target: 'http://localhost:5000', // Adjust if backend proxies to DeepSeek or use DeepSeek's API URL directly
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['@lottiefiles/react-lottie-player'], // Force Vite to optimize Lottie package
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Ensure JSX/ESM compatibility
  },
});