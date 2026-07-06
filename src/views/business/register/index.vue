<template>
  <div class="business-register-wrapper">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle circle1"></div>
      <div class="bg-circle circle2"></div>
      <div class="bg-circle circle3"></div>
      <div class="bg-grid"></div>
    </div>

    <div class="register-card">
      <!-- Logo 区域 -->
      <div class="register-header">
        <div class="logo">
          <span class="logo-icon">💼</span>
          <span class="logo-text">宠迹商家注册</span>
        </div>
        <p class="subtitle">开启您的宠物服务之旅</p>
      </div>

      <!-- 表单 -->
      <form class="register-form" @submit.prevent="handleRegister">
        <!-- 手机号 -->
        <div class="form-group">
          <span class="input-icon">📱</span>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="手机号"
            class="form-input"
            maxlength="11"
          />
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <span class="input-icon">🔑</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="密码（6-20位）"
            class="form-input"
            maxlength="20"
          />
        </div>

        <!-- 店铺名称 -->
        <div class="form-group">
          <span class="input-icon">🏪</span>
          <input
            v-model="form.shopName"
            type="text"
            placeholder="店铺名称"
            class="form-input"
            maxlength="50"
          />
        </div>

        <!-- 店铺类型 -->
        <div class="form-group">
          <span class="input-icon">🏷️</span>
          <select v-model="form.shopType" class="form-input">
            <option value="" disabled>选择店铺类型</option>
            <option value="petShop">宠物用品店</option>
            <option value="petHospital">宠物医院</option>
            <option value="petGrooming">宠物美容店</option>
            <option value="petHotel">宠物寄养</option>
            <option value="petTraining">宠物训练</option>
            <option value="other">其他服务</option>
          </select>
        </div>

        <!-- 联系人姓名 -->
        <div class="form-group">
          <span class="input-icon">👤</span>
          <input
            v-model="form.contactName"
            type="text"
            placeholder="联系人姓名"
            class="form-input"
            maxlength="20"
          />
        </div>

        <!-- 图形验证码 -->
        <div class="form-group captcha-group">
          <span class="input-icon">🖼️</span>
          <input
            v-model="form.captchaCode"
            type="text"
            placeholder="图形验证码"
            class="form-input"
            maxlength="4"
          />
          <img
            :src="captchaUrl"
            alt="验证码"
            class="captcha-img"
            @click="refreshCaptcha"
          />
        </div>

        <!-- 短信验证码 -->
        <div class="form-group">
          <span class="input-icon">✉️</span>
          <input
            v-model="form.smsCode"
            type="text"
            placeholder="短信验证码"
            class="form-input"
            maxlength="6"
          />
          <button
            type="button"
            class="sms-btn"
            :disabled="smsCountdown > 0 || smsLoading"
            @click="sendSmsCode"
          >
            {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
          </button>
        </div>

        <!-- 注册按钮 -->
        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? '注册中...' : '创 建 店 铺' }}
        </button>

        <div class="register-footer">
          <span>已有账号？</span>
          <a href="/login" class="footer-link">去登录</a>
        </div>
      </form>
    </div>

    <div class="copyright">© 2026 宠迹 · 专业宠物服务平台</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import axios from '@/utils/request';

const form = reactive({
  phone: '',
  password: '',
  shopName: '',
  shopType: '',
  contactName: '',
  captchaCode: '',
  smsCode: '',
});

const loading = ref(false);
const smsLoading = ref(false);
const smsCountdown = ref(0);
let countdownTimer: number | null = null;

function generateCaptchaKey() {
  return `captcha_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const captchaKey = ref(generateCaptchaKey());
const captchaUrl = computed(() => `/api/captcha/image?captchaKey=${captchaKey.value}`);

function refreshCaptcha() {
  captchaKey.value = generateCaptchaKey();
  form.captchaCode = '';
}

async function sendSmsCode() {
  if (!form.phone.match(/^1[3-9]\d{9}$/)) {
    Message.warning('📱 请输入正确的手机号');
    return;
  }
  if (!form.captchaCode) {
    Message.warning('🖼️ 请先输入图形验证码');
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
      Message.success('✉️ 验证码已发送');
      smsCountdown.value = 60;
      countdownTimer = window.setInterval(() => {
        smsCountdown.value -= 1;
        if (smsCountdown.value <= 0) {
          if (countdownTimer) clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }, 1000);
      refreshCaptcha();
    } else {
      Message.error(res.data.message || '发送失败');
      refreshCaptcha();
    }
  } catch {
    Message.error('🌐 发送失败，请检查网络');
    refreshCaptcha();
  } finally {
    smsLoading.value = false;
  }
}

async function handleRegister() {
  if (!form.phone.match(/^1[3-9]\d{9}$/)) {
    Message.warning('📱 请输入正确的手机号');
    return;
  }
  if (!form.password || form.password.length < 6) {
    Message.warning('🔑 密码长度至少6位');
    return;
  }
  if (!form.shopName) {
    Message.warning('🏪 请输入店铺名称');
    return;
  }
  if (!form.shopType) {
    Message.warning('🏷️ 请选择店铺类型');
    return;
  }
  if (!form.contactName) {
    Message.warning('👤 请输入联系人姓名');
    return;
  }
  if (!form.smsCode) {
    Message.warning('✉️ 请输入短信验证码');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post('/api/auth/register', {
      phone: form.phone,
      password: form.password,
      nickname: form.contactName,
      smsCode: form.smsCode,
      role: 'business',
      shopName: form.shopName,
      shopType: form.shopType,
    });
    const res = response.data;

    if (res.code === 200) {
      Message.success('🎉 注册成功，请登录');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } else {
      Message.error(res.message || '注册失败');
    }
  } catch (error: any) {
    console.log('注册失败:', error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ===== 整体布局 ===== */
.business-register-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== 背景装饰 ===== */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.circle1 {
  width: 600px;
  height: 600px;
  background: #6366f1;
  top: -200px;
  right: -100px;
  animation: floatCircle 20s infinite;
}

.circle2 {
  width: 400px;
  height: 400px;
  background: #8b5cf6;
  bottom: -100px;
  left: -50px;
  animation: floatCircle 15s infinite reverse;
}

.circle3 {
  width: 300px;
  height: 300px;
  background: #a855f7;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: floatCircle 25s infinite;
}

@keyframes floatCircle {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* ===== 注册卡片 ===== */
.register-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
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
  font-size: 44px;
  animation: floatIcon 3s infinite ease-in-out;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.logo-text {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
  letter-spacing: 1px;
}

/* ===== 表单 ===== */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.form-group:focus-within {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-icon {
  padding: 0 0 0 14px;
  font-size: 16px;
  opacity: 0.5;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  padding: 14px 12px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #ffffff;
  outline: none;
  font-family: inherit;
  min-width: 0;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-input[type="password"] {
  letter-spacing: 2px;
}

.form-input:disabled {
  opacity: 0.5;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

select.form-input option {
  background: #1e1b4b;
  color: #ffffff;
}

/* ===== 验证码 ===== */
.captcha-group {
  gap: 8px;
}

.captcha-img {
  width: 90px;
  height: 38px;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;
}

.captcha-img:hover {
  transform: scale(1.04);
}

/* ===== 短信按钮 ===== */
.sms-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 6px;
}

.sms-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.4);
  color: #ffffff;
}

.sms-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

/* ===== 注册按钮 ===== */
.register-btn {
  padding: 16px 0;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  letter-spacing: 3px;
  margin-top: 8px;
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
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 60%
  );
  animation: btnShine 3s infinite;
}

@keyframes btnShine {
  0% { transform: rotate(0deg) translate(-30%, -30%); }
  100% { transform: rotate(360deg) translate(30%, 30%); }
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.register-btn:active:not(:disabled) {
  transform: translateY(0);
}

.register-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== 底部 ===== */
.register-footer {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.25s ease;
  font-weight: 400;
}

.footer-link:hover {
  color: #ffffff;
}

.copyright {
  margin-top: 32px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  letter-spacing: 2px;
  z-index: 2;
  position: relative;
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .register-card {
    padding: 28px 20px;
    border-radius: 20px;
  }
  .logo-text {
    font-size: 24px;
  }
  .form-input {
    font-size: 14px;
    padding: 12px 8px;
  }
  .captcha-img {
    width: 72px;
    height: 32px;
  }
}
</style>