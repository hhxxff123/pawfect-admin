<template>
  <div class="business-dashboard" :class="[`theme-${currentTheme}`]">
    <!-- 顶部导航 -->
    <header
      class="dashboard-header"
      :style="{ left: sidebarCollapsed ? '64px' : '220px' }"
    >
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">☰</button>
        <div class="header-tabs">
          <button class="tab-btn active">数据概览</button>
          <button class="tab-btn" @click="navigateTo('/business/monitor')"
            >实时监控</button
          >
          <button class="tab-btn" @click="navigateTo('/business/report')"
            >运营报表</button
          >
        </div>
        <div class="header-status">
          <span class="status-dot online"></span>
          <span class="status-text">店铺在线</span>
        </div>
      </div>
      <div class="header-right">
        <div class="theme-switcher">
          <button
            v-for="theme in themes"
            :key="theme.id"
            class="theme-btn"
            :class="{ active: currentTheme === theme.id }"
            :style="{ background: theme.color }"
            :title="theme.name"
            @click="changeTheme(theme.id)"
          ></button>
        </div>
        <div class="quick-stats">
          <div class="quick-stat">
            <span class="quick-value">¥23,580</span>
            <span class="quick-label">今日营收</span>
          </div>
          <div class="quick-stat">
            <span class="quick-value">128</span>
            <span class="quick-label">今日订单</span>
          </div>
        </div>
        <div class="user-info">
          <span class="user-avatar">👤</span>
          <span class="user-name">商家用户</span>
        </div>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </header>

    <!-- 侧边栏 -->
    <aside class="dashboard-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-icon">💼</span>
          <span class="logo-text">宠迹商家</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">◀</button>
      </div>

      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeNav === item.id }"
          @click="handleNavClick(item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="business-pet">
          <div class="pet-animation">
            <span class="pet-emoji">{{ currentPetEmoji }}</span>
          </div>
          <div class="pet-status">
            <span class="status-text">{{ currentPetStatus }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main
      class="dashboard-content"
      :style="{ marginLeft: sidebarCollapsed ? '64px' : '220px' }"
    >
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">数据概览</h1>
          <p class="page-subtitle">实时监控店铺运营数据</p>
        </div>
        <div class="header-pet">
          <div class="pet-banner">
            <span class="banner-pet">{{ greetingPet }}</span>
            <span class="banner-text">{{ greetingText }}</span>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-icon" :class="stat.iconClass">{{ stat.icon }}</div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-trend" :class="stat.trend">{{ stat.change }}</div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">订单趋势</h3>
            <div class="chart-tabs">
              <button class="chart-tab active">本周</button>
              <button class="chart-tab">本月</button>
              <button class="chart-tab">本季度</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="bar" style="height: 40%">Mon</div>
              <div class="bar" style="height: 65%">Tue</div>
              <div class="bar" style="height: 55%">Wed</div>
              <div class="bar" style="height: 80%">Thu</div>
              <div class="bar" style="height: 90%">Fri</div>
              <div class="bar" style="height: 95%">Sat</div>
              <div class="bar" style="height: 70%">Sun</div>
            </div>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">服务分类</h3>
          </div>
          <div class="chart-placeholder pie-chart">
            <div class="pie-wrapper">
              <div class="pie"></div>
              <div class="pie-center">
                <span class="pie-value">100%</span>
              </div>
            </div>
            <div class="pie-legend">
              <div class="legend-item"
                ><span class="legend-color" style="background: #6366f1"></span
                >美容护理 45%</div
              >
              <div class="legend-item"
                ><span class="legend-color" style="background: #8b5cf6"></span
                >健康体检 30%</div
              >
              <div class="legend-item"
                ><span class="legend-color" style="background: #a855f7"></span
                >寄养服务 15%</div
              >
              <div class="legend-item"
                ><span class="legend-color" style="background: #d946ef"></span
                >其他服务 10%</div
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <h3 class="section-title">快捷操作</h3>
        <div class="action-grid">
          <button
            v-for="action in actions"
            :key="action.text"
            class="action-btn"
          >
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-text">{{ action.text }}</span>
          </button>
        </div>
      </div>

      <!-- 最近订单 -->
      <div class="recent-orders">
        <div class="section-header">
          <h3 class="section-title">最近订单</h3>
          <a href="#" class="view-all">查看全部 →</a>
        </div>
        <table class="orders-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>服务类型</th>
              <th>客户</th>
              <th>金额</th>
              <th>状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.service }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.amount }}</td>
              <td
                ><span class="status-tag" :class="order.status">{{
                  order.statusText
                }}</span></td
              >
              <td>{{ order.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  function navigateTo(path: string) {
    router.push(path);
  }

  // ===== 主题配置 =====
  const themes = [
    { id: 'purple', name: '商务紫', color: '#6366f1' },
    { id: 'blue', name: '科技蓝', color: '#3b82f6' },
    { id: 'green', name: '清新绿', color: '#10b981' },
    { id: 'orange', name: '活力橙', color: '#f59e0b' },
  ];

  const currentTheme = ref('purple');

  function changeTheme(themeId: string) {
    currentTheme.value = themeId;
    Message.success(
      `已切换到${themes.find((t) => t.id === themeId)?.name || ''}主题`
    );
  }

  // ===== 侧边栏状态 =====
  const sidebarCollapsed = ref(false);
  const activeNav = ref('overview');

  const navItems = [
    { id: 'overview', icon: '📊', label: '数据概览', badge: '' },
    { id: 'orders', icon: '📋', label: '订单管理', badge: '5' },
    { id: 'services', icon: '🐾', label: '服务管理', badge: '' },
    { id: 'customers', icon: '👥', label: '客户管理', badge: '12' },
    { id: 'finance', icon: '💰', label: '财务管理', badge: '' },
    { id: 'settings', icon: '⚙️', label: '店铺设置', badge: '' },
  ];

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function handleNavClick(id: string) {
    activeNav.value = id;
    const navMessages: Record<string, string> = {
      overview: '',
      orders: '订单管理功能开发中 📋',
      services: '服务管理功能开发中 🐾',
      customers: '客户管理功能开发中 👥',
      finance: '财务管理功能开发中 💰',
      settings: '店铺设置功能开发中 ⚙️',
    };
    const msg = navMessages[id];
    if (msg) Message.info(msg);
  }

  // ===== 商家宠物动画 =====
  const petStates = [
    { emoji: '🐶', status: '正在处理订单...' },
    { emoji: '🐱', status: '欢迎新客户~' },
    { emoji: '🦴', status: '今日营收不错！' },
    { emoji: '🐾', status: '准备服务中...' },
  ];

  const currentPetIndex = ref(0);
  const currentPetEmoji = computed(
    () => petStates[currentPetIndex.value].emoji
  );
  const currentPetStatus = computed(
    () => petStates[currentPetIndex.value].status
  );

  // ===== 问候语宠物 =====
  const greetingPets = ['🐾', '🐶', '🐱', '🦴', '🐰'];
  const greetingTexts = [
    '今天也要元气满满哦！',
    '待办订单已准备就绪',
    '客户们在等你服务呢~',
    '生意兴隆，财源广进！',
  ];

  const greetingPet = ref('🐾');
  const greetingText = ref('欢迎回来！');

  function updatePetState() {
    currentPetIndex.value = (currentPetIndex.value + 1) % petStates.length;
    const hour = new Date().getHours();
    if (hour < 12) {
      greetingPet.value = '☀️';
      greetingText.value = '早上好！新的一天开始了';
    } else if (hour < 18) {
      greetingPet.value =
        greetingPets[Math.floor(Math.random() * greetingPets.length)];
      greetingText.value =
        greetingTexts[Math.floor(Math.random() * greetingTexts.length)];
    } else {
      greetingPet.value = '🌙';
      greetingText.value = '辛苦了！今天也要加油';
    }
  }

  onMounted(() => {
    updatePetState();
    setInterval(updatePetState, 15000);
  });

  // ===== 统计数据 =====
  const stats = ref([
    {
      icon: '📋',
      label: '今日订单',
      value: '128',
      change: '↑ 12.5%',
      trend: 'up',
      iconClass: 'orders',
    },
    {
      icon: '💰',
      label: '今日营收',
      value: '¥23,580',
      change: '↑ 8.3%',
      trend: 'up',
      iconClass: 'revenue',
    },
    {
      icon: '👥',
      label: '今日客户',
      value: '86',
      change: '↑ 5.2%',
      trend: 'up',
      iconClass: 'customers',
    },
    {
      icon: '⭐',
      label: '平均评分',
      value: '4.9',
      change: '↑ 0.1',
      trend: 'up',
      iconClass: 'rating',
    },
  ]);

  // ===== 快捷操作 =====
  const actions = [
    { icon: '➕', text: '发布服务' },
    { icon: '📝', text: '处理订单' },
    { icon: '📢', text: '发送通知' },
    { icon: '📈', text: '查看报表' },
  ];

  // ===== 订单数据 =====
  const orders = ref([
    {
      id: '#ORD20260706001',
      service: '🐾 美容护理',
      customer: '王女士',
      amount: '¥280',
      status: 'completed',
      statusText: '已完成',
      time: '10:30',
    },
    {
      id: '#ORD20260706002',
      service: '🏥 健康体检',
      customer: '李先生',
      amount: '¥580',
      status: 'processing',
      statusText: '处理中',
      time: '11:15',
    },
    {
      id: '#ORD20260706003',
      service: '🏠 寄养服务',
      customer: '张小姐',
      amount: '¥350',
      status: 'pending',
      statusText: '待确认',
      time: '12:00',
    },
    {
      id: '#ORD20260706004',
      service: '🐾 美容护理',
      customer: '刘先生',
      amount: '¥320',
      status: 'completed',
      statusText: '已完成',
      time: '14:20',
    },
    {
      id: '#ORD20260706005',
      service: '🏥 疫苗接种',
      customer: '陈女士',
      amount: '¥180',
      status: 'processing',
      statusText: '处理中',
      time: '15:45',
    },
  ]);

  // ===== 退出登录 =====
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpire');
    localStorage.removeItem('role');
    Message.success('已退出登录');
    setTimeout(() => {
      window.location.href = '/login';
    }, 400);
  }
</script>

<style scoped>
  /* ===== 主题变量 ===== */
  .theme-purple {
    --theme-color: #6366f1;
    --theme-light: #e0e7ff;
  }
  .theme-blue {
    --theme-color: #3b82f6;
    --theme-light: #dbeafe;
  }
  .theme-green {
    --theme-color: #10b981;
    --theme-light: #d1fae5;
  }
  .theme-orange {
    --theme-color: #f59e0b;
    --theme-light: #fef3c7;
  }

  /* ===== 整体布局 ===== */
  .business-dashboard {
    display: flex;
    min-height: 100vh;
    background: #f5f7fa;
    font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }

  /* ===== 顶部导航 ===== */
  .dashboard-header {
    position: fixed;
    top: 0;
    right: 0;
    height: 64px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    z-index: 100;
    transition: left 0.3s ease;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .sidebar-toggle {
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 8px;
    color: #1a1a2e;
    transition: background 0.2s;
  }

  .sidebar-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .header-left .logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    font-size: 22px;
  }

  .logo-text {
    font-size: 17px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .header-tabs {
    display: flex;
    gap: 4px;
    background: rgba(0, 0, 0, 0.04);
    padding: 4px;
    border-radius: 10px;
  }

  .tab-btn {
    padding: 6px 16px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .tab-btn.active {
    background: var(--theme-light, #e0e7ff);
    color: var(--theme-color, #6366f1);
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .tab-btn:hover:not(.active) {
    color: #374151;
  }

  .header-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 20px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9ca3af;
  }

  .status-dot.online {
    background: #10b981;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .status-text {
    font-size: 13px;
    color: #10b981;
    font-weight: 500;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* ===== 主题切换器 ===== */
  .theme-switcher {
    display: flex;
    gap: 6px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 8px;
  }

  .theme-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .theme-btn:hover {
    transform: scale(1.1);
  }

  .theme-btn.active {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--theme-color, #6366f1);
  }

  /* ===== 快捷统计 ===== */
  .quick-stats {
    display: flex;
    gap: 24px;
    padding-right: 16px;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
  }

  .quick-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .quick-value {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .quick-value::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background: var(--theme-color, #6366f1);
    border-radius: 50%;
    margin-right: 4px;
  }

  .quick-label {
    font-size: 12px;
    color: #9ca3af;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: #f5f7fa;
    border-radius: 20px;
  }

  .user-avatar {
    font-size: 18px;
  }

  .user-name {
    font-size: 14px;
    color: #4a4a68;
  }

  .logout-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background: #f5f7fa;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .logout-btn:hover {
    background: #e5e7eb;
    color: #374151;
  }

  /* ===== 侧边栏 ===== */
  .dashboard-sidebar {
    width: 220px;
    height: 100vh;
    background: #1a1a2e;
    color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    padding-top: 64px;
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
  }

  .dashboard-sidebar.collapsed {
    width: 64px;
  }

  /* 侧边栏顶部 */
  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar-logo .logo-icon {
    font-size: 22px;
  }

  .sidebar-logo .logo-text {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
  }

  .dashboard-sidebar.collapsed .sidebar-logo .logo-text {
    display: none;
  }

  .collapse-btn {
    border: none;
    background: transparent;
    color: #9ca3af;
    font-size: 14px;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .collapse-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  /* 侧边栏导航 */
  .sidebar-nav {
    flex: 1;
    padding: 16px 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #9ca3af;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  .nav-item.active {
    background: var(--theme-color, #6366f1);
    color: #ffffff;
  }

  .nav-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .nav-text {
    flex: 1;
  }

  .dashboard-sidebar.collapsed .nav-text {
    display: none;
  }

  .nav-badge {
    padding: 2px 8px;
    background: #ff6b6b;
    color: #ffffff;
    font-size: 11px;
    border-radius: 10px;
    font-weight: 600;
  }

  .dashboard-sidebar.collapsed .nav-badge {
    display: none;
  }

  /* 侧边栏底部宠物 */
  .sidebar-footer {
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .business-pet {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .pet-animation {
    font-size: 28px;
    animation: petBounce 2s infinite;
  }

  @keyframes petBounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  .pet-status {
    text-align: center;
  }

  .pet-status .status-text {
    font-size: 11px;
    color: #9ca3af;
  }

  .dashboard-sidebar.collapsed .sidebar-footer {
    display: none;
  }

  /* ===== 主内容区 ===== */
  .dashboard-content {
    margin-top: 64px;
    padding: 24px;
    flex: 1;
    transition: margin-left 0.3s ease;
  }

  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content {
    display: flex;
    flex-direction: column;
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: #9ca3af;
    margin: 4px 0 0 0;
  }

  /* 页面标题宠物 */
  .header-pet {
    display: flex;
    align-items: center;
  }

  .pet-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(
      135deg,
      var(--theme-light, #e0e7ff) 0%,
      #ffffff 100%
    );
    border-radius: 20px;
    border: 1px solid rgba(224, 231, 255, 0.5);
    animation: bannerFloat 3s ease-in-out infinite;
  }

  @keyframes bannerFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  .banner-pet {
    font-size: 24px;
    animation: petWiggle 1s infinite;
  }

  @keyframes petWiggle {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(5deg);
    }
  }

  .banner-text {
    font-size: 14px;
    color: #4a4a68;
    font-weight: 500;
  }

  /* ===== 统计卡片 ===== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .stat-icon.orders {
    background: #eff6ff;
  }
  .stat-icon.revenue {
    background: #fef3c7;
  }
  .stat-icon.customers {
    background: #ecfdf5;
  }
  .stat-icon.rating {
    background: #fdf4ff;
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .stat-label {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 2px;
  }

  .stat-trend {
    font-size: 12px;
    margin-top: 4px;
  }

  .stat-trend.up {
    color: #10b981;
  }
  .stat-trend.down {
    color: #ef4444;
  }

  /* ===== 图表区域 ===== */
  .charts-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .chart-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a2e;
    margin: 0;
  }

  .chart-tabs {
    display: flex;
    gap: 8px;
  }

  .chart-tab {
    padding: 4px 12px;
    border: none;
    border-radius: 6px;
    background: #f5f7fa;
    color: #6b7280;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .chart-tab.active {
    background: var(--theme-color, #6366f1);
    color: #ffffff;
  }

  .chart-placeholder {
    height: 200px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 16px 0;
  }

  .chart-bars {
    display: flex;
    flex: 1;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
  }

  .bar {
    width: 32px;
    background: linear-gradient(
      180deg,
      var(--theme-color, #6366f1) 0%,
      #8b5cf6 100%
    );
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 10px;
    color: #6b7280;
    padding-top: 4px;
    transition: height 0.5s ease;
  }

  .pie-chart {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .pie-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .pie {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      var(--theme-color, #6366f1) 0% 45%,
      #8b5cf6 45% 75%,
      #a855f7 75% 90%,
      #d946ef 90% 100%
    );
  }

  .pie-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pie-value {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .pie-legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #6b7280;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  /* ===== 快捷操作 ===== */
  .quick-actions {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a2e;
    margin: 0 0 16px 0;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border: none;
    border-radius: 12px;
    background: #f5f7fa;
    color: #4a4a68;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: var(--theme-color, #6366f1);
    color: #ffffff;
    transform: translateY(-2px);
  }

  .action-icon {
    font-size: 28px;
  }

  .action-text {
    font-size: 13px;
  }

  /* ===== 最近订单 ===== */
  .recent-orders {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .view-all {
    font-size: 13px;
    color: var(--theme-color, #6366f1);
    text-decoration: none;
  }

  .view-all:hover {
    text-decoration: underline;
  }

  .orders-table {
    width: 100%;
    border-collapse: collapse;
  }

  .orders-table th {
    text-align: left;
    padding: 12px;
    font-size: 13px;
    font-weight: 500;
    color: #9ca3af;
    border-bottom: 1px solid #f3f4f6;
  }

  .orders-table td {
    padding: 12px;
    font-size: 14px;
    color: #4a4a68;
    border-bottom: 1px solid #f3f4f6;
  }

  .orders-table tbody tr:hover {
    background: #f9fafb;
  }

  .status-tag {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-tag.completed {
    background: #ecfdf5;
    color: #10b981;
  }

  .status-tag.processing {
    background: #eff6ff;
    color: #3b82f6;
  }

  .status-tag.pending {
    background: #fef3c7;
    color: #f59e0b;
  }

  /* ===== 响应式 ===== */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .charts-row {
      grid-template-columns: 1fr;
    }
    .action-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .dashboard-sidebar {
      width: 64px;
    }
    .dashboard-content {
      margin-left: 64px;
    }
    .dashboard-header {
      left: 64px;
    }
    .nav-text,
    .sidebar-logo .logo-text,
    .sidebar-footer {
      display: none;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .action-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
