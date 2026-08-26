import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { middlewareProductos } from './server/productos';

function apiProductos() {
  return {
    name: 'api-productos-en-memoria',
    configureServer: (servidor: { middlewares: { use: (middleware: typeof middlewareProductos) => void } }) => {
      servidor.middlewares.use(middlewareProductos);
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiProductos()]
});
