<template>
  <a-layout class="layout">
    <!-- ====== 侧边栏 ====== -->
    <a-layout-sider
      class="sider"
      :collapsed="collapsed"
      :width="220"
      :collapsed-width="64"
      breakpoint="lg"
      @collapse="onCollapse"
    >
      <div class="logo-area">
        <span class="logo-icon">🐾</span>
        <span v-if="!collapsed" class="logo-text">宠迹</span>
      </div>

      <a-menu
        class="sider-menu"
        :selected-keys="selectedKeys"
        @menu-item-click="onMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon><icon-dashboard /></template>
          工作台
        </a-menu-item>
        <a-menu-item key="pets">
          <template #icon><icon-facebook /></template>
          宠物管理
        </a-menu-item>
        <a-menu-item key="appointments">
          <template #icon><icon-calendar /></template>
          预约管理
        </a-menu-item>
        <a-menu-item key="users">
          <template #icon><icon-user-group /></template>
          用户管理
        </a-menu-item>
        <a-menu-item key="settings">
          <template #icon><icon-settings /></template>
          系统设置
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- ====== 主内容 ====== -->
    <a-layout>
      <!-- 顶部栏 -->
      <a-layout-header class="header">
        <div class="header-left">
          <a-button
            type="text"
            @click="collapsed = !collapsed"
            class="collapse-btn"
          >
            <icon-menu-fold v-if="!collapsed" />
            <icon-menu-unfold v-else />
          </a-button>
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>工作台</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="header-right">
          <a-badge :count="5" :dot="true">
            <a-button type="text" shape="circle">
              <icon-notification />
            </a-button>
          </a-badge>

          <a-dropdown trigger="click">
            <div class="user-info">
              <a-avatar :size="32" class="user-avatar">
                {{ userInitial }}
              </a-avatar>
              <span class="user-name">{{ userName }}</span>
              <icon-down />
            </div>
            <template #content>
              <a-doption @click="handleLogout">
                <template #icon><icon-export /></template>
                退出登录
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content class="content">
        <!-- 欢迎卡片 -->
        <div class="welcome-card">
          <div class="welcome-text">
            <h1>👋 欢迎回来，{{ userName }}！</h1>
            <p>今天是 {{ currentDate }}，祝你和毛孩子都有美好的一天 🐾</p>
          </div>
          <div class="welcome-emoji">🐕</div>
        </div>

        <!-- 统计卡片 -->
        <div class="stats-grid">
          <a-card class="stat-card" :bordered="false" hoverable>
            <div class="stat-icon pet-icon">🐾</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.pets }}</div>
              <div class="stat-label">宠物总数</div>
            </div>
          </a-card>

          <a-card class="stat-card" :bordered="false" hoverable>
            <div class="stat-icon appointment-icon">📅</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.appointments }}</div>
              <div class="stat-label">今日预约</div>
            </div>
          </a-card>

          <a-card class="stat-card" :bordered="false" hoverable>
            <div class="stat-icon user-icon">👤</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.users }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </a-card>

          <a-card class="stat-card" :bordered="false" hoverable>
            <div class="stat-icon revenue-icon">💰</div>
            <div class="stat-content">
              <div class="stat-number">¥{{ stats.revenue }}</div>
              <div class="stat-label">本月收入</div>
            </div>
          </a-card>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
          <h3 class="section-title">快捷操作</h3>
          <div class="action-grid">
            <div class="action-item" @click="navigateTo('/pets')">
              <div class="action-icon">➕</div>
              <span>添加宠物</span>
            </div>
            <div class="action-item" @click="navigateTo('/appointments')">
              <div class="action-icon">📋</div>
              <span>新建预约</span>
            </div>
            <div class="action-item" @click="navigateTo('/users')">
              <div class="action-icon">👥</div>
              <span>邀请家人</span>
            </div>
            <div class="action-item" @click="navigateTo('/settings')">
              <div class="action-icon">⚙️</div>
              <span>系统设置</span>
            </div>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import {
  IconDashboard,
  IconFacebook,
  IconCalendar,
  IconUserGroup,
  IconSettings,
  IconMenuFold,
  IconMenuUnfold,
  IconNotification,
  IconDown,
  IconExport,
} from '@arco-design/web-vue/es/icon';

const router = useRouter();

// ============ 状态 ============
const collapsed = ref(false);
const selectedKeys = ref(['dashboard']);

// 用户信息（从 localStorage 或 store 获取）
const userName = ref('宠友');
const userPhone = ref('');

// 统计数据（后续对接真实 API）
const stats = ref({
  pets: 0,
  appointments: 0,
  users: 0,
  revenue: 0,
});

// ============ 计算属性 ============
const userInitial = computed(() => {
  return userName.value ? userName.value.charAt(0).toUpperCase() : 'U';
});

const currentDate = computed(() => {
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
});

// ============ 方法 ============
function onCollapse(value: boolean) {
  collapsed.value = value;
}

function onMenuClick(key: string) {
  selectedKeys.value = [key];
  // 暂时只有 dashboard 有内容，其余留空
  if (key !== 'dashboard') {
    Message.info('功能开发中，敬请期待 🚀');
  }
}

function navigateTo(path: string) {
  // 暂不跳转，仅提示
  Message.info('功能开发中，敬请期待 🚀');
  // router.push(path);
}

function handleLogout() {
  localStorage.removeItem('token');
  Message.success('已退出登录');
  router.push('/login');
}

// ============ 初始化 ============
onMounted(() => {
  // 从 localStorage 读取用户信息（登录时存入）
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // 如果有用户信息存储，可读取
    // const userInfo = localStorage.getItem('userInfo');
    // if (userInfo) {
    //   const parsed = JSON.parse(userInfo);
    //   userName.value = parsed.nickname || parsed.phone || '宠友';
    //   userPhone.value = parsed.phone || '';
    // }
    // 模拟数据
    userName.value = '宠迹主人';
    stats.value = {
      pets: 3,
      appointments: 5,
      users: 12,
      revenue: 2860,
    };
  } catch {
    // 忽略
  }
});
</script>

<style scoped>
/* ====== 整体布局 ====== */
.layout {
  min-height: 100vh;
  background: #f7f9fc;
}

/* ====== 侧边栏 ====== */
.sider {
  background: linear-gradient(180deg, #f9f0ff 0%, #f0e6ff 100%);
  border-right: 1px solid rgba(124, 92, 191, 0.1);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(124, 92, 191, 0.08);
  min-height: 64px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c5cbf, #b88ad6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sider-menu :deep(.arco-menu-item) {
  border-radius: 12px;
  margin: 4px 12px;
  font-weight: 500;
  color: #4e5969;
}

.sider-menu :deep(.arco-menu-item.arco-menu-selected) {
  background: linear-gradient(135deg, #a78cfa, #7c5cbf);
  color: #ffffff;
}

.sider-menu :deep(.arco-menu-item:hover) {
  background: rgba(124, 92, 191, 0.08);
}

/* ====== 顶部栏 ====== */
.header {
  background: #ffffff;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 18px;
  color: #4e5969;
}

.breadcrumb :deep(.arco-breadcrumb-item) {
  color: #86909c;
  font-size: 14px;
}
.breadcrumb :deep(.arco-breadcrumb-item:last-child) {
  color: #1d2129;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: 20px;
  transition: background 0.2s;
}
.user-info:hover {
  background: #f7f9fc;
}

.user-avatar {
  background: linear-gradient(135deg, #a78cfa, #7c5cbf);
  color: #ffffff;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

/* ====== 内容区 ====== */
.content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ====== 欢迎卡片 ====== */
.welcome-card {
  background: linear-gradient(135deg, #f9f0ff 0%, #f0e6ff 100%);
  border-radius: 20px;
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border: 1px solid rgba(124, 92, 191, 0.08);
  position: relative;
  overflow: hidden;
}

.welcome-card::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(167, 140, 250, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.welcome-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 8px 0;
}
.welcome-text p {
  font-size: 14px;
  color: #4e5969;
  margin: 0;
}

.welcome-emoji {
  font-size: 56px;
  animation: floatPaw 4s ease-in-out infinite;
}

@keyframes floatPaw {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

/* ====== 统计卡片 ====== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #f0f2f5;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 32px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
}

.pet-icon { background: #f0f0ff; }
.appointment-icon { background: #e8f5e9; }
.user-icon { background: #fff3e0; }
.revenue-icon { background: #e3f2fd; }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1d2129;
}

.stat-label {
  font-size: 13px;
  color: #86909c;
  margin-top: 2px;
}

/* ====== 快捷操作 ====== */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 16px 0;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f0f2f5;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 8px;
}

.action-item:hover {
  transform: translateY(-4px);
  border-color: #a78cfa;
  box-shadow: 0 8px 30px rgba(167, 140, 250, 0.15);
}

.action-icon {
  font-size: 28px;
}

.action-item span {
  font-size: 13px;
  color: #4e5969;
  font-weight: 500;
}

/* ====== 响应式 ====== */
@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }
  .welcome-emoji {
    font-size: 40px;
    margin-top: 12px;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .action-grid {
    grid-template-columns: 1fr 1fr;
  }
  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .action-grid {
    grid-template-columns: 1fr 1fr;
  }
  .header {
    padding: 0 12px;
  }
  .content {
    padding: 16px;
  }
}
</style>