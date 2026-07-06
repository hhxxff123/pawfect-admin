<template>
  <div class="monitor-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1 class="page-title">📊 实时监控</h1>
      <p class="page-subtitle">实时追踪店铺运营数据动态</p>
    </div>

    <!-- 实时数据卡片 -->
    <div class="realtime-cards">
      <div class="realtime-card">
        <div class="card-header">
          <span class="card-icon">👥</span>
          <span class="card-title">在线访客</span>
          <span class="live-dot"></span>
        </div>
        <div class="card-value">{{ onlineVisitors }}</div>
        <div class="card-trend up">↑ 15人/分钟</div>
      </div>
      <div class="realtime-card">
        <div class="card-header">
          <span class="card-icon">🛒</span>
          <span class="card-title">订单创建</span>
          <span class="live-dot"></span>
        </div>
        <div class="card-value">{{ newOrders }}</div>
        <div class="card-trend up">↑ 3单/5分钟</div>
      </div>
      <div class="realtime-card">
        <div class="card-header">
          <span class="card-icon">💰</span>
          <span class="card-title">实时营收</span>
          <span class="live-dot"></span>
        </div>
        <div class="card-value">¥{{ realtimeRevenue }}</div>
        <div class="card-trend up">↑ ¥280/分钟</div>
      </div>
      <div class="realtime-card">
        <div class="card-header">
          <span class="card-icon">📱</span>
          <span class="card-title">活跃会话</span>
          <span class="live-dot"></span>
        </div>
        <div class="card-value">{{ activeSessions }}</div>
        <div class="card-trend down">↓ 2人/分钟</div>
      </div>
    </div>

    <!-- 实时曲线图 -->
    <div class="chart-section">
      <div class="section-header">
        <h3 class="section-title">📈 流量趋势（实时）</h3>
        <div class="time-range">
          <button class="range-btn active">5分钟</button>
          <button class="range-btn">30分钟</button>
          <button class="range-btn">1小时</button>
        </div>
      </div>
      <div class="line-chart">
        <div class="chart-container">
          <div class="y-axis">
            <span>200</span>
            <span>150</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>
          <div class="chart-area">
            <svg
              class="line-svg"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="areaGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color: #6366f1; stop-opacity: 0.3"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #6366f1; stop-opacity: 0"
                  />
                </linearGradient>
              </defs>
              <path :d="areaPath" fill="url(#areaGradient)" />
              <path
                :d="linePath"
                fill="none"
                stroke="#6366f1"
                stroke-width="2"
              />
              <circle
                v-for="(point, index) in chartPoints"
                :key="index"
                :cx="point.x"
                :cy="point.y"
                r="4"
                fill="#6366f1"
                class="data-point"
              />
            </svg>
          </div>
          <div class="x-axis">
            <span>-5m</span>
            <span>-4m</span>
            <span>-3m</span>
            <span>-2m</span>
            <span>-1m</span>
            <span>现在</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时事件流 -->
    <div class="events-section">
      <div class="section-header">
        <h3 class="section-title">🔔 实时事件</h3>
        <span class="event-count">最近 {{ events.length }} 条</span>
      </div>
      <div class="events-list">
        <div
          v-for="(event, index) in events"
          :key="index"
          class="event-item"
          :class="event.type"
        >
          <span class="event-icon">{{ event.icon }}</span>
          <div class="event-content">
            <span class="event-title">{{ event.title }}</span>
            <span class="event-desc">{{ event.desc }}</span>
          </div>
          <span class="event-time">{{ event.time }}</span>
        </div>
      </div>
    </div>

    <!-- 服务状态 -->
    <div class="status-section">
      <div class="section-header">
        <h3 class="section-title">⚙️ 服务状态</h3>
      </div>
      <div class="status-grid">
        <div
          v-for="service in services"
          :key="service.name"
          class="status-card"
        >
          <div class="status-header">
            <span class="status-icon">{{ service.icon }}</span>
            <span class="status-name">{{ service.name }}</span>
          </div>
          <div class="status-indicator" :class="service.status">
            <span class="indicator-dot"></span>
            <span class="indicator-text">{{ service.statusText }}</span>
          </div>
          <div class="status-meta">
            <span>延迟: {{ service.latency }}</span>
            <span>可用性: {{ service.availability }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  function goBack() {
    router.push('/business');
  }

  // ===== 实时数据 =====
  const onlineVisitors = ref(128);
  const newOrders = ref(5);
  const realtimeRevenue = ref(23580);
  const activeSessions = ref(45);

  let dataTimer: ReturnType<typeof setInterval> | null = null;

  function updateData() {
    onlineVisitors.value += Math.floor(Math.random() * 5) - 2;
    if (onlineVisitors.value < 0) onlineVisitors.value = 0;

    if (Math.random() > 0.8) {
      newOrders.value += 1;
      realtimeRevenue.value += Math.floor(Math.random() * 500) + 100;
    }

    activeSessions.value += Math.floor(Math.random() * 3) - 1;
    if (activeSessions.value < 0) activeSessions.value = 0;
  }

  // ===== 图表数据 =====
  const chartData = ref<number[]>([]);

  function generateChartData() {
    chartData.value = [];
    for (let i = 0; i < 12; i += 1) {
      chartData.value.push(Math.floor(Math.random() * 150) + 50);
    }
  }

  const chartPoints = computed(() => {
    return chartData.value.map((value, index) => ({
      x: (index / (chartData.value.length - 1)) * 800,
      y: 200 - (value / 200) * 200,
    }));
  });

  const linePath = computed(() => {
    if (chartPoints.value.length === 0) return '';
    return chartPoints.value
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
  });

  const areaPath = computed(() => {
    if (chartPoints.value.length === 0) return '';
    const points = chartPoints.value;
    return `${linePath.value} L ${points[points.length - 1].x} 200 L 0 200 Z`;
  });

  // ===== 实时事件 =====
  const events = ref([
    {
      icon: '💰',
      type: 'revenue',
      title: '新订单完成',
      desc: '美容护理订单 #ORD20260706006 已完成',
      time: '刚刚',
    },
    {
      icon: '👥',
      type: 'visitor',
      title: '新访客进入',
      desc: '用户 138****5678 访问店铺',
      time: '2分钟前',
    },
    {
      icon: '⭐',
      type: 'rating',
      title: '收到好评',
      desc: '王女士 对美容护理服务给出5星好评',
      time: '5分钟前',
    },
    {
      icon: '📢',
      type: 'notification',
      title: '服务提醒',
      desc: '宠物体检预约 10分钟后开始',
      time: '8分钟前',
    },
    {
      icon: '💰',
      type: 'revenue',
      title: '新订单完成',
      desc: '寄养服务订单 #ORD20260706005 已完成',
      time: '12分钟前',
    },
    {
      icon: '👥',
      type: 'visitor',
      title: '新访客进入',
      desc: '用户 139****1234 访问店铺',
      time: '15分钟前',
    },
  ]);

  // ===== 服务状态 =====
  const services = ref([
    {
      name: '订单服务',
      icon: '📋',
      status: 'online',
      statusText: '正常',
      latency: '23ms',
      availability: '99.9%',
    },
    {
      name: '支付服务',
      icon: '💳',
      status: 'online',
      statusText: '正常',
      latency: '15ms',
      availability: '99.95%',
    },
    {
      name: '消息服务',
      icon: '💬',
      status: 'online',
      statusText: '正常',
      latency: '18ms',
      availability: '99.8%',
    },
    {
      name: '缓存服务',
      icon: '💾',
      status: 'warning',
      statusText: '负载高',
      latency: '45ms',
      availability: '99.5%',
    },
  ]);

  onMounted(() => {
    generateChartData();
    dataTimer = setInterval(() => {
      updateData();
      chartData.value.shift();
      chartData.value.push(Math.floor(Math.random() * 150) + 50);
    }, 5000);
  });

  onUnmounted(() => {
    if (dataTimer) {
      clearInterval(dataTimer);
    }
  });
</script>

<style scoped>
  .monitor-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    padding: 8px 16px;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .back-btn:hover {
    background: #e5e7eb;
    color: #1a1a2e;
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: #9ca3af;
    margin: 4px 0 0 0;
  }

  /* ===== 实时数据卡片 ===== */
  .realtime-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .realtime-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    border-left: 4px solid #6366f1;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .card-icon {
    font-size: 18px;
  }

  .card-title {
    font-size: 14px;
    color: #6b7280;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    margin-left: auto;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .card-value {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .card-trend {
    font-size: 12px;
    margin-top: 4px;
  }

  .card-trend.up {
    color: #10b981;
  }
  .card-trend.down {
    color: #ef4444;
  }

  /* ===== 图表区域 ===== */
  .chart-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a2e;
    margin: 0;
  }

  .time-range {
    display: flex;
    gap: 8px;
  }

  .range-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 6px;
    background: #f5f7fa;
    color: #6b7280;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .range-btn.active {
    background: #6366f1;
    color: #ffffff;
  }

  .line-chart {
    margin-top: 16px;
  }

  .chart-container {
    display: flex;
    gap: 8px;
  }

  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    font-size: 11px;
    color: #9ca3af;
    text-align: right;
    width: 40px;
  }

  .chart-area {
    flex: 1;
    height: 200px;
  }

  .line-svg {
    width: 100%;
    height: 100%;
  }

  .data-point {
    animation: pointPulse 2s infinite;
  }

  @keyframes pointPulse {
    0%,
    100% {
      r: 4;
    }
    50% {
      r: 6;
    }
  }

  .x-axis {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 11px;
    color: #9ca3af;
  }

  /* ===== 实时事件 ===== */
  .events-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
  }

  .event-count {
    font-size: 13px;
    color: #9ca3af;
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .event-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: #f9fafb;
    border-left: 3px solid #6366f1;
  }

  .event-item.revenue {
    border-left-color: #f59e0b;
  }
  .event-item.visitor {
    border-left-color: #3b82f6;
  }
  .event-item.rating {
    border-left-color: #10b981;
  }
  .event-item.notification {
    border-left-color: #8b5cf6;
  }

  .event-icon {
    font-size: 20px;
  }

  .event-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .event-title {
    font-size: 14px;
    color: #1a1a2e;
    font-weight: 500;
  }

  .event-desc {
    font-size: 12px;
    color: #9ca3af;
  }

  .event-time {
    font-size: 12px;
    color: #9ca3af;
  }

  /* ===== 服务状态 ===== */
  .status-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .status-card {
    padding: 16px;
    border-radius: 8px;
    background: #f9fafb;
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .status-icon {
    font-size: 16px;
  }

  .status-name {
    font-size: 13px;
    color: #1a1a2e;
    font-weight: 500;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-indicator.online .indicator-dot {
    background: #10b981;
  }
  .status-indicator.warning .indicator-dot {
    background: #f59e0b;
    animation: pulse 1s infinite;
  }
  .status-indicator.offline .indicator-dot {
    background: #ef4444;
  }

  .indicator-text {
    font-size: 12px;
    font-weight: 500;
  }

  .status-indicator.online .indicator-text {
    color: #10b981;
  }
  .status-indicator.warning .indicator-text {
    color: #f59e0b;
  }
  .status-indicator.offline .indicator-text {
    color: #ef4444;
  }

  .status-meta {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #9ca3af;
  }

  /* ===== 响应式 ===== */
  @media (max-width: 1024px) {
    .realtime-cards {
      grid-template-columns: repeat(2, 1fr);
    }
    .status-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .realtime-cards {
      grid-template-columns: 1fr;
    }
    .status-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
