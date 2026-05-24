<template>
  <div class="statistics animate-fade-in">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ overallStats.totalQuestions.toLocaleString() }}</div>
          <div class="stat-label">总题数</div>
        </div>
        <div class="stat-trend up">+{{ overallStats.totalQuestions }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon easy">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ overallStats.totalSubmissions.toLocaleString() }}</div>
          <div class="stat-label">总提交</div>
        </div>
        <div class="stat-percent">+12.4%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon medium">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ overallStats.totalUsers.toLocaleString() }}</div>
          <div class="stat-label">总用户</div>
        </div>
        <div class="stat-percent">+8.2%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon hard">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ overallStats.avgPassRate }}%</div>
          <div class="stat-label">平均通过率</div>
        </div>
        <div class="stat-percent">+3.2%</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3>每日提交趋势</h3>
          <span class="chart-desc">最近7天数据</span>
        </div>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div v-for="(item, index) in chartData" :key="index" class="bar-wrapper">
              <div class="bar" :style="{ height: item.value + '%' }"></div>
              <span class="bar-label">{{ item.day }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3>模块得分分布</h3>
          <span class="chart-desc">五大模块正确率统计</span>
        </div>
        <div class="difficulty-dist">
          <div class="dist-item">
            <div class="dist-header">
              <span class="dist-label">言语理解</span>
              <span class="dist-value">{{ difficultyData.easy }}%</span>
            </div>
            <div class="dist-bar easy" :style="{ width: difficultyData.easy + '%' }"></div>
          </div>
          <div class="dist-item">
            <div class="dist-header">
              <span class="dist-label">判断推理</span>
              <span class="dist-value">{{ difficultyData.medium }}%</span>
            </div>
            <div class="dist-bar medium" :style="{ width: difficultyData.medium + '%' }"></div>
          </div>
          <div class="dist-item">
            <div class="dist-header">
              <span class="dist-label">资料分析</span>
              <span class="dist-value">{{ difficultyData.hard }}%</span>
            </div>
            <div class="dist-bar hard" :style="{ width: difficultyData.hard + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>刷题排行榜</h2>
          <span class="subtitle">本周刷题最多的用户</span>
        </div>
      </div>
      <div class="ranking-list">
        <div v-for="(user, index) in rankingData" :key="user.id" class="ranking-item">
          <div class="rank-number" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
          <div class="user-avatar" :style="{ background: user.color }">{{ user.avatar }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-desc">{{ user.desc }}</span>
          </div>
          <div class="score-info">
            <span class="score">{{ user.solved }}</span>
            <span class="score-label">道题</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getOverallStatistics, getDailyTrend, getCategoryScores, getRanking } from '@/api/statistics'
import { ElMessage } from 'element-plus'

interface OverallStats {
  totalQuestions: number
  totalSubmissions: number
  totalUsers: number
  avgPassRate: number
}

interface ChartItem {
  day: string
  value: number
}

interface RankingItem {
  id: number
  name: string
  avatar: string
  color: string
  desc: string
  solved: number
}

const overallStats = ref<OverallStats>({
  totalQuestions: 0,
  totalSubmissions: 0,
  totalUsers: 0,
  avgPassRate: 0
})

const chartData = ref<ChartItem[]>([])
const difficultyData = ref({
  easy: 0,
  medium: 0,
  hard: 0
})
const rankingData = ref<RankingItem[]>([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const [overallRes, dailyRes, categoryRes, rankingRes] = await Promise.all([
      getOverallStatistics(),
      getDailyTrend(7),
      getCategoryScores(),
      getRanking(10)
    ])

    if (overallRes.data.code === 200) {
      overallStats.value = overallRes.data.data
    }

    if (dailyRes.data.code === 200) {
      const maxValue = Math.max(...dailyRes.data.data.map((item: any) => item.count))
      chartData.value = dailyRes.data.data.map((item: any) => ({
        day: item.date.slice(5),
        value: maxValue > 0 ? (item.count / maxValue) * 100 : 0
      }))
    }

    if (categoryRes.data.code === 200) {
      difficultyData.value = {
        easy: categoryRes.data.data.easyScore || 0,
        medium: categoryRes.data.data.mediumScore || 0,
        hard: categoryRes.data.data.hardScore || 0
      }
    }

    if (rankingRes.data.code === 200) {
      rankingData.value = rankingRes.data.data.map((item: any) => ({
        id: item.rank,
        name: item.username,
        avatar: item.avatar || item.username.charAt(0),
        color: item.avatarColor || 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        desc: item.title || '',
        solved: item.practiceCount
      }))
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="css">
.statistics {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-color);
  box-shadow: var(--shadow-primary);
}

.stat-card:hover::after {
  opacity: 1;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.stat-icon.easy {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.05) 100%);
  color: var(--success);
}

.stat-icon.medium {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%);
  color: var(--warning);
}

.stat-icon.hard {
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(248, 113, 113, 0.05) 100%);
  color: var(--danger);
}

.stat-icon svg {
  width: 26px;
  height: 26px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Noto Serif SC', serif;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-trend {
  font-size: 14px;
  font-weight: 600;
  color: var(--success);
}

.stat-percent {
  font-size: 18px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
  position: relative;
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0.3;
}

.chart-header {
  margin-bottom: 24px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Noto Serif SC', serif;
  margin-bottom: 4px;
}

.chart-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 200px;
  padding: 0 20px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 32px;
  background: var(--primary-gradient);
  border-radius: 4px 4px 0 0;
  opacity: 0.7;
  transition: all 0.3s;
}

.bar:hover {
  opacity: 1;
  transform: scaleY(1.05);
  transform-origin: bottom;
}

.bar-label {
  font-size: 12px;
  color: var(--text-muted);
}

.difficulty-dist {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dist-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dist-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.dist-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.dist-bar {
  height: 10px;
  background: var(--bg-tertiary);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.dist-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
}

.dist-bar.easy::before {
  width: 36.5%;
  background: linear-gradient(90deg, #22c55e 0%, #86efac 100%);
}

.dist-bar.medium::before {
  width: 49.9%;
  background: linear-gradient(90deg, #f59e0b 0%, #fcd34d 100%);
}

.dist-bar.hard::before {
  width: 13.6%;
  background: linear-gradient(90deg, #ef4444 0%, #fca5a5 100%);
}

.content-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0.3;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid var(--border-light);
}

.header-title h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 16px 28px;
  gap: 16px;
  transition: background 0.3s;
}

.ranking-item:hover {
  background: rgba(37, 99, 235, 0.05);
}

.rank-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  flex-shrink: 0;
}

.rank-number.rank-1 {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: #ffffff;
}

.rank-number.rank-2 {
  background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
  color: #ffffff;
}

.rank-number.rank-3 {
  background: linear-gradient(135deg, #fb923c 0%, #fed7aa 100%);
  color: #ffffff;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.score-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.score {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Noto Serif SC', serif;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-label {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
