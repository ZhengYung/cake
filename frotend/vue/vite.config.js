import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }//讓vue能支援vuetify透過alias載入圖片
    }),
    vuetify({
      autoImport: true,
    }),
    ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
