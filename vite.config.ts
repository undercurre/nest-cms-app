import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : './',
    plugins: [
      vue(),
      vueDevTools(),
      UnoCSS({
        configFile: '../uno.config.ts',
      }),
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    server: {
      host: '0.0.0.0', // 监听所有网络接口
      port: 5173, // 保持端口不变
      proxy: {
        // 将 /api 开头的请求代理到目标服务器
        '/mova-cms': {
          target: 'http://192.168.137.16:4000/web/cms', // 目标服务器
          changeOrigin: true, // 是否修改请求的源
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`[PROXY REQ] ${req.method} ${req.url} => ${options.target}${req.url}`)
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(`[PROXY RES] ${req.method} ${req.url} => ${proxyRes.statusCode}`)
            })
            proxy.on('error', (err, req, res) => {
              console.error(`[PROXY ERROR] ${req.method} ${req.url}:`, err)
            })
          },
        },
        '/device-api': {
          target: 'http://172.27.64.144:20010', // 目标服务器
          changeOrigin: true, // 是否修改请求的源
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`[PROXY REQ] ${req.method} ${req.url} => ${options.target}${req.url}`)
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(`[PROXY RES] ${req.method} ${req.url} => ${proxyRes.statusCode}`)
            })
            proxy.on('error', (err, req, res) => {
              console.error(`[PROXY ERROR] ${req.method} ${req.url}:`, err)
            })
          },
        },
      },
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      'process.env.MODE': JSON.stringify(process.env.MODE),
    },
  }
})
