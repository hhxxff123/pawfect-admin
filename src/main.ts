import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import router from './router';
import '@arco-design/web-vue/dist/arco.css';

// 注入全局配置（可选）
const app = createApp(App);

type SplashStyle = 'morning' | 'forest' | 'seasons' | 'starry';

// 配置全局属性
app.config.globalProperties.$splashConfig = {
  defaultStyle: (import.meta.env.VITE_SPLASH_STYLE || 'morning') as SplashStyle,
  duration: Number(import.meta.env.VITE_SPLASH_DURATION) || 8000,
};

app.use(router);
app.use(ArcoVue);
app.mount('#app');