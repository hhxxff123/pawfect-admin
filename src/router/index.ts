import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { requiresAuth: true },  // 标记此页面需要登录
  },
  // 后续可添加其他需要登录的页面
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== 检查 token 是否过期 =====
function isTokenExpired(): boolean {
  const expireTime = localStorage.getItem('tokenExpire');
  if (!expireTime) return true;
  return Number(expireTime) < Date.now();
}

// ===== 路由守卫：检查登录状态 =====
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // 如果 token 存在但已过期，清除 token
  if (token && isTokenExpired()) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpire');
    localStorage.removeItem('userInfo');
    const newToken = null;
  }

  const validToken = localStorage.getItem('token');

  // 如果页面需要登录但未登录，跳转到登录页
  if (to.meta.requiresAuth && !validToken) {
    next('/login');
    return;
  }

  // 如果已登录且访问登录页，跳转到首页（避免重复登录）
  if (to.path === '/login' && validToken) {
    next('/');
    return;
  }

  // 如果已登录且访问注册页，跳转到首页
  if (to.path === '/register' && validToken) {
    next('/');
    return;
  }

  next();
});

export default router;