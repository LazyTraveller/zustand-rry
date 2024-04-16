import { defineConfig, } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import posscssPxToViewport  from "postcss-px-to-viewport";
import path from "path";
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteMockServe()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 路径别名
      "~": path.resolve(__dirname, "./"),
    },
  },
  server: {
    host: "localhost", // 设置为true则监听所有地址
    hmr: true,
    // 反向代理
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        additionalData: `@import "${fileURLToPath(new URL('./src/styles/variables.less', import.meta.url))}";`,// 引入全局变量文件
      }
    },
    postcss: {
      plugins: [
        // 默认使用 px 作为样式单位，如果需要使用 viewport 单位 (vw, vh, vmin, vmax)
        posscssPxToViewport({
          visualViewport: 375
        })
      ]
    }
  },
  build: {
    assetsInlineLimit: 4096 // 图片转base64编码的阀值
  }
});
