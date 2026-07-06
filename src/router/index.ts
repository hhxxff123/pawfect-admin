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
    path: '/business/register',
    name: 'BusinessRegister',
    component: () => import('@/views/business/register/index.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { requiresAuth: true, role: 'user' },
  },
  {
    path: '/business',
    name: 'Business',
    component: () => import('@/views/business/dashboard/index.vue'),
    meta: { requiresAuth: true, role: 'business' },
  },
  {
    path: '/business/monitor',
    name: 'BusinessMonitor',
    component: () => import('@/views/business/monitor/index.vue'),
    meta: { requiresAuth: true, role: 'business' },
  },
  {
    path: '/business/report',
    name: 'BusinessReport',
    component: () => import('@/views/business/report/index.vue'),
    meta: { requiresAuth: true, role: 'business' },
  },
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
    localStorage.removeItem('role');
  }

  const validToken = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 如果页面需要登录但未登录，跳转到登录页
  if (to.meta.requiresAuth && !validToken) {
    next('/login');
    return;
  }

  // 如果页面需要特定角色但用户角色不匹配
  if (to.meta.requiresAuth && to.meta.role && userRole && userRole !== to.meta.role) {
    const redirectUrl = userRole === 'user' ? '/' : '/business';
    next(redirectUrl);
    return;
  }

  // 如果已登录且访问登录页，根据角色跳转到对应首页
  if (to.path === '/login' && validToken) {
    const redirectUrl = userRole === 'business' ? '/business' : '/';
    next(redirectUrl);
    return;
  }

  // 如果已登录且访问注册页，跳转到首页
  if (to.path === '/register' && validToken) {
    const redirectUrl = userRole === 'business' ? '/business' : '/';
    next(redirectUrl);
    return;
  }

  next();
});

export default router;