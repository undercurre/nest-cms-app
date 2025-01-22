import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : './',
    plugins: [vue(), vueDevTools(), UnoCSS()],
    server: {
      host: '0.0.0.0', // 监听所有网络接口
      port: 5173, // 保持端口不变
      proxy: {
        // 将 /api 开头的请求代理到目标服务器
        '/mova-cms': {
          target: 'http://172.27.36.208:4000', // 目标服务器
          changeOrigin: true, // 是否修改请求的源
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
