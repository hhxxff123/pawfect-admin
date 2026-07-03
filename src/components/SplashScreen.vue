<template>
  <div
    class="splash-wrapper"
    :class="{ hidden: isHidden }"
    ref="wrapperRef"
    :style="{ minHeight: windowHeight + 'px' }"
  >
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      class="splash-video"
      :src="videoSrc"
      autoplay
      muted
      playsinline
      @ended="onVideoEnded"
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
      @play="onVideoPlay"
    ></video>

    <!-- 视频加载失败或未播放时的 fallback 动画 -->
    <div v-if="showFallback" class="fallback-animation">
      <div class="pet-icon">🐾</div>
      <div class="loading-text">正在加载...</div>
    </div>

    <!-- 可选：叠加品牌信息（可自行调整显示/隐藏） -->
    <div class="brand-overlay">
      <div class="brand-title">宠 迹</div>
      <div class="brand-sub">让爱有迹可循</div>
    </div>

    <!-- 进度条（可选，但视频自带时长，可以保留，也可以去掉） -->
    <div class="splash-progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  const props = defineProps<{
    /** 视频文件路径（默认 /videos/splash.mp4） */
    videoSrc?: string;
    /** 是否自动隐藏（跳转） */
    autoHide?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'finish'): void;
    (e: 'loaded'): void;
  }>();

  // ============ 状态 ============
  const videoRef = ref<HTMLVideoElement | null>(null);
  const wrapperRef = ref<HTMLElement | null>(null);
  const isHidden = ref(false);
  const windowHeight = ref(window.innerHeight);
  const progress = ref(0);
  const showFallback = ref(false);
  let progressTimer: ReturnType<typeof setInterval> | null = null;
  const fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  // 视频路径（默认）
  const videoSrc = props.videoSrc || '/videos/seedance-mini-开场动画.mp4';

  // ============ 事件 ============

  function onVideoEnded() {
    if (props.autoHide !== false) {
      isHidden.value = true;
      emit('finish');
    } else {
      isHidden.value = true;
      emit('finish');
    }
  }

  function startProgress() {
    const video = videoRef.value;
    if (!video) return;
    progressTimer = setInterval(() => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progress.value = Math.min(pct, 100);
        
        // 在视频结束前2秒自动触发结束事件
        const endOffset = 2.5;
        if (video.currentTime >= video.duration - endOffset) {
          clearInterval(progressTimer!);
          progress.value = 100;
          onVideoEnded();
        }
      }
    }, 100);
  }

  function onVideoLoaded() {
    emit('loaded');
    showFallback.value = false;
    startProgress();
  }

  function onVideoPlay() {
    showFallback.value = false;
  }


  function startFallbackAnimation() {
    if (progressTimer) clearInterval(progressTimer);
    progress.value = 0;
    progressTimer = setInterval(() => {
      progress.value += 1;
      if (progress.value >= 100) {
        clearInterval(progressTimer!);
        onVideoEnded();
      }
    }, 80);
  }

  function onVideoError() {
    console.warn('视频加载失败，启用 fallback 动画');
    showFallback.value = true;
    startFallbackAnimation();
  }

  // ============ 窗口适配 ============
  function handleResize() {
    windowHeight.value = window.innerHeight;
  }

  // ============ 生命周期 ============
  onMounted(() => {
    window.addEventListener('resize', handleResize);
    
    // 主动触发视频播放，处理浏览器自动播放策略限制
    const video = videoRef.value;
    if (video) {
      video.load();
      video.play().catch((error) => {
        console.warn('自动播放失败，尝试交互后播放:', error);
        // 如果自动播放失败，启用 fallback 动画
        showFallback.value = true;
        startFallbackAnimation();
      });
    }
    
    // 设置超时，如果视频在3秒内没有开始播放，则启用 fallback
    setTimeout(() => {
      if (video && video.paused && !showFallback.value) {
        console.warn('视频3秒内未播放，启用 fallback');
        showFallback.value = true;
        startFallbackAnimation();
      }
    }, 3000);
  });

  onUnmounted(() => {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    window.removeEventListener('resize', handleResize);
    // 停止视频播放释放资源
    if (videoRef.value) {
      videoRef.value.pause();
      videoRef.value.src = '';
      videoRef.value.load();
    }
  });

  // 暴露方法（如需要重新播放）
  defineExpose({
    play: () => videoRef.value?.play(),
    pause: () => videoRef.value?.pause(),
    reset: () => {
      if (videoRef.value) {
        videoRef.value.currentTime = 0;
        videoRef.value.play();
      }
    },
  });
</script>

<style scoped>
  .splash-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    background: #000;
    overflow: hidden;
    transition: opacity 1.2s ease, visibility 1.2s ease;
  }
  .splash-wrapper.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .splash-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000;
  }

  .fallback-animation {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  }

  .pet-icon {
    font-size: 80px;
    animation: bounce 2s infinite ease-in-out;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .loading-text {
    margin-top: 20px;
    color: #fff;
    font-size: 16px;
    letter-spacing: 4px;
    opacity: 0.8;
  }

  /* 品牌文字叠加层（可自行调整位置和样式） */
  .brand-overlay {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 2;
    color: #fff;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
    pointer-events: none; /* 让点击穿透到视频 */
  }
  .brand-title {
    font-size: 40px;
    font-weight: 700;
    letter-spacing: 8px;
    font-family: 'Georgia', 'PingFang SC', serif;
  }
  .brand-sub {
    font-size: 16px;
    letter-spacing: 4px;
    opacity: 0.8;
    margin-top: 4px;
  }

  /* 进度条（保持与之前一致，可选） */
  .splash-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #7c5cbf, #a78cfa);
    z-index: 10001;
    transition: width 0.3s ease;
  }

  /* 移动端适配 */
  @media (max-width: 480px) {
    .brand-title {
      font-size: 28px;
      letter-spacing: 4px;
    }
    .brand-sub {
      font-size: 13px;
      letter-spacing: 2px;
    }
  }
</style>
