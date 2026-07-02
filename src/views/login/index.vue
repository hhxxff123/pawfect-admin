<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- Logo 区域 -->
      <div class="login-header">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z" fill="#165DFF"/>
            <path d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10Z" fill="white"/>
            <circle cx="20" cy="20" r="5" fill="#165DFF"/>
          </svg>
          <span class="logo-text">宠迹</span>
        </div>
        <p class="subtitle">宠物全生命周期管理平台</p>
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
            <template #prefix>
              <icon-phone />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="password" :rules="[{required: true, message: '请输入密码'}]">
          <a-input-password
            v-model="form.password"
            placeholder="密码"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
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
            登 录
          </a-button>
        </a-form-item>

        <div class="login-footer">
          <a-link href="/register">注册账号</a-link>
          <a-link href="/forgot">忘记密码？</a-link>
        </div>
      </a-form>
    </div>

    <!-- 底部版权信息 -->
    <div class="copyright">
      © 2026 宠迹 · 让爱有迹可循
    </div>
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
      Message.success('登录成功');
      localStorage.setItem('token', res.data.data.token);
      // 跳转到首页
      window.location.href = '/';
    } else {
      Message.error(res.data.message);
    }
  } catch (error) {
    Message.error('请求失败，请检查后端服务');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ===== 整体布局 ===== */
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%);
  padding: 20px;
}

/* ===== 登录卡片 ===== */
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(22, 93, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 30px 80px rgba(22, 93, 255, 0.2);
  transform: translateY(-4px);
}

/* ===== 头部 Logo 和标题 ===== */
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: #1d2129;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
  letter-spacing: 2px;
}

/* ===== 表单 ===== */
.login-form :deep(.arco-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.arco-input-wrapper) {
  border-radius: 12px;
  border: 1px solid #e5e6eb;
  transition: all 0.2s;
}

.login-form :deep(.arco-input-wrapper:focus-within) {
  border-color: #165dff;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.12);
}

.login-form :deep(.arco-input-prefix) {
  color: #86909c;
}

.login-btn {
  border-radius: 12px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #165dff 0%, #0a4fcf 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(22, 93, 255, 0.35);
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
  color: #4e5969;
  font-size: 14px;
  transition: color 0.2s;
}

.login-footer :deep(.arco-link:hover) {
  color: #165dff;
}

/* ===== 版权信息 ===== */
.copyright {
  margin-top: 32px;
  color: #86909c;
  font-size: 13px;
  letter-spacing: 1px;
  opacity: 0.7;
}

/* ===== 响应式适配 ===== */
@media (max-width: 480px) {
  .login-card {
    padding: 28px 20px;
  }
  .logo-text {
    font-size: 24px;
  }
}
</style>