<template>
  <div class="login-wrapper vibrant">
    <!-- 装饰元素 -->
    <div class="deco-paw paw1">🐾</div>
    <div class="deco-paw paw2">🦴</div>
    <div class="deco-paw paw3">🐕</div>
    <div class="deco-paw paw4">🐈</div>

    <div class="login-card">
      <!-- Logo 区域 -->
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">🐾</span>
          <span class="logo-text">宠迹</span>
        </div>
        <p class="subtitle">让每一份爱都有迹可循</p>
      </div>

      <!-- 表单 -->
      <a-form :model="form" @submit="handleLogin" class="login-form">
        <a-form-item field="phone" :rules="[{required: true, message: '请输入手机号'}]">
          <a-input
            v-model="form.phone"
            placeholder="手机号"
            size="large"
            allow-clear
          >
            <template #prefix><icon-phone /></template>
          </a-input>
        </a-form-item>

        <a-form-item field="password" :rules="[{required: true, message: '请输入密码'}]">
          <a-input-password
            v-model="form.password"
            placeholder="密码"
            size="large"
            allow-clear
          >
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            long
            size="large"
            :loading="loading"
            class="login-btn"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </a-button>
        </a-form-item>

        <div class="login-footer">
          <a-link href="/register">注册账号</a-link>
          <a-link href="/forgot">忘记密码？</a-link>
        </div>
      </a-form>
    </div>

    <div class="copyright">© 2026 宠迹 · 让爱有迹可循</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import axios from 'axios';
import { IconPhone, IconLock } from '@arco-design/web-vue/es/icon';

const form = reactive({
  phone: '13900139000',
  password: '123456',
});
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await axios.post('/api/auth/login', form);
    if (res.data.code === 200) {
      Message.success('登录成功 🎉');
      localStorage.setItem('token', res.data.data.token);
      window.location.href = '/';
    } else {
      Message.error(res.data.message || '登录失败');
    }
  } catch {
    Message.error('请求失败，请检查后端服务是否启动');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ===== 整体布局 ===== */
.vibrant {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f9e8ff 0%, #e8f0ff 40%, #ffe8f0 100%);
  position: relative;
  overflow: hidden;
}

/* ===== 浮动装饰元素 ===== */
.deco-paw {
  position: absolute;
  font-size: 40px;
  opacity: 0.15;
  animation: floatPaw 12s infinite alternate ease-in-out;
  pointer-events: none;
  user-select: none;
}
.paw1 { top: 8%; left: 5%; animation-duration: 14s; }
.paw2 { top: 15%; right: 8%; animation-duration: 10s; font-size: 32px; }
.paw3 { bottom: 20%; left: 10%; animation-duration: 16s; font-size: 48px; }
.paw4 { bottom: 10%; right: 5%; animation-duration: 12s; font-size: 36px; }

@keyframes floatPaw {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  100% { transform: translate(30px, -20px) rotate(15deg) scale(1.1); }
}

/* ===== 彩色圆点背景 ===== */
.vibrant::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 10% 20%, #ff9aa2 6%, transparent 6%),
    radial-gradient(circle at 90% 30%, #b5e6c3 8%, transparent 8%),
    radial-gradient(circle at 20% 80%, #f9d976 10%, transparent 10%),
    radial-gradient(circle at 80% 70%, #a2c9f9 12%, transparent 12%),
    radial-gradient(circle at 50% 50%, #e3b0f0 14%, transparent 14%);
  background-size: 300px 300px;
  opacity: 0.2;
  pointer-events: none;
  animation: dotMove 30s linear infinite;
}

@keyframes dotMove {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 10px); }
  100% { transform: translate(20px, -10px); }
}

/* ===== 登录卡片 ===== */
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 40px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(150, 100, 200, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: cardPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 2;
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 80px rgba(150, 100, 200, 0.3);
}

@keyframes cardPop {
  0% { opacity: 0; transform: scale(0.8) rotate(-2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}

/* ===== 头部 ===== */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.logo-icon {
  font-size: 40px;
  animation: wiggle 2.5s infinite ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: #5c3d7a;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #7c5cbf, #b88ad6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 14px;
  color: #7a6a8a;
  margin-top: 6px;
  letter-spacing: 1.5px;
}

/* ===== 表单 ===== */
.login-form :deep(.arco-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.arco-input-wrapper) {
  border-radius: 16px;
  border: 1.5px solid #e5dce8;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.3s;
}

.login-form :deep(.arco-input-wrapper:focus-within) {
  border-color: #a78cfa;
  box-shadow: 0 0 0 4px rgba(167, 140, 250, 0.2);
  background: #ffffff;
}

.login-form :deep(.arco-input-prefix) {
  color: #a78cfa;
}

.login-btn {
  border-radius: 20px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #a78cfa, #7c5cbf);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  animation: btnShine 3s infinite;
}

@keyframes btnShine {
  0% { transform: rotate(0deg) translate(-30%, -30%); }
  100% { transform: rotate(360deg) translate(30%, 30%); }
}

.login-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(124, 92, 191, 0.4);
}

.login-btn:active {
  transform: scale(0.98);
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.login-footer :deep(.arco-link) {
  color: #8a7a9a;
  font-size: 14px;
  transition: color 0.2s;
}

.login-footer :deep(.arco-link:hover) {
  color: #7c5cbf;
}

.copyright {
  margin-top: 30px;
  color: #9a8aaa;
  font-size: 13px;
  letter-spacing: 1px;
  opacity: 0.6;
  z-index: 2;
  position: relative;
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .login-card {
    padding: 28px 20px;
    border-radius: 28px;
  }
  .logo-text {
    font-size: 26px;
  }
  .deco-paw {
    display: none;
  }
}
</style>