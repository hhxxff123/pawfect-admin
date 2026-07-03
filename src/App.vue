<template>
  <SplashScreen
    v-if="showSplash"
    video-src="/videos/seedance-mini-开场动画.mp4"
    @finish="onSplashFinish"
  />
  <router-view v-show="!showSplash" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SplashScreen from '@/components/SplashScreen.vue';

const showSplash = ref(true);

function onSplashFinish() {
  showSplash.value = false;
}
</script>