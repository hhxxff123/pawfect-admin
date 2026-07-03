<template>
  <div class="captcha-wrapper">
    <canvas
      ref="canvasRef"
      width="120"
      height="40"
      class="captcha-canvas"
      @click="refreshCaptcha"
    ></canvas>
    <span class="refresh-tip" @click="refreshCaptcha">⟳</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let currentText = '';

  // 生成随机验证码（4位字母数字）
  function generateRandomText(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去除容易混淆的字符
    let result = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 绘制验证码图片
  function drawCaptcha(text: string) {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, 120, 40);

    // 背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 120, 40);

    // 干扰线
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 40);
      ctx.lineTo(Math.random() * 120, Math.random() * 40);
      ctx.stroke();
    }

    // 绘制文本
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < text.length; i++) {
      const x = 20 + i * 28 + Math.random() * 6;
      const y = 28 + Math.random() * 8 - 4;
      const angle = (Math.random() - 0.5) * 0.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `bold ${22 + Math.random() * 8}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 30%)`;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 2;
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // 随机噪点
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * 120,
        Math.random() * 40,
        1 + Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  // 刷新验证码
  function refreshCaptcha() {
    currentText = generateRandomText();
    drawCaptcha(currentText);
  }

  // 获取当前验证码文本（供父组件校验）
  function getCaptchaText(): string {
    return currentText;
  }

  // 暴露方法给父组件
  defineExpose({
    refreshCaptcha,
    getCaptchaText,
  });

  onMounted(() => {
    refreshCaptcha();
  });
</script>

<style scoped>
  .captcha-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .captcha-canvas {
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    background: #fafafa;
    transition: all 0.2s;
  }
  .captcha-canvas:hover {
    border-color: #7c5cbf;
  }
  .refresh-tip {
    cursor: pointer;
    font-size: 20px;
    color: #999;
    user-select: none;
    transition: all 0.3s;
    line-height: 1;
  }
  .refresh-tip:hover {
    color: #7c5cbf;
    transform: rotate(60deg);
  }
</style>
