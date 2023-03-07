import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(async params => {
  const { command, mode } = params
  const ENV = loadEnv(mode, process.cwd())
  console.log('node version', process.version)
  console.info(`running mode: ${ mode }, command: ${ command }, ENV: ${ JSON.stringify(ENV) }`)
  return {
    plugins: [vue()],
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
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
