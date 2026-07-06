<template>
  <div class="login-loader">
    <div class="loader-container">
      <div class="loader-animation">
        <div class="paw-icon">🐾</div>
        <div class="loading-ring">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
      </div>
      <div class="loader-text">
        <span class="loading-title">{{ loadingTitle }}</span>
        <span class="loading-subtitle">{{ loadingSubtitle }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="loader-pets">
        <span class="pet pet-1">🐶</span>
        <span class="pet pet-2">🐱</span>
        <span class="pet pet-3">🐰</span>
        <span class="pet pet-4">🐹</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  const loadingTitle = ref('正在登录');
  const loadingSubtitle = ref('欢迎来到宠迹...');
  const progress = ref(0);

  const titles = ['正在登录', '验证身份', '加载数据', '准备就绪'];
  const subtitles = [
    '欢迎来到宠迹...',
    '正在验证您的账号...',
    '正在同步您的宠物数据...',
    '即将进入首页...',
  ];

  let progressTimer: ReturnType<typeof setInterval> | null = null;
  let titleTimer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    let step = 0;
    progressTimer = setInterval(() => {
      progress.value += Math.floor(Math.random() * 8) + 3;
      if (progress.value >= 100) {
        progress.value = 100;
        if (progressTimer) clearInterval(progressTimer);
      }
    }, 150);

    titleTimer = setInterval(() => {
      step += 1;
      if (step < titles.length) {
        loadingTitle.value = titles[step];
        loadingSubtitle.value = subtitles[step];
      }
    }, 800);
  });

  onUnmounted(() => {
    if (progressTimer) clearInterval(progressTimer);
    if (titleTimer) clearInterval(titleTimer);
  });
</script>

<style scoped>
  .login-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .loader-animation {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .paw-icon {
    font-size: 48px;
    z-index: 1;
    animation: pawPulse 1.5s ease-in-out infinite;
  }

  @keyframes pawPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .loading-ring {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .ring {
    position: absolute;
    border-radius: 50%;
    border: 3px solid rgba(99, 102, 241, 0.3);
    border-top-color: #6366f1;
  }

  .ring-1 {
    width: 100%;
    height: 100%;
    animation: ringRotate 1.2s linear infinite;
  }

  .ring-2 {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    animation: ringRotate 1.5s linear infinite reverse;
    border-top-color: #8b5cf6;
  }

  .ring-3 {
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    animation: ringRotate 1.8s linear infinite;
    border-top-color: #a855f7;
  }

  @keyframes ringRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .loader-text {
    text-align: center;
  }

  .loading-title {
    display: block;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .loading-subtitle {
    display: block;
    font-size: 14px;
    color: #a5b4fc;
  }

  .progress-bar {
    width: 240px;
    height: 6px;
    background: rgba(99, 102, 241, 0.2);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);
    border-radius: 3px;
    transition: width 0.15s ease;
  }

  .loader-pets {
    display: flex;
    gap: 16px;
  }

  .pet {
    font-size: 20px;
    animation: petFloat 2s ease-in-out infinite;
  }

  .pet-1 {
    animation-delay: 0s;
  }
  .pet-2 {
    animation-delay: 0.3s;
  }
  .pet-3 {
    animation-delay: 0.6s;
  }
  .pet-4 {
    animation-delay: 0.9s;
  }

  @keyframes petFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-12px);
    }
  }
</style>
