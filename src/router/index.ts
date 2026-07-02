import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/register', // 新增注册路由
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/dashboard/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
