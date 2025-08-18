import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/material/styles',
      '@emotion/react',
      '@emotion/styled'
    ]
  },
  server: {
    watch: {
      usePolling: true
    },
    port: 5176,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
} 