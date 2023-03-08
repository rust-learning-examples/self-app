import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite' // node14 support
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'

function pathResolve(path) {
  return fileURLToPath(new URL(path, import.meta.url))
}

// https://vitejs.dev/config/
export default defineConfig(async params => {
  const { command, mode } = params
  const ENV = loadEnv(mode, process.cwd())
  console.log('node version', process.version)
  console.info(`running mode: ${ mode }, command: ${ command }, ENV: ${ JSON.stringify(ENV) }`)
  return {
    plugins: [
      vue({
        reactivityTransform: true,
      }),
      vueJsx(),
      // https://github.com/antfu/unplugin-auto-import
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        // imports: ['vue', '@vueuse/core'],
        // dirs: [pathResolve('./components')],
        resolvers: [
          ElementPlusResolver()
        ],
        dts: pathResolve('./auto-imports.d.ts'),
      }),
      // https://github.com/antfu/unplugin-vue-components#configuration
      Components({
        resolvers: [
          ElementPlusResolver({ importStyle: true }),
          IconsResolver({
            // https://github.com/sxzz/element-plus-best-practices/blob/main/src/App.vue
            enabledCollections: ['ep'], // elelemt-plus图标库， eg： <i-ep-refresh />
            alias: { svg2: 'svg-inline', },
            customCollections: ['svg', 'svg-inline'],
          }),
        ],
        dts: pathResolve('./components.d.ts'),
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
        customCollections: {
          // <i-svg-file-copy style="font-size: 50px; fill: red;" />
          svg: FileSystemIconLoader('src/assets/images/svg-icons'),
          'svg-inline': {
            // <i-svg-inline-foo />
            // <i-svg2-foo />
            foo: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100%" height="100%"/><circle cx="50%" cy="50%" r="50" fill="white"/></svg>`,
          },
        },
      }),
    ],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
    },
    resolve: {
      extensions: ['.json', '.js', 'mjs', 'cjs', '.ts', '.jsx', '.tsx', '.vue'],
      alias: {
        '@': pathResolve('./src'),
      },
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // additionalData: `$injectedColor: orange;`
          additionalData: '@import "@/assets/stylesheets/globalInjectedData.scss";',
        },
        // less: {
        //   modifyVars: {
        //     '@primary-color': '#1990EB',
        //   },
        //   javascriptEnabled: true,
        // }
      },
      // postcss: {}
    },
  }
});
