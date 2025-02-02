import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Define a proxy route
        target: 'https://api.jsonserve.com',  // Target API domain
        changeOrigin: true,  // Change origin header to match the target
        secure: false,  // Disable SSL verification if needed
        rewrite: (path) => path.replace(/^\/api/, ''),  // Rewrite the request path
      },
    },
  },
});
