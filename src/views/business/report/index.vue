<template>
  <div class="report-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1 class="page-title">📈 运营报表</h1>
      <p class="page-subtitle">全面分析店铺运营数据</p>
    </div>

    <!-- 时间筛选 -->
    <div class="filter-bar">
      <div class="date-range">
        <button class="filter-btn active">今日</button>
        <button class="filter-btn">本周</button>
        <button class="filter-btn">本月</button>
        <button class="filter-btn">本季度</button>
        <button class="filter-btn">自定义</button>
      </div>
      <div class="export-btn"> <span>📥</span> 导出报表 </div>
    </div>

    <!-- 核心指标 -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-icon revenue">💰</div>
        <div class="card-info">
          <div class="card-value">¥45,230</div>
          <div class="card-label">总营收</div>
          <div class="card-change up">↑ 18.5% 较上周</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="card-icon orders">📋</div>
        <div class="card-info">
          <div class="card-value">256</div>
          <div class="card-label">订单总数</div>
          <div class="card-change up">↑ 12.3% 较上周</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="card-icon customers">👥</div>
        <div class="card-info">
          <div class="card-value">189</div>
          <div class="card-label">客户数量</div>
          <div class="card-change up">↑ 8.7% 较上周</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="card-icon avg">⭐</div>
        <div class="card-info">
          <div class="card-value">4.9</div>
          <div class="card-label">平均评分</div>
          <div class="card-change up">↑ 0.2 较上周</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="card-icon conversion">📊</div>
        <div class="card-info">
          <div class="card-value">32.5%</div>
          <div class="card-label">转化率</div>
          <div class="card-change down">↓ 1.2% 较上周</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="card-icon retention">🔄</div>
        <div class="card-info">
          <div class="card-value">78.3%</div>
          <div class="card-label">复购率</div>
          <div class="card-change up">↑ 3.5% 较上周</div>
        </div>
      </div>
    </div>

    <!-- 营收分析 -->
    <div class="analysis-section">
      <div class="section-header">
        <h3 class="section-title">💰 营收分析</h3>
      </div>
      <div class="revenue-chart">
        <div class="chart-header">
          <span>日营收趋势</span>
          <div class="legend">
            <span class="legend-item"
              ><span class="legend-color" style="background: #6366f1"></span
              >营收</span
            >
            <span class="legend-item"
              ><span class="legend-color" style="background: #8b5cf6"></span
              >订单数</span
            >
          </div>
        </div>
        <div class="bar-chart">
          <div
            v-for="(day, index) in weeklyData"
            :key="index"
            class="bar-group"
          >
            <div class="bar-stack">
              <div
                class="bar revenue"
                :style="{ height: day.revenue + '%' }"
              ></div>
              <div
                class="bar orders"
                :style="{ height: day.orders + '%' }"
              ></div>
            </div>
            <span class="bar-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务分类占比 -->
    <div class="analysis-section">
      <div class="section-header">
        <h3 class="section-title">🐾 服务分类占比</h3>
      </div>
      <div class="pie-section">
        <div class="pie-container">
          <div class="pie-chart">
            <div class="pie" :style="{ background: pieGradient }"></div>
            <div class="pie-center">
              <span class="pie-value">100%</span>
              <span class="pie-label">服务总计</span>
            </div>
          </div>
        </div>
        <div class="pie-legend">
          <div
            v-for="(item, index) in serviceData"
            :key="index"
            class="legend-row"
          >
            <span
              class="legend-color"
              :style="{ background: item.color }"
            ></span>
            <span class="legend-name">{{ item.name }}</span>
            <span class="legend-value">{{ item.value }}单</span>
            <span class="legend-percent">{{ item.percent }}</span>
            <div class="legend-bar">
              <div
                class="legend-fill"
                :style="{ width: item.percent, background: item.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户分析 -->
    <div class="analysis-section">
      <div class="section-header">
        <h3 class="section-title">👥 客户分析</h3>
      </div>
      <div class="customer-grid">
        <div class="customer-card">
          <div class="card-title">客户来源分布</div>
          <div class="source-list">
            <div
              v-for="source in customerSources"
              :key="source.name"
              class="source-item"
            >
              <span class="source-name">{{ source.name }}</span>
              <span class="source-value">{{ source.value }}</span>
              <div class="source-bar">
                <div
                  class="source-fill"
                  :style="{ width: source.percent }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="customer-card">
          <div class="card-title">客户消费等级</div>
          <div class="level-chart">
            <div
              v-for="level in customerLevels"
              :key="level.name"
              class="level-item"
            >
              <div class="level-bar" :style="{ height: level.percent }">
                <span class="level-count">{{ level.count }}</span>
              </div>
              <span class="level-name">{{ level.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="analysis-section">
      <div class="section-header">
        <h3 class="section-title">🏆 热门服务排行</h3>
      </div>
      <div class="ranking-table">
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>服务名称</th>
              <th>订单数</th>
              <th>营收</th>
              <th>好评率</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in rankingData"
              :key="index"
              :class="{ top: index < 3 }"
            >
              <td>
                <span v-if="index === 0" class="rank-icon">🥇</span>
                <span v-else-if="index === 1" class="rank-icon">🥈</span>
                <span v-else-if="index === 2" class="rank-icon">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </td>
              <td>
                <span class="service-icon">{{ item.icon }}</span>
                <span>{{ item.name }}</span>
              </td>
              <td>{{ item.orders }}</td>
              <td>¥{{ item.revenue }}</td>
              <td
                ><span class="rating">{{ item.rating }}%</span></td
              >
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 备注说明 -->
    <div class="note-section">
      <p class="note-text"
        >📝 数据统计截止时间：{{ currentTime }} |
        所有数据均为模拟数据，仅供展示</p
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  function goBack() {
    router.push('/business');
  }

  // ===== 时间 =====
  const currentTime = ref(new Date().toLocaleString('zh-CN'));

  // ===== 周数据 =====
  const weeklyData = ref([
    { label: '周一', revenue: 65, orders: 55 },
    { label: '周二', revenue: 72, orders: 62 },
    { label: '周三', revenue: 58, orders: 48 },
    { label: '周四', revenue: 85, orders: 75 },
    { label: '周五', revenue: 92, orders: 82 },
    { label: '周六', revenue: 98, orders: 95 },
    { label: '周日', revenue: 88, orders: 80 },
  ]);

  // ===== 服务分类数据 =====
  const serviceData = ref([
    { name: '美容护理', value: 115, percent: '45%', color: '#6366f1' },
    { name: '健康体检', value: 77, percent: '30%', color: '#8b5cf6' },
    { name: '寄养服务', value: 39, percent: '15%', color: '#a855f7' },
    { name: '疫苗接种', value: 25, percent: '10%', color: '#d946ef' },
  ]);

  const pieGradient = computed(() => {
    let gradient = 'conic-gradient(';
    let start = 0;
    serviceData.value.forEach((item, index) => {
      const deg = (parseInt(item.percent, 10) / 100) * 360;
      gradient += `${item.color} ${start}deg ${start + deg}deg`;
      if (index < serviceData.value.length - 1) gradient += ', ';
      start += deg;
    });
    gradient += ')';
    return gradient;
  });

  // ===== 客户来源 =====
  const customerSources = ref([
    { name: '线上搜索', value: 45, percent: '45%' },
    { name: '朋友推荐', value: 25, percent: '25%' },
    { name: '平台推荐', value: 20, percent: '20%' },
    { name: '线下门店', value: 10, percent: '10%' },
  ]);

  // ===== 客户等级 =====
  const customerLevels = ref([
    { name: '普通客户', count: 85, percent: '45%' },
    { name: '银卡会员', count: 65, percent: '34%' },
    { name: '金卡会员', count: 30, percent: '16%' },
    { name: '钻石会员', count: 9, percent: '5%' },
  ]);

  // ===== 排行榜数据 =====
  const rankingData = ref([
    {
      icon: '🐾',
      name: '深度洗护套餐',
      orders: 45,
      revenue: 13500,
      rating: 98,
    },
    {
      icon: '🏥',
      name: '年度体检套餐',
      orders: 32,
      revenue: 18560,
      rating: 99,
    },
    { icon: '🏠', name: '周末寄养服务', orders: 28, revenue: 9800, rating: 96 },
    { icon: '💉', name: '疫苗接种套餐', orders: 25, revenue: 4500, rating: 97 },
    { icon: '🪣', name: '基础洗澡服务', orders: 22, revenue: 3300, rating: 95 },
    { icon: '✂️', name: '造型修剪服务', orders: 18, revenue: 5400, rating: 94 },
  ]);
</script>

<style scoped>
  .report-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 20px;
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

  /* ===== 筛选栏 ===== */
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .date-range {
    display: flex;
    gap: 8px;
  }

  .filter-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background: #f5f7fa;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn.active {
    background: #6366f1;
    color: #ffffff;
  }

  .export-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .export-btn:hover {
    background: #f5f7fa;
    border-color: #d1d5db;
  }

  /* ===== 核心指标 ===== */
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .summary-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .card-icon.revenue {
    background: #fef3c7;
  }
  .card-icon.orders {
    background: #eff6ff;
  }
  .card-icon.customers {
    background: #ecfdf5;
  }
  .card-icon.avg {
    background: #fdf4ff;
  }
  .card-icon.conversion {
    background: #e0e7ff;
  }
  .card-icon.retention {
    background: #d1fae5;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .card-value {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .card-label {
    font-size: 12px;
    color: #9ca3af;
  }

  .card-change {
    font-size: 11px;
  }

  .card-change.up {
    color: #10b981;
  }
  .card-change.down {
    color: #ef4444;
  }

  /* ===== 分析区域 ===== */
  .analysis-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
  }

  .section-header {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a2e;
    margin: 0;
  }

  /* ===== 营收图表 ===== */
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 14px;
    color: #6b7280;
  }

  .legend {
    display: flex;
    gap: 16px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .bar-chart {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 200px;
  }

  .bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .bar-stack {
    display: flex;
    flex-direction: column-reverse;
    gap: 2px;
    height: 160px;
    width: 32px;
  }

  .bar {
    border-radius: 4px;
    transition: height 0.3s ease;
  }

  .bar.revenue {
    background: #6366f1;
  }
  .bar.orders {
    background: #8b5cf6;
  }

  .bar-label {
    font-size: 12px;
    color: #9ca3af;
  }

  /* ===== 饼图区域 ===== */
  .pie-section {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .pie-container {
    width: 200px;
    height: 200px;
  }

  .pie-chart {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .pie {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .pie-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .pie-value {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .pie-label {
    font-size: 12px;
    color: #9ca3af;
  }

  .pie-legend {
    flex: 1;
    padding-left: 40px;
  }

  .legend-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .legend-row .legend-color {
    width: 16px;
    height: 16px;
  }

  .legend-name {
    width: 80px;
    font-size: 14px;
    color: #4a4a68;
  }

  .legend-value {
    width: 60px;
    font-size: 14px;
    color: #1a1a2e;
    font-weight: 500;
  }

  .legend-percent {
    width: 40px;
    font-size: 14px;
    color: #6366f1;
    font-weight: 500;
  }

  .legend-bar {
    flex: 1;
    height: 8px;
    background: #f5f7fa;
    border-radius: 4px;
    overflow: hidden;
  }

  .legend-fill {
    height: 100%;
    border-radius: 4px;
  }

  /* ===== 客户分析 ===== */
  .customer-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .customer-card {
    background: #f9fafb;
    border-radius: 10px;
    padding: 16px;
  }

  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a2e;
    margin-bottom: 12px;
  }

  .source-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .source-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .source-name {
    width: 70px;
    font-size: 13px;
    color: #6b7280;
  }

  .source-value {
    width: 40px;
    font-size: 13px;
    color: #1a1a2e;
    font-weight: 500;
  }

  .source-bar {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .source-fill {
    height: 100%;
    background: #6366f1;
    border-radius: 3px;
  }

  .level-chart {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 150px;
  }

  .level-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .level-bar {
    width: 40px;
    background: #6366f1;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 4px;
  }

  .level-count {
    font-size: 12px;
    color: #ffffff;
    font-weight: 500;
  }

  .level-name {
    font-size: 12px;
    color: #6b7280;
  }

  /* ===== 排行榜 ===== */
  .ranking-table {
    overflow-x: auto;
  }

  .ranking-table table {
    width: 100%;
    border-collapse: collapse;
  }

  .ranking-table th {
    text-align: left;
    padding: 12px;
    font-size: 13px;
    font-weight: 500;
    color: #9ca3af;
    border-bottom: 1px solid #f3f4f6;
  }

  .ranking-table td {
    padding: 12px;
    font-size: 14px;
    color: #4a4a68;
    border-bottom: 1px solid #f3f4f6;
  }

  .ranking-table tbody tr:hover {
    background: #f9fafb;
  }

  .ranking-table tbody tr.top {
    background: #fef3c7;
  }

  .rank-icon {
    font-size: 18px;
  }

  .service-icon {
    margin-right: 8px;
  }

  .rating {
    color: #10b981;
    font-weight: 500;
  }

  /* ===== 备注 ===== */
  .note-section {
    text-align: center;
    padding: 16px;
  }

  .note-text {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
  }

  /* ===== 响应式 ===== */
  @media (max-width: 1024px) {
    .summary-cards {
      grid-template-columns: repeat(3, 1fr);
    }
    .customer-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .summary-cards {
      grid-template-columns: repeat(2, 1fr);
    }
    .pie-section {
      flex-direction: column;
      gap: 20px;
    }
    .pie-legend {
      padding-left: 0;
    }
  }
</style>
