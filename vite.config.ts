import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { readFileSync } from 'node:fs';

const { version: appVersion } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  resolve: {
    alias: {
      // Define que toda vez que ler "@", o Vite vai apontar para o diretório "src"
      '@': path.resolve(__dirname, './src/ui'),
    },
  },
  base: "./",
  build: {
    outDir: 'dist-react',
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
