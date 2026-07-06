<template>
  <div class="dashboard-wrapper" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- ===== 侧边栏 ===== -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🐾</span>
        <span class="logo-text">宠迹</span>
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
        <div class="weather-pet-container">
          <WeatherPet />
        </div>
      </div>
    </aside>

    <!-- ===== 顶部导航 ===== -->
    <header class="dashboard-header">
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">☰</button>
        <div class="header-brand">
          <span class="brand-icon">🐾</span>
          <span class="brand-text">宠迹</span>
        </div>
      </div>
      <div class="header-right">
        <div class="header-actions">
          <button class="action-btn" title="消息">
            <span>🔔</span>
            <span class="action-badge">2</span>
          </button>
          <button class="action-btn" title="通知">
            <span>💬</span>
          </button>
        </div>
        <div class="user-dropdown" @click="toggleDropdown">
          <div class="user-avatar">
            <span class="avatar-emoji">👤</span>
          </div>
          <span class="user-name">{{ userName || '宠友' }}</span>
          <span class="dropdown-arrow">▼</span>
          <div v-if="showDropdown" class="dropdown-menu">
            <div class="dropdown-item" @click="handleLogout">
              <span>🚪</span> 退出登录
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== 主内容 ===== -->
    <main class="dashboard-main">
      <!-- 欢迎卡片 -->
      <section class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-text">
            <h1>👋 你好，{{ userName || '宠友' }}</h1>
            <p>{{ welcomeMessage }}</p>
          </div>
          <div class="welcome-emoji">🐕</div>
        </div>
      </section>

      <!-- 统计概览 -->
      <section class="stats-section">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon" :style="{ background: stat.bg }">{{ stat.icon }}</div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- 宠物列表 -->
      <section class="pets-section">
        <div class="section-header">
          <h2 class="section-title">🐾 我的毛孩子</h2>
          <button class="add-btn" @click="handleAddPet">+ 添加宠物</button>
        </div>

        <div v-if="pets.length === 0" class="empty-state">
          <div class="empty-icon">🦴</div>
          <p class="empty-text">还没有添加宠物</p>
          <p class="empty-hint">点击“添加宠物”记录你的毛孩子吧</p>
        </div>

        <div v-else class="pet-grid">
          <div v-for="pet in pets" :key="pet.id" class="pet-card">
            <div class="pet-avatar">
              <span class="pet-emoji">{{ pet.emoji || '🐶' }}</span>
            </div>
            <div class="pet-info">
              <div class="pet-name">{{ pet.name }}</div>
              <div class="pet-breed">{{ pet.breed || '未知品种' }}</div>
            </div>
            <div class="pet-actions">
              <button class="pet-btn" @click="viewPet(pet.id)">查看</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 快捷操作 -->
      <section class="quick-section">
        <h2 class="section-title">⚡ 快捷操作</h2>
        <div class="quick-grid">
          <div class="quick-item" @click="handleRecord">
            <span class="quick-icon">📝</span>
            <span class="quick-label">记录健康</span>
          </div>
          <div class="quick-item" @click="handleReminder">
            <span class="quick-icon">⏰</span>
            <span class="quick-label">设置提醒</span>
          </div>
          <div class="quick-item" @click="handleAppointment">
            <span class="quick-icon">📅</span>
            <span class="quick-label">预约服务</span>
          </div>
          <div class="quick-item" @click="handleAI">
            <span class="quick-icon">🤖</span>
            <span class="quick-label">AI问诊</span>
          </div>
        </div>
      </section>

      <!-- 底部占位 -->
      <div class="footer-placeholder"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import axios from '@/utils/request';
import WeatherPet from '@/components/WeatherPet.vue';

const router = useRouter();

// ===== 状态 =====
const userName = ref('宠友');
const currentTime = ref('');
const showDropdown = ref(false);
const activeNav = ref('home');
const sidebarCollapsed = ref(false);

interface Pet {
  id: number;
  name: string;
  breed?: string;
  emoji?: string;
}

const pets = ref<Pet[]>([
  // 模拟数据，实际从接口获取
  // { id: 1, name: '旺财', breed: '金毛', emoji: '🐶' },
]);

const stats = ref([
  { icon: '🐾', label: '宠物', value: 0, bg: '#f0ecf9' },
  { icon: '📅', label: '今日提醒', value: 0, bg: '#e8f5e9' },
  { icon: '❤️', label: '健康评分', value: '--', bg: '#fff3e0' },
]);

const navItems = [
  { id: 'home', icon: '🏠', label: '首页', badge: '' },
  { id: 'pets', icon: '🐾', label: '我的宠物', badge: '2' },
  { id: 'health', icon: '❤️', label: '健康记录', badge: '' },
  { id: 'reminder', icon: '⏰', label: '提醒管理', badge: '3' },
  { id: 'service', icon: '🏥', label: '预约服务', badge: '' },
  { id: 'ai', icon: '🤖', label: 'AI问诊', badge: '' },
  { id: 'community', icon: '👥', label: '宠友圈', badge: '' },
  { id: 'settings', icon: '⚙️', label: '设置', badge: '' },
];

// ===== 文案 =====
const welcomeMessages = [
  '今天，毛孩子又在等你回家',
  '每一次陪伴，都值得被记录',
  '爱是藏不住的，就像它的足迹',
  '愿所有的温柔，都被看见',
  '今天也要和它一起快乐呀',
];

const welcomeMessage = computed(() => {
  const idx = Math.floor(Math.random() * welcomeMessages.length);
  return welcomeMessages[idx];
});

// ===== 时间更新 =====
let timer: ReturnType<typeof setInterval> | null = null;

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// ===== 侧边栏导航 =====

// ===== 操作 =====
function handleAddPet() {
  Message.info('添加宠物功能开发中 🚀');
}

function viewPet(id: number) {
  Message.info(`查看宠物 ${id} 详情 🚀`);
}

function handleRecord() {
  Message.info('记录健康功能开发中 🚀');
}

function handleReminder() {
  Message.info('设置提醒功能开发中 🚀');
}

function handleAppointment() {
  Message.info('预约服务功能开发中 🚀');
}

function handleAI() {
  Message.info('AI问诊功能开发中 🚀');
}

function handleNavClick(id: string) {
  activeNav.value = id;
  const navMap: Record<string, () => void> = {
    home: () => Message.info('已在首页'),
    pets: () => handleAddPet(),
    health: () => handleRecord(),
    reminder: () => handleReminder(),
    service: () => handleAppointment(),
    ai: () => handleAI(),
    community: () => Message.info('宠友圈功能开发中 🚀'),
    settings: () => Message.info('设置功能开发中 🚀'),
  };
  const handler = navMap[id];
  if (handler) handler();
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

// ===== 全局点击处理 =====
let handleGlobalClick: ((e: MouseEvent) => void) | null = null;

// ===== 下拉菜单 =====
function toggleDropdown(e: Event) {
  e.stopPropagation();
  showDropdown.value = !showDropdown.value;
}

function handleLogout(e: Event) {
  e.stopPropagation();
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpire');
  localStorage.removeItem('role');
  localStorage.removeItem('userInfo');
  Message.success('已退出登录');
  setTimeout(() => {
    window.location.href = '/login';
  }, 400);
}


// ===== 获取数据 =====
async function fetchPets() {
  try {
    const res = await axios.get('/api/pet/list', {
      params: { userId: 1, page: 1, size: 10 }, // 实际应从store获取userId
    });
    if (res.data.code === 200) {
      pets.value = res.data.data.records || [];
      // 更新统计
      stats.value[0].value = pets.value.length;
      stats.value[1].value = 0; // 待实现
      stats.value[2].value = '92'; // 待计算
    }
  } catch (error) {
    console.warn('获取宠物列表失败，使用模拟数据');
    // 如果接口未通，使用模拟数据
    pets.value = [
      { id: 1, name: '旺财', breed: '金毛', emoji: '🐶' },
      { id: 2, name: '咪咪', breed: '英短', emoji: '🐱' },
    ];
    stats.value[0].value = pets.value.length;
    stats.value[1].value = 2;
    stats.value[2].value = '94';
  }
}

// ===== 生命周期 =====
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  // 获取用户昵称（从 localStorage 或 store）
  const storedUser = localStorage.getItem('userInfo');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      userName.value = user.nickname || user.phone || '宠友';
    } catch { /* ignore */ }
  }
  fetchPets();

  // 点击其他地方关闭下拉
  handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-dropdown') && showDropdown.value) {
      showDropdown.value = false;
    }
  };
  document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (handleGlobalClick) {
    document.removeEventListener('click', handleGlobalClick);
  }
});
</script>

<style scoped>
/* ===== 整体布局 ===== */
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9e8ff 0%, #e8f0ff 40%, #ffe8f0 100%);
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  padding-bottom: 40px;
  position: relative;
  overflow-x: hidden;
  display: flex;
}

/* ===== 侧边栏 ===== */
.dashboard-sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  padding-top: 16px;
}

.dashboard-sidebar.collapsed {
  width: 64px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-bottom: 8px;
}

.sidebar-logo .logo-icon {
  font-size: 24px;
}

.sidebar-logo .logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #3d2a1a;
  letter-spacing: 1px;
}

.dashboard-sidebar.collapsed .logo-text {
  display: none;
}

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0 12px 12px 0;
  margin-right: 8px;
}

.nav-item:hover {
  background: rgba(212, 196, 240, 0.3);
}

.nav-item.active {
  background: linear-gradient(135deg, #d4c4f0 0%, #e8d8f8 100%);
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.15);
}

.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 14px;
  color: #3d2a1a;
  font-weight: 500;
}

.dashboard-sidebar.collapsed .nav-text {
  display: none;
}

.nav-badge {
  margin-left: auto;
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

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.weather-pet-container {
  display: flex;
  justify-content: center;
}

.dashboard-sidebar.collapsed .weather-pet-container {
  display: none;
}

/* ===== 顶部导航 ===== */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  position: sticky;
  top: 0;
  z-index: 10;
  margin-left: 200px;
  transition: margin-left 0.3s ease;
}

.dashboard-wrapper.sidebar-collapsed .dashboard-header {
  margin-left: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sidebar-toggle {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  color: #3d2a1a;
  transition: background 0.2s;
}
.sidebar-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}
.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-icon {
  font-size: 22px;
}
.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #3d2a1a;
  letter-spacing: 1px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
}
.action-btn {
  position: relative;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  transition: background 0.2s;
}
.action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
.action-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  background: #ff6b6b;
  color: #ffffff;
  font-size: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-time {
  font-size: 14px;
  color: #b5a89c;
  font-weight: 300;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px 4px 6px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
  transition: background 0.2s;
  position: relative;
}
.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.7);
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #d4c4f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-emoji {
  font-size: 16px;
}
.user-name {
  font-size: 14px;
  color: #3d2a1a;
  font-weight: 500;
}
.dropdown-arrow {
  font-size: 10px;
  color: #b5a89c;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 6px 0;
  z-index: 20;
}
.dropdown-item {
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3d2a1a;
  font-size: 14px;
  transition: background 0.15s;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f5f3f0;
}

/* ===== 主内容 ===== */
.dashboard-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 16px;
  margin-left: 200px;
  transition: margin-left 0.3s ease;
}

.dashboard-wrapper.sidebar-collapsed .dashboard-main {
  margin-left: 64px;
}

/* ===== 欢迎卡片 ===== */
.welcome-section {
  margin-bottom: 24px;
}
.welcome-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(150, 100, 80, 0.06);
}
.welcome-text h1 {
  font-size: 22px;
  font-weight: 600;
  color: #3d2a1a;
  margin: 0 0 6px 0;
}
.welcome-text p {
  font-size: 15px;
  color: #8a6b5a;
  margin: 0;
  font-weight: 300;
}
.welcome-emoji {
  font-size: 52px;
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ===== 统计概览 ===== */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
.stat-item {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.stat-info {
  flex: 1;
}
.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #3d2a1a;
  line-height: 1.2;
}
.stat-label {
  font-size: 12px;
  color: #b5a89c;
  margin-top: 2px;
}

/* ===== 宠物列表 ===== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #3d2a1a;
  margin: 0;
}
.add-btn {
  padding: 6px 18px;
  border: none;
  border-radius: 20px;
  background: #d4c4f0;
  color: #3d2a1a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.add-btn:hover {
  background: #c4b0e0;
  transform: scale(1.02);
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.pet-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(150, 100, 80, 0.08);
}
.pet-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f5f3f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.pet-emoji {
  font-size: 32px;
}
.pet-name {
  font-size: 16px;
  font-weight: 600;
  color: #3d2a1a;
}
.pet-breed {
  font-size: 13px;
  color: #b5a89c;
  margin-top: 2px;
}
.pet-actions {
  margin-top: 12px;
}
.pet-btn {
  padding: 4px 20px;
  border: none;
  border-radius: 16px;
  background: #f0ecf9;
  color: #6b4f9f;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}
.pet-btn:hover {
  background: #d4c4f0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  backdrop-filter: blur(4px);
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.empty-text {
  font-size: 18px;
  color: #3d2a1a;
  font-weight: 500;
  margin: 0;
}
.empty-hint {
  font-size: 14px;
  color: #b5a89c;
  margin: 6px 0 0 0;
}

/* ===== 快捷操作 ===== */
.quick-section {
  margin-top: 8px;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 12px;
}
.quick-item {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s;
}
.quick-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 30px rgba(150, 100, 80, 0.06);
}
.quick-icon {
  font-size: 28px;
}
.quick-label {
  font-size: 13px;
  color: #6a6e76;
  font-weight: 500;
}

/* ===== 底部占位 ===== */
.footer-placeholder {
  height: 20px;
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .stats-section {
    grid-template-columns: 1fr 1fr;
  }
  .quick-grid {
    grid-template-columns: 1fr 1fr;
  }
  .pet-grid {
    grid-template-columns: 1fr 1fr;
  }
  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  .welcome-emoji {
    margin-top: 10px;
    font-size: 40px;
  }
  .header-time {
    display: none;
  }
}

@media (max-width: 480px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
  .pet-grid {
    grid-template-columns: 1fr;
  }
  .quick-grid {
    grid-template-columns: 1fr 1fr;
  }
  .dashboard-header {
    padding: 12px 16px;
  }
  .logo-text {
    font-size: 16px;
  }
}
</style>