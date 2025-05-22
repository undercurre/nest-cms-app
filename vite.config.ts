import { fileURLToPath, URL } from 'node:url'

import { VantResolver } from '@vant/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base:
      mode === 'development'
        ? './'
        : mode === 'uat'
          ? '/kitchen/offlinedevice/web/cms/markH5/'
          : '/kitchen/offlinedevice/web/cms/markH5/',
    plugins: [
      vue(),
      vueDevTools(),
      UnoCSS({
        configFile: '../uno.config.ts',
      }),
      eslint({ cache: false }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          {
            'vue-i18n': [
              // 自动导入 vue-i18n 相关函数
              'useI18n',
            ],
          },
        ],
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
        // 将 /kitchen-api 开头的请求代理到目标服务器
        '/kitchen-api': {
          target: 'http://172.27.65.66:20000', // 本地服务器
          // target: 'http://172.27.64.144:20030', // 本地服务器
          // target: 'https://uat-mova-common.mova-tech.com/api', // UAT服务器地址
          // target: 'https://mova-common.mova-tech.com/kitchen/offlinedevice', // 生产服务器
          changeOrigin: true, // 是否修改请求的源
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(`[PROXY REQ] ${req.method} ${req.url} => ${options.target}${req.url}`)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(`[PROXY RES] ${req.method} ${req.url} => ${proxyRes.statusCode}`)
            })
            proxy.on('error', (err, req) => {
              console.error(`[PROXY ERROR] ${req.method} ${req.url}:`, err)
            })
          },
          rewrite: (path) => path.replace(/^\/kitchen-api/, ''),
        },
        '/device-api': {
          target: 'http://172.27.65.66:20000', // 本地服务器
          // target: 'http://172.27.64.144:20010', // 本地服务器
          // target: 'https://uat-mova-common.mova-tech.com/api', // UAT服务器地址
          // target: 'https://mova-common.mova-tech.com/kitchen/offlinedevice', // 生产服务器地址
          changeOrigin: true, // 修改请求头中的 Host
          rewrite: (path) => path.replace(/^\/device-api/, ''),
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
    build: {
      assetsDir: 'assets', // 确保静态资源输出到 assets 目录
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]', // 明确资源路径
        },
      },
    },
  }
})
