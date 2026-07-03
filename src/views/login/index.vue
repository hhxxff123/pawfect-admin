<template>
  <div class="login-wrapper vibrant">
    <!-- 浮动装饰 -->
    <div class="deco-paw paw1">🐾</div>
    <div class="deco-paw paw2">🦴</div>
    <div class="deco-paw paw3">🐕</div>
    <div class="deco-paw paw4">🐈</div>

    <div class="login-card">
      <!-- Logo 区域 -->
      <div class="login-header">
        <div class="logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
              fill="#165DFF"
            />
            <path
              d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10Z"
              fill="white"
            />
            <circle cx="20" cy="20" r="5" fill="#165DFF" />
          </svg>
          <span class="logo-icon">🐾</span>
          <span class="logo-text">宠迹</span>
        </div>
        <p class="subtitle">让每一份爱都有迹可循</p>
      </div>

      <!-- 登录方式切换 -->
      <div class="login-tabs">
        <a-button
          :type="loginType === 'password' ? 'primary' : 'outline'"
          shape="round"
          size="small"
          @click="loginType = 'password'"
        >
          密码登录
        </a-button>
        <a-button
          :type="loginType === 'code' ? 'primary' : 'outline'"
          shape="round"
          size="small"
          @click="loginType = 'code'"
        >
          验证码登录
        </a-button>
      </div>

      <a-form :model="form" class="login-form" @submit="handleLogin">
        <!-- 手机号 -->
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

        <!-- 密码登录 -->
        <a-form-item v-if="loginType === 'password'" field="password">
          <a-input-password
            v-model="form.password"
            placeholder="密码"
            size="large"
            allow-clear
          >
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>

        <!-- 验证码登录 -->
        <template v-if="loginType === 'code'">
          <!-- 图形验证码 -->
          <a-form-item field="captchaCode">
            <div class="captcha-row">
              <a-input
                v-model="form.captchaCode"
                placeholder="图形验证码"
                size="large"
                allow-clear
                style="flex: 1"
              />
              <img
                :src="captchaUrl"
                alt="验证码"
                class="captcha-image"
                title="点击刷新"
                @click="refreshCaptcha"
              />
            </div>
          </a-form-item>

          <!-- 短信验证码 -->
          <a-form-item field="smsCode">
            <a-input
              v-model="form.smsCode"
              placeholder="短信验证码"
              size="large"
              allow-clear
            >
              <template #prefix><icon-message /></template>
              <template #suffix>
                <a-button
                  type="text"
                  size="small"
                  :loading="smsLoading"
                  :disabled="smsCountdown > 0"
                  class="sms-btn"
                  @click="sendSmsCode"
                >
                  {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
                </a-button>
              </template>
            </a-input>
          </a-form-item>
        </template>

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
          <span>还没有账号？</span>
          <a-link href="/register">立即注册</a-link>
        </div>
      </a-form>
    </div>

    <div class="copyright">© 2026 宠迹 · 让爱有迹可循</div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, computed, onUnmounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import axios from '@/utils/request';
  import {
    IconPhone,
    IconLock,
    IconMessage,
  } from '@arco-design/web-vue/es/icon';

  // ============ 状态 ============
  const loginType = ref<'password' | 'code'>('password');

  const form = reactive({
    phone: '',
    password: '',
    smsCode: '',
    captchaCode: '',
  });

  const loading = ref(false);
  const smsLoading = ref(false);
  const smsCountdown = ref(0);
  let countdownTimer: number | null = null;

  function generateCaptchaKey() {
    return `captcha_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // ============ 图形验证码 ============
  const captchaKey = ref(generateCaptchaKey());

  const captchaUrl = computed(
    () => `/api/captcha/image?captchaKey=${captchaKey.value}`
  );

  function refreshCaptcha() {
    captchaKey.value = generateCaptchaKey();
    form.captchaCode = '';
  }

  // ============ 登录方式切换 ============
  function switchLoginType(type: 'password' | 'code') {
    loginType.value = type;
    form.password = '';
    form.smsCode = '';
    form.captchaCode = '';
    if (type === 'code') {
      refreshCaptcha();
    }
  }

  // ============ 发送短信验证码 ============
  async function sendSmsCode() {
    if (!form.phone.match(/^1[3-9]\d{9}$/)) {
      Message.warning('请输入正确的手机号');
      return;
    }

    if (!form.captchaCode) {
      Message.warning('请先输入图形验证码');
      return;
    }

    smsLoading.value = true;
    try {
      const res = await axios.post('/api/sms/send', null, {
        params: {
          phone: form.phone,
          captchaKey: captchaKey.value,
          captchaCode: form.captchaCode,
        },
      });
      if (res.data.code === 200) {
        Message.success('验证码已发送');
        smsCountdown.value = 60;
        countdownTimer = window.setInterval(() => {
          smsCountdown.value -= 1;
          if (smsCountdown.value <= 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            clearInterval(countdownTimer!);
            countdownTimer = null;
          }
        }, 1000);
        refreshCaptcha();
      } else {
        Message.error(res.data.message || '发送失败');
        refreshCaptcha();
      }
    } catch {
      Message.error('发送失败，请检查网络');
      refreshCaptcha();
    } finally {
      smsLoading.value = false;
    }
  }

  // ============ 登录提交 ============
  async function handleLogin() {
    if (!form.phone) {
      Message.warning('请输入手机号');
      return;
    }

    if (loginType.value === 'password') {
      if (!form.password || form.password.length < 6) {
        Message.warning('密码长度至少6位');
        return;
      }
    }

    if (loginType.value === 'code') {
      if (!form.smsCode) {
        Message.warning('请输入短信验证码');
        return;
      }
    }

    loading.value = true;
    
    try {
      const payload: any = {
        phone: form.phone,
        loginType: loginType.value,
      };
      if (loginType.value === 'password') {
        payload.password = form.password;
      } else {
        payload.smsCode = form.smsCode;
      }

      const res = await axios.post('/api/auth/login', payload);
      console.log('【调试】完整响应:', res);
      console.log('【调试】res.data:', res.data);

      if (res.data.code === 200) {
        Message.success('🎉 登录成功');
        localStorage.setItem('token', res.data.data.token);
        window.location.href = '/';
      } else {
        Message.error(res.data.message || '登录失败');
      }
    } catch (error: any) {
      // 只有网络错误才会进入这里
      console.log('登录失败:', error.message);
    } finally {
      loading.value = false;
    }
  }

  // ============ 组件卸载 ============
  onUnmounted(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  });
</script>

<style scoped>
  /* ===== 整体布局 ===== */
  .login-wrapper {
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
  .paw1 {
    top: 8%;
    left: 5%;
    animation-duration: 14s;
  }
  .paw2 {
    top: 15%;
    right: 8%;
    animation-duration: 10s;
    font-size: 32px;
  }
  .paw3 {
    bottom: 20%;
    left: 10%;
    animation-duration: 16s;
    font-size: 48px;
  }
  .paw4 {
    bottom: 10%;
    right: 5%;
    animation-duration: 12s;
    font-size: 36px;
  }

  @keyframes floatPaw {
    0% {
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    100% {
      transform: translate(30px, -20px) rotate(15deg) scale(1.1);
    }
  }

  /* ===== 圆点背景 ===== */
  .login-wrapper::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
        circle at 10% 20%,
        #ff9aa2 6%,
        transparent 6%
      ),
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
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-20px, 10px);
    }
    100% {
      transform: translate(20px, -10px);
    }
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
    0% {
      opacity: 0;
      transform: scale(0.8) rotate(-2deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }

  /* ===== 头部 ===== */
  .login-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .logo-icon {
    font-size: 28px;
    animation: wiggle 2.5s infinite ease-in-out;
  }

  @keyframes wiggle {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-8deg);
    }
    75% {
      transform: rotate(8deg);
    }
  }

  .logo-text {
    font-size: 28px;
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
    margin-top: 4px;
    letter-spacing: 1.5px;
  }

  /* ===== 登录方式切换 ===== */
  .login-tabs {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 24px;
  }

  .login-tabs :deep(.arco-btn) {
    border-radius: 20px;
    padding: 0 20px;
    height: 32px;
    font-size: 14px;
    font-weight: 500;
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

  /* ===== 图形验证码 ===== */
  .captcha-row {
    display: flex;
    gap: 12px;
    align-items: center;
    width: 100%;
  }

  .captcha-image {
    width: 120px;
    height: 40px;
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid #e5dce8;
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  .captcha-image:hover {
    transform: scale(1.03);
  }

  /* ===== 短信验证码按钮 ===== */
  .sms-btn {
    color: #7c5cbf;
    font-weight: 500;
  }
  .sms-btn:hover {
    color: #5c3c9f;
  }
  .sms-btn:disabled {
    color: #a9aeb8;
  }

  /* ===== 登录按钮 ===== */
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
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 60%
    );
    animation: btnShine 3s infinite;
  }

  @keyframes btnShine {
    0% {
      transform: rotate(0deg) translate(-30%, -30%);
    }
    100% {
      transform: rotate(360deg) translate(30%, 30%);
    }
  }

  .login-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 30px rgba(124, 92, 191, 0.4);
  }
  .login-btn:active {
    transform: scale(0.98);
  }

  /* ===== 底部链接 ===== */
  .login-footer {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 12px;
    font-size: 14px;
    color: #7a6a8a;
  }

  .login-footer :deep(.arco-link) {
    color: #7c5cbf;
    font-weight: 500;
  }

  .login-footer :deep(.arco-link:hover) {
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
    .login-card {
      padding: 28px 20px;
      border-radius: 28px;
    }
    .logo-text {
      font-size: 22px;
    }
    .deco-paw {
      display: none;
    }
    .captcha-row {
      flex-wrap: wrap;
    }
    .captcha-image {
      width: 100px;
      height: 34px;
    }
  }
</style>
