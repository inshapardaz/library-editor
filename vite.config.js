import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
    // @inshapardaz/likhari-react's package.json exports a "development"
    // condition pointing at its unpublished TypeScript source (only "dist"
    // ships to npm). Vite's dev server picks that condition by default and
    // fails to resolve it, so pin resolution to the published "import"
    // build instead.
    conditions: ['import', 'module', 'browser', 'default'],
  },
  server: {
    port: 4300,
  },
})
