<template>
  <div class="weather-pet">
    <div class="weather-info">
      <span class="weather-icon">{{ currentWeather.icon }}</span>
      <span class="weather-text">{{ currentWeather.label }}</span>
      <span class="weather-temp">{{ temperature }}°C</span>
    </div>
    
    <div class="pet-scene">
      <!-- 背景元素 -->
      <div v-if="currentWeather.type === 'hot'" class="hot-bg">
        <div class="sun">☀️</div>
        <div class="thermometer">🌡️</div>
        <div class="ice-cream">🍦</div>
      </div>
      
      <div v-if="currentWeather.type === 'rainy'" class="rainy-bg">
        <div class="cloud">☁️</div>
        <div class="rain">💧</div>
        <div class="rain">💧</div>
        <div class="rain">💧</div>
      </div>
      
      <div v-if="currentWeather.type === 'snowy'" class="snowy-bg">
        <div class="snowflake">❄️</div>
        <div class="snowflake">❄️</div>
        <div class="snowflake">❄️</div>
        <div class="snowflake">❄️</div>
        <div class="snowflake">❄️</div>
      </div>
      
      <div v-if="currentWeather.type === 'stormy'" class="stormy-bg">
        <div class="lightning">⚡</div>
        <div class="dark-cloud">☁️</div>
      </div>
      
      <!-- 宠物主体 -->
      <div class="pet-container" :class="currentWeather.type">
        <div class="pet">
          <!-- 宠物表情 -->
          <div class="pet-face">
            <div class="pet-eyes">
              <span class="eye left">{{ currentWeather.eyes.left }}</span>
              <span class="eye right">{{ currentWeather.eyes.right }}</span>
            </div>
            <span class="pet-nose">👃</span>
            <span class="pet-mouth">{{ currentWeather.mouth }}</span>
          </div>
          
          <!-- 宠物身体 -->
          <div class="pet-body">
            <span class="body-emoji">{{ currentWeather.body }}</span>
          </div>
          
          <!-- 宠物配饰 -->
          <div v-if="currentWeather.accessory" class="pet-accessory">
            <span>{{ currentWeather.accessory }}</span>
          </div>
        </div>
        
        <!-- 宠物动作 -->
        <div v-if="currentWeather.action" class="pet-action">
          <span>{{ currentWeather.action }}</span>
        </div>
      </div>
      
      <!-- 天气提示 -->
      <div class="weather-tip">{{ currentWeather.tip }}</div>
    </div>
    
    <!-- 天气切换 -->
    <div class="weather-switch">
      <button 
        v-for="weather in weatherOptions" 
        :key="weather.type"
        class="weather-btn"
        :class="{ active: currentWeather.type === weather.type }"
        @click="changeWeather(weather)"
      >
        {{ weather.icon }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface WeatherConfig {
  type: string;
  icon: string;
  label: string;
  eyes: { left: string; right: string };
  mouth: string;
  body: string;
  accessory?: string;
  action?: string;
  tip: string;
}

const temperature = ref(26);

const weatherOptions: WeatherConfig[] = [
  {
    type: 'sunny',
    icon: '☀️',
    label: '晴天',
    eyes: { left: '👀', right: '👀' },
    mouth: '😄',
    body: '🐶',
    accessory: '',
    action: '',
    tip: '今天天气真好，适合带毛孩子出去玩！',
  },
  {
    type: 'hot',
    icon: '🔥',
    label: '酷热',
    eyes: { left: '😵', right: '😵' },
    mouth: '😫',
    body: '🐶',
    accessory: '🌡️',
    action: '💨',
    tip: '太热啦！记得给毛孩子多喝水哦~',
  },
  {
    type: 'rainy',
    icon: '🌧️',
    label: '下雨',
    eyes: { left: '🥺', right: '🥺' },
    mouth: '😢',
    body: '🐱',
    accessory: '☂️',
    action: '',
    tip: '下雨了，毛孩子要乖乖待在家里~',
  },
  {
    type: 'snowy',
    icon: '❄️',
    label: '下雪',
    eyes: { left: '🥶', right: '🥶' },
    mouth: '😣',
    body: '🐶',
    accessory: '🧣',
    action: '',
    tip: '好冷呀！给毛孩子穿上保暖衣服~',
  },
  {
    type: 'cloudy',
    icon: '☁️',
    label: '阴天',
    eyes: { left: '😐', right: '😐' },
    mouth: '😕',
    body: '🐱',
    accessory: '',
    action: '',
    tip: '天气阴沉沉的，毛孩子有点无聊呢~',
  },
  {
    type: 'stormy',
    icon: '⛈️',
    label: '雷雨',
    eyes: { left: '😱', right: '😱' },
    mouth: '😰',
    body: '🐱',
    accessory: '🛌',
    action: '',
    tip: '打雷了！毛孩子害怕地躲起来了~',
  },
];

const currentWeather = reactive<WeatherConfig>({ ...weatherOptions[0] });

function changeWeather(weather: WeatherConfig) {
  Object.assign(currentWeather, weather);
  switch (weather.type) {
    case 'hot':
      temperature.value = 38;
      break;
    case 'snowy':
      temperature.value = -2;
      break;
    case 'rainy':
      temperature.value = 15;
      break;
    case 'cloudy':
      temperature.value = 20;
      break;
    case 'stormy':
      temperature.value = 18;
      break;
    default:
      temperature.value = 26;
  }
}

function simulateWeather() {
  const randomIndex = Math.floor(Math.random() * weatherOptions.length);
  changeWeather(weatherOptions[randomIndex]);
}

setInterval(simulateWeather, 30000);
</script>

<style scoped>
.weather-pet {
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 12px;
  backdrop-filter: blur(8px);
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #5a4a3a;
}

.weather-icon {
  font-size: 14px;
}

.weather-text {
  font-weight: 500;
}

.weather-temp {
  font-weight: 600;
  color: #8b5cf6;
}

.pet-scene {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80px;
}

/* ===== 天气背景 ===== */
.hot-bg,
.rainy-bg,
.snowy-bg,
.stormy-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: -4px;
  right: 4px;
  font-size: 20px;
  animation: sunGlow 2s infinite;
}

@keyframes sunGlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.thermometer {
  position: absolute;
  top: 8px;
  left: 4px;
  font-size: 16px;
  animation: thermometerShake 1s infinite;
}

@keyframes thermometerShake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.ice-cream {
  position: absolute;
  bottom: 4px;
  left: 8px;
  font-size: 14px;
  animation: iceCreamMelt 3s infinite;
}

@keyframes iceCreamMelt {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

.cloud {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  animation: cloudFloat 4s infinite;
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

.rain {
  position: absolute;
  top: 20px;
  font-size: 12px;
  animation: rainFall 1.5s infinite;
}

.rain:nth-child(2) { left: 30%; animation-delay: 0s; }
.rain:nth-child(3) { left: 50%; animation-delay: 0.3s; }
.rain:nth-child(4) { left: 70%; animation-delay: 0.6s; }

@keyframes rainFall {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(40px); opacity: 0; }
}

.snowflake {
  position: absolute;
  top: -10px;
  font-size: 12px;
  animation: snowFall 3s infinite;
}

.snowflake:nth-child(2) { left: 20%; animation-delay: 0s; }
.snowflake:nth-child(3) { left: 40%; animation-delay: 0.5s; }
.snowflake:nth-child(4) { left: 60%; animation-delay: 1s; }
.snowflake:nth-child(5) { left: 80%; animation-delay: 1.5s; }

@keyframes snowFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(50px) rotate(360deg); opacity: 0.3; }
}

.lightning {
  position: absolute;
  top: -2px;
  right: 4px;
  font-size: 18px;
  animation: lightningFlash 2s infinite;
}

@keyframes lightningFlash {
  0%, 90%, 100% { opacity: 0; }
  92%, 94% { opacity: 1; }
}

.dark-cloud {
  position: absolute;
  top: -4px;
  left: 8px;
  font-size: 16px;
  animation: cloudDark 3s infinite;
}

@keyframes cloudDark {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}

/* ===== 宠物容器 ===== */
.pet-container {
  position: relative;
  z-index: 2;
}

.pet {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: petFloat 3s ease-in-out infinite;
}

@keyframes petFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.pet-container.hot .pet {
  animation: petPant 0.5s infinite;
}

@keyframes petPant {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2px) scale(1.02); }
}

.pet-container.stormy .pet {
  animation: petShake 0.3s infinite;
}

@keyframes petShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* ===== 宠物表情 ===== */
.pet-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.pet-eyes {
  display: flex;
  gap: 4px;
}

.eye {
  font-size: 10px;
}

.pet-nose {
  font-size: 8px;
  margin-top: -2px;
}

.pet-mouth {
  font-size: 12px;
  margin-top: -2px;
}

.pet-container.hot .pet-mouth {
  animation: mouthOpen 0.5s infinite;
}

@keyframes mouthOpen {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ===== 宠物身体 ===== */
.pet-body {
  font-size: 36px;
  margin-top: -8px;
}

.pet-container.snowy .pet-body {
  filter: hue-rotate(20deg);
}

/* ===== 宠物配饰 ===== */
.pet-accessory {
  position: absolute;
  font-size: 16px;
  z-index: 3;
}

.pet-container.hot .pet-accessory {
  top: -8px;
  right: -8px;
  animation: thermometerMove 1s infinite;
}

@keyframes thermometerMove {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.pet-container.rainy .pet-accessory {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  animation: umbrellaShake 1.5s infinite;
}

@keyframes umbrellaShake {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  25% { transform: translateX(-50%) rotate(-5deg); }
  75% { transform: translateX(-50%) rotate(5deg); }
}

.pet-container.snowy .pet-accessory {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
}

.pet-container.stormy .pet-accessory {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
}

/* ===== 宠物动作 ===== */
.pet-action {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  animation: actionFloat 0.8s infinite;
}

@keyframes actionFloat {
  0%, 100% { transform: translateY(-50%) translateX(0); opacity: 1; }
  50% { transform: translateY(-50%) translateX(4px); opacity: 0.6; }
}

/* ===== 天气提示 ===== */
.weather-tip {
  margin-top: 8px;
  font-size: 11px;
  color: #8a7a6a;
  text-align: center;
  line-height: 1.4;
}

/* ===== 天气切换 ===== */
.weather-switch {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 10px;
}

.weather-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.weather-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.weather-btn.active {
  background: #d4c4f0;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
}
</style>