<template>
  <div class="login-wrapper vibrant">
    <LoginLoader v-if="showLoader" />
    
    <!-- 浮动装饰 -->
    <div class="deco-paw paw1">🐾</div>
    <div class="deco-paw paw2">🦴</div>
    <div class="deco-paw paw3">🐕</div>
    <div class="deco-paw paw4">🐈</div>

    <div class="login-card">
      <!-- ===== 角色切换 ===== -->
      <div class="role-switch">
        <button
          class="role-btn"
          :class="{ active: currentRole === 'user' }"
          @click="switchRole('user')"
        >
          <span class="role-icon">🐾</span>
          <span class="role-text">我是宠物主</span>
        </button>
        <button
          class="role-btn"
          :class="{ active: currentRole === 'business' }"
          @click="switchRole('business')"
        >
          <span class="role-icon">🏪</span>
          <span class="role-text">我是商家</span>
        </button>
      </div>

      <!-- ===== 品牌区 ===== -->
      <div class="brand-section">
        <div class="brand-ip">
          <!-- 北极狐用 emoji + 暖色背景，与背景小狗画风统一 -->
          <div class="ip-avatar">
            <span class="ip-emoji">{{ currentRole === 'user' ? '🦊' : '💼' }}</span>
          </div>
          <div>
            <h1 class="brand-title">宠迹</h1>
            <p class="brand-sub">{{ currentRole === 'user' ? '让每一份爱都有迹可循' : '专业服务，用心经营' }}</p>
          </div>
        </div>
      </div>

      <!-- ===== 登录方式切换 ===== -->
      <div class="login-tabs">
        <button
          class="tab-btn"
          :class="{ active: loginType === 'password' }"
          @click="switchLoginType('password')"
        >
          🔐 密码登录
        </button>
        <button
          class="tab-btn"
          :class="{ active: loginType === 'code' }"
          @click="switchLoginType('code')"
        >
          📱 验证码登录
        </button>
      </div>

      <!-- ===== 表单 ===== -->
      <form class="login-form" @submit.prevent="handleLogin">
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
        <div v-if="loginType === 'password'" class="form-group">
          <span class="input-icon">🔑</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="密码（6-20位）"
            class="form-input"
            maxlength="20"
          />
        </div>

        <!-- 验证码登录 -->
        <template v-if="loginType === 'code'">
          <div class="form-group">
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
        </template>

        <!-- 登录按钮 -->
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '...' : '🐾 登 录' }}
        </button>

        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">其他登录方式</span>
            <span class="divider-line"></span>
          </div>
          <div class="social-btns">
            <button class="social-btn wechat" @click="handleSocialLogin('wechat')">
              <span class="social-icon">💬</span>
              <span class="social-text">微信</span>
            </button>
            <button class="social-btn qq" @click="handleSocialLogin('qq')">
              <span class="social-icon">🐧</span>
              <span class="social-text">QQ</span>
            </button>
            <button class="social-btn alipay" @click="handleSocialLogin('alipay')">
              <span class="social-icon">💳</span>
              <span class="social-text">支付宝</span>
            </button>
            <button class="social-btn apple" @click="handleSocialLogin('apple')">
              <span class="social-icon">🍎</span>
              <span class="social-text">Apple</span>
            </button>
          </div>
        </div>

        <!-- 底部链接 -->
        <div class="login-footer">
          <span>还没有账号？</span>
          <a :href="currentRole === 'user' ? '/register' : '/business/register'" class="footer-link">立即注册</a>
        </div>
      </form>
    </div>

    <div class="copyright">© 2026 宠迹 · 用科技守护温暖</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Message } from '@arco-design/web-vue';
import axios from '@/utils/request';
import LoginLoader from '@/components/LoginLoader.vue';

// ============ 状态 ============
const loginType = ref<'password' | 'code'>('password');
const currentRole = ref<'user' | 'business'>('user');
const showLoader = ref(false);
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

// ============ 暖心文案 ============
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

// ============ 图形验证码 ============
function generateCaptchaKey() {
  return `captcha_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const captchaKey = ref(generateCaptchaKey());
const captchaUrl = computed(() => `/api/captcha/image?captchaKey=${captchaKey.value}`);

function refreshCaptcha() {
  captchaKey.value = generateCaptchaKey();
  form.captchaCode = '';
}

// ============ 角色切换 ============
function switchRole(role: 'user' | 'business') {
  currentRole.value = role;
}

// ============ 登录方式切换 ============
function switchLoginType(type: 'password' | 'code') {
  loginType.value = type;
  form.password = '';
  form.smsCode = '';
  form.captchaCode = '';
  if (type === 'code') {
    nextTick(() => refreshCaptcha());
  }
}

function handleSocialLogin(platform: string) {
  const platformNames: Record<string, string> = {
    wechat: '微信',
    qq: 'QQ',
    alipay: '支付宝',
    apple: 'Apple',
  };
  Message.info(`${platformNames[platform]}登录功能开发中 🚀`);
}

// ============ 发送短信验证码 ============
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

// ============ 登录提交 ============
async function handleLogin() {
  if (!form.phone) {
    Message.warning('📱 请输入手机号');
    return;
  }
  if (loginType.value === 'password') {
    if (!form.password || form.password.length < 6) {
      Message.warning('🔑 密码长度至少6位');
      return;
    }
  }
  if (loginType.value === 'code') {
    if (!form.smsCode) {
      Message.warning('✉️ 请输入短信验证码');
      return;
    }
  }

  loading.value = true;
  try {
    const payload: any = {
    phone: form.phone,
    loginType: loginType.value,
    role: currentRole.value,
  };
  if (loginType.value === 'password') {
    payload.password = form.password;
  } else {
    payload.smsCode = form.smsCode;
  }

    const res = await axios.post('/api/auth/login', payload);
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('role', currentRole.value);
      const expireTime = Date.now() + 2 * 60 * 60 * 1000;
      localStorage.setItem('tokenExpire', expireTime.toString());
      showLoader.value = true;
      setTimeout(() => {
        const redirectUrl = currentRole.value === 'user' ? '/' : '/business';
        window.location.href = redirectUrl;
      }, 2500);
    } else {
      Message.error(res.data.message || '登录失败');
    }
  } catch (error: any) {
    console.log('登录失败:', error.message);
  } finally {
    loading.value = false;
  }
}

// ============ 生命周期 ============
onMounted(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpire');
  localStorage.removeItem('role');
  if (loginType.value === 'code') {
    refreshCaptcha();
  }
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});

defineExpose({ refreshCaptcha, switchLoginType });
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
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
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

/* ===== 波点背景 ===== */
.login-wrapper::before {
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

/* ===== 角色切换 ===== */
.role-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: rgba(245, 200, 148, 0.08);
  border-radius: 16px;
  padding: 4px;
}

.role-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 0;
  border: none;
  border-radius: 12px;
  background: transparent;
  font-size: 13px;
  font-weight: 400;
  color: #a89c92;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}
.role-btn.active {
  background: #ffffff;
  color: #3d2a1a;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
.role-btn:hover:not(.active) {
  color: #3d2a1a;
}
.role-icon {
  font-size: 16px;
}

/* ===== 登录卡片 ===== */
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 40px;
  padding: 36px 32px 28px;
  box-shadow: 0 20px 60px rgba(150, 100, 200, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  transition: transform 0.3s, box-shadow 0.3s;
}
.login-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 72px rgba(150, 100, 200, 0.2);
}

/* ===== 品牌区（优化排版） ===== */
.brand-section {
  text-align: center;
  margin-bottom: 28px;
}

.brand-ip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 8px;
}

.fox-svg {
  flex-shrink: 0;
  animation: foxFloat 4s ease-in-out infinite;
}
@keyframes foxFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.brand-title {
  font-size: 30px;
  font-weight: 500;
  font-family: 'Georgia', 'PingFang SC', serif;
  color: #3d2a1a;
  letter-spacing: 6px;
  margin: 0;
  line-height: 1.2;
}
.brand-sub {
  font-size: 13px;
  color: #a89c92;
  letter-spacing: 3px;
  margin: 2px 0 0 0;
  font-weight: 300;
}

.brand-welcome {
  font-size: 14px;
  color: #b5a89c;
  margin: 8px 0 0 0;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* ===== 登录方式切换 ===== */
.login-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: rgba(245, 200, 148, 0.08);
  border-radius: 16px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 12px;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  color: #a89c92;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  letter-spacing: 0.5px;
}
.tab-btn.active {
  background: #ffffff;
  color: #3d2a1a;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
.tab-btn:hover:not(.active) {
  color: #3d2a1a;
}

/* ===== 表单 ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(229, 220, 232, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}
.form-group:focus-within {
  border-color: #d4c4f0;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(212, 196, 240, 0.12);
}

.input-icon {
  padding: 0 0 0 14px;
  font-size: 16px;
  opacity: 0.4;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  padding: 13px 12px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #2d1a0e;
  outline: none;
  font-family: inherit;
  min-width: 0;
}
.form-input::placeholder {
  color: #c5bbb2;
  font-weight: 300;
}

/* ===== 验证码 ===== */
.captcha-img {
  width: 90px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 8px;
  border: 1px solid rgba(229, 220, 232, 0.2);
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
  background: transparent;
  color: #a89c92;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 6px;
  font-weight: 300;
}
.sms-btn:hover:not(:disabled) {
  color: #3d2a1a;
  background: rgba(0, 0, 0, 0.03);
}
.sms-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* ===== 登录按钮 ===== */
.login-btn {
  padding: 14px 0;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #f5c894, #e8a87c);
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  letter-spacing: 3px;
  margin-top: 6px;
}
.login-btn:hover:not(:disabled) {
  transform: scale(1.01);
  box-shadow: 0 8px 28px rgba(232, 168, 124, 0.25);
}
.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}
.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== 底部 ===== */
.login-footer {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 14px;
  color: #a89c92;
  font-weight: 300;
}
.footer-link {
  color: #a89c92;
  text-decoration: none;
  transition: color 0.25s ease;
  font-weight: 400;
}
.footer-link:hover {
  color: #3d2a1a;
}

/* ===== 第三方登录 ===== */
.third-party-login {
  margin-top: 16px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e8dcd0, transparent);
}

.divider-text {
  font-size: 12px;
  color: #c5bbb2;
  font-weight: 300;
}

.social-btns {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.social-btn.wechat:hover {
  background: rgba(76, 175, 80, 0.1);
}

.social-btn.qq:hover {
  background: rgba(100, 149, 237, 0.1);
}

.social-btn.alipay:hover {
  background: rgba(0, 150, 255, 0.1);
}

.social-btn.apple:hover {
  background: rgba(50, 50, 50, 0.1);
}

.social-icon {
  font-size: 24px;
}

.social-text {
  font-size: 11px;
  color: #a89c92;
}

.copyright {
  margin-top: 28px;
  color: #d5cbc4;
  font-size: 12px;
  letter-spacing: 2px;
  z-index: 2;
  position: relative;
  font-weight: 300;
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 18px 24px;
    border-radius: 28px;
  }
  .brand-title {
    font-size: 24px;
    letter-spacing: 4px;
  }
  .brand-sub {
    font-size: 12px;
    letter-spacing: 2px;
  }
  .brand-welcome {
    font-size: 13px;
  }
  .fox-svg {
    width: 44px;
    height: 44px;
  }
  .form-input {
    font-size: 14px;
    padding: 11px 8px;
  }
  .captcha-img {
    width: 72px;
    height: 28px;
  }
  .deco-paw {
    display: none;
  }
}
</style>