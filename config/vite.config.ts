import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// ... 其他 import

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // 前端开发端口
    proxy: {
      // 将 '/api' 开头的请求代理到后端服务[reference:18]
      '/api': {
        target: 'http://localhost:8088', // 你的网关地址[reference:19]
        changeOrigin: true,
        // 如果后端接口没有 '/api' 前缀，可以重写路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
