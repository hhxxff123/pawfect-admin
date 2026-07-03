<template>
  <div class="captcha-wrapper">
    <a-input
      v-model="captchaValue"
      :placeholder="placeholder"
      size="large"
      allow-clear
    >
      <template #suffix>
        <img
          :src="captchaUrl"
          alt="验证码"
          class="captcha-image"
          @click="refreshCaptcha"
          title="点击刷新验证码"
        />
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

// 本地状态
const captchaValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 生成随机 key
function generateKey() {
  return `captcha_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// 图形验证码的 key（每次刷新重新生成）
const captchaKey = ref(generateKey());

// 验证码图片地址
const captchaUrl = computed(() =>
  `/api/captcha/image?captchaKey=${captchaKey.value}`
);

// 刷新验证码
function refreshCaptcha() {
  captchaKey.value = generateKey();
}

function getCaptchaKey() {
  return captchaKey.value;
}

defineExpose({ refreshCaptcha, getCaptchaKey });
</script>

<style scoped>
.captcha-wrapper {
  width: 100%;
}
.captcha-image {
  width: 100px;
  height: 34px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid #e5e6eb;
}
</style>