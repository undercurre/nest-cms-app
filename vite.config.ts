import { fileURLToPath, URL } from 'node:url'

import { VantResolver } from '@vant/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
// import { visualizer } from 'rollup-plugin-visualizer' // 添加构建分析工具
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import eslint from 'vite-plugin-eslint'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [
    vue(),
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
    // 添加构建分析插件（仅在生产环境启用）
    // visualizer({
    //   open: true,
    //   filename: 'stats.html',
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
    viteCompression({
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 生成的文件后缀
      threshold: 10240, // 对大于 10KB 的文件压缩
      deleteOriginFile: false, // 是否删除原始文件（建议保留）
    }),
  ]
  if (mode === 'uat') {
    plugins.push(vueDevTools())
  }
  return {
    base: mode === 'development' ? './' : '/kitchen/offlinedevice/web/cms/markH5/',
    plugins: plugins,
    server: {
      host: '0.0.0.0', // 监听所有网络接口
      port: 5173, // 保持端口不变
      proxy: {
        // 将 /kitchen-app-server 开头的请求代理到目标服务器
        '/kitchen-app-server': {
          // target: 'http://172.27.65.66:20000', // 龙超的本地服务器
          // target: 'http://172.27.64.144:20030', // 刘晴的本地服务器
          target: 'https://uat-mova-common.mova-tech.com/api', // UAT服务器地址
          // target: 'https://mova-common.mova-tech.com/api', // 生产服务器
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
          // rewrite: (path) => path.replace(/^\/kitchen-app-server/, ''),
        },
        '/mova-device': {
          // target: 'http://172.27.65.66:20000', // 龙超的本地服务器
          // target: 'http://172.27.64.144:20010', // 刘晴的本地服务器
          target: 'https://uat-mova-common.mova-tech.com/api', // UAT服务器地址
          // target: 'https://mova-common.mova-tech.com/api', // 生产服务器地址
          changeOrigin: true, // 修改请求头中的 Host
          // rewrite: (path) => path.replace(/^\/mova-device/, '/device-api'), // 注意！！！刘晴的本地服务器
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
