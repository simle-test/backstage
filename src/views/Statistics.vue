<template>
  <div class="page-container">
    <div class="page-header">
      <h2>统计分析</h2>
    </div>
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon users">
          <User class="icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalUsers }}</span>
          <span class="stat-label">总用户数</span>
        </div>
        <div class="stat-trend positive">
          <ArrowUpBold class="trend-icon" />
          <span>+12.5%</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon questions">
          <Document class="icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalQuestions }}</span>
          <span class="stat-label">总题目数</span>
        </div>
        <div class="stat-trend positive">
          <ArrowUpBold class="trend-icon" />
          <span>+8.3%</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon answers">
          <CircleCheck class="icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalAnswers }}</span>
          <span class="stat-label">答题总数</span>
        </div>
        <div class="stat-trend positive">
          <ArrowUpBold class="trend-icon" />
          <span>+15.2%</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon accuracy">
          <Aim class="icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.accuracyRate }}%</span>
          <span class="stat-label">平均正确率</span>
        </div>
        <div class="stat-trend negative">
          <ArrowDownBold class="trend-icon" />
          <span>-2.1%</span>
        </div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card">
        <h3>用户增长趋势</h3>
        <div class="chart-placeholder">
          <TrendCharts class="chart-icon" />
          <p>图表区域</p>
        </div>
      </div>
      <div class="chart-card">
        <h3>答题统计</h3>
        <div class="chart-placeholder">
          <PieChart class="chart-icon" />
          <p>图表区域</p>
        </div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card full-width">
        <h3>题库分类统计</h3>
        <div class="chart-placeholder">
          <TrendCharts class="chart-icon" />
          <p>图表区域</p>
        </div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card">
        <h3>难度分布</h3>
        <div class="difficulty-dist">
          <div class="dist-item">
            <div class="dist-bar easy" :style="{ width: difficultyData.easy + '%' }"></div>
            <span class="dist-label">简单 {{ difficultyData.easy }}%</span>
          </div>
          <div class="dist-item">
            <div class="dist-bar medium" :style="{ width: difficultyData.medium + '%' }"></div>
            <span class="dist-label">中等 {{ difficultyData.medium }}%</span>
          </div>
          <div class="dist-item">
            <div class="dist-bar hard" :style="{ width: difficultyData.hard + '%' }"></div>
            <span class="dist-label">困难 {{ difficultyData.hard }}%</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h3>活跃用户排行</h3>
        <div class="ranking-list">
          <div class="ranking-item" v-for="(user, index) in topUsers" :key="user.id">
            <span class="rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
            <span class="name">{{ user.username }}</span>
            <span class="score">{{ user.score }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Document, CircleCheck, Aim, ArrowUpBold, ArrowDownBold, TrendCharts, PieChart } from '@element-plus/icons-vue'

const stats = reactive({
  totalUsers: 1256,
  totalQuestions: 5820,
  totalAnswers: 125800,
  accuracyRate: 78.5
})

const difficultyData = reactive({
  easy: 35,
  medium: 45,
  hard: 20
})

const topUsers = ref([
  { id: 1, username: 'zhaoliu', score: 890 },
  { id: 2, username: 'zhangsan', score: 520 },
  { id: 3, username: 'lisi', score: 380 },
  { id: 4, username: 'sunqi', score: 230 },
  { id: 5, username: 'wangwu', score: 150 }
])
</script>

<style scoped>
.page-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.users {
  background: linear-gradient(135deg, #409eff, #667eea);
}

.stat-icon.questions {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.stat-icon.answers {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
}

.stat-icon.accuracy {
  background: linear-gradient(135deg, #f56c6c, #f89898);
}

.stat-icon .icon {
  font-size: 24px;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.stat-trend.positive {
  color: #67c23a;
}

.stat-trend.negative {
  color: #f56c6c;
}

.trend-icon {
  font-size: 14px;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-card h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-icon {
  font-size: 48px;
  color: #ccc;
}

.chart-placeholder p {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

.difficulty-dist {
  padding: 10px;
}

.dist-item {
  margin-bottom: 15px;
}

.dist-item:last-child {
  margin-bottom: 0;
}

.dist-bar {
  height: 20px;
  border-radius: 10px;
  margin-bottom: 5px;
  transition: width 0.3s;
}

.dist-bar.easy {
  background: linear-gradient(90deg, #67c23a, #85ce61);
}

.dist-bar.medium {
  background: linear-gradient(90deg, #e6a23c, #f0c78a);
}

.dist-bar.hard {
  background: linear-gradient(90deg, #f56c6c, #f89898);
}

.dist-label {
  font-size: 13px;
  color: #666;
}

.ranking-list {
  padding: 10px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.ranking-item:hover {
  background-color: #f8f9fa;
}

.ranking-item:last-child {
  margin-bottom: 0;
}

.rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
}

.rank.top-three {
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #fff;
}

.rank:nth-child(1) .rank.top-three {
  background: linear-gradient(135deg, #ffd700, #ffb700);
}

.name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.score {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}
</style>