import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || __dirname, '.'),
      },
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '3000'),
      strictPort: false,
      middlewareMode: false,
      allowedHosts: ['andrade-cardoso-advocacia.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
    },
    server: {
      // Disable HMR WebSocket connection errors in iFrame, cloud previews, proxies and Render
      hmr: false,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
