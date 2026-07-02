<template>
  <div class="register-wrapper vibrant">
    <!-- 浮动装饰 -->
    <div class="deco-paw paw1">🐾</div>
    <div class="deco-paw paw2">🦴</div>
    <div class="deco-paw paw3">🐕</div>
    <div class="deco-paw paw4">🐈</div>

    <div class="register-card">
      <!-- Logo 区域 -->
      <div class="register-header">
        <div class="logo">
          <span class="logo-icon">🐾</span>
          <span class="logo-text">宠迹</span>
        </div>
        <p class="subtitle">加入我们，让爱有迹可循</p>
      </div>

      <!-- 表单 -->
      <a-form
        :model="form"
        @submit="handleRegister"
        class="register-form"
        :rules="rules"
      >
        <a-form-item field="phone">
          <a-input
            v-model="form.phone"
            placeholder="手机号"
            size="large"
            allow-clear
          >
            <template #prefix><icon-phone /></template>
          </a-input>
        </a-form-item>

        <a-form-item field="password">
          <a-input-password
            v-model="form.password"
            placeholder="密码（6-20位）"
            size="large"
            allow-clear
          >
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>

        <a-form-item field="nickname">
          <a-input
            v-model="form.nickname"
            placeholder="昵称（选填）"
            size="large"
            allow-clear
          >
            <template #prefix><icon-user /></template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            long
            size="large"
            :loading="loading"
            class="register-btn"
          >
            {{ loading ? '注册中...' : '注 册' }}
          </a-button>
        </a-form-item>

        <div class="register-footer">
          <span>已有账号？</span>
          <a-link href="/login">去登录</a-link>
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
import { IconPhone, IconLock, IconUser } from '@arco-design/web-vue/es/icon';

// 表单数据
const form = reactive({
  phone: '',
  password: '',
  nickname: '',
});

// 表单校验规则（可选）
const rules = {
  phone: [{ required: true, message: '请输入手机号' }],
  password: [{ required: true, message: '请输入密码' }],
};

const loading = ref(false);

// 注册逻辑
const handleRegister = async () => {
  loading.value = true;
  try {
    const res = await axios.post('/api/auth/register', form);
    if (res.data.code === 200) {
      Message.success('🎉 注册成功，请登录');
      // 跳转到登录页
      window.location.href = '/login';
    } else {
      Message.error(res.data.message || '注册失败');
    }
  } catch (error: any) {
    Message.error(error.response?.data?.message || '请求失败，请检查网络');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ===== 整体布局 ===== */
.register-wrapper {
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

/* ===== 浮动装饰 ===== */
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

/* ===== 圆点背景 ===== */
.register-wrapper::before {
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

/* ===== 注册卡片 ===== */
.register-card {
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

.register-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 80px rgba(150, 100, 200, 0.3);
}

@keyframes cardPop {
  0% { opacity: 0; transform: scale(0.8) rotate(-2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}

/* ===== 头部 ===== */
.register-header {
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
.register-form :deep(.arco-form-item) {
  margin-bottom: 20px;
}

.register-form :deep(.arco-input-wrapper) {
  border-radius: 16px;
  border: 1.5px solid #e5dce8;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.3s;
}

.register-form :deep(.arco-input-wrapper:focus-within) {
  border-color: #a78cfa;
  box-shadow: 0 0 0 4px rgba(167, 140, 250, 0.2);
  background: #ffffff;
}

.register-form :deep(.arco-input-prefix) {
  color: #a78cfa;
}

.register-btn {
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

.register-btn::after {
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

.register-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(124, 92, 191, 0.4);
}

.register-btn:active {
  transform: scale(0.98);
}

.register-footer {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 14px;
  color: #7a6a8a;
}

.register-footer :deep(.arco-link) {
  color: #7c5cbf;
  font-weight: 500;
  transition: color 0.2s;
}

.register-footer :deep(.arco-link:hover) {
  color: #5c3c9f;
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
  .register-card {
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