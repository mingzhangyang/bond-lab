import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three/examples')) {
              return 'three-examples';
            }
            if (id.includes('node_modules/three')) {
              return 'three-core';
            }
            if (id.includes('@react-three/')) {
              return 'three-vendor';
            }
            if (
              id.includes('node_modules/react')
              || id.includes('node_modules/react-dom')
              || id.includes('node_modules/zustand')
              || id.includes('node_modules/lucide-react')
            ) {
              return 'app-vendor';
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
