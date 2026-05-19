<template>
  <div class="question-management animate-fade-in">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 16h6M9 8h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">1,248</div>
          <div class="stat-label">题目总数</div>
        </div>
        <div class="stat-trend up">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 6h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          +12.5%
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon easy">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">456</div>
          <div class="stat-label">简单题目</div>
        </div>
        <div class="stat-percent">36.5%</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon medium">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">623</div>
          <div class="stat-label">中等题目</div>
        </div>
        <div class="stat-percent">49.9%</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon hard">
          <svg viewBox="0 0 24 24" fill="none">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">169</div>
          <div class="stat-label">困难题目</div>
        </div>
        <div class="stat-percent">13.6%</div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>题目列表</h2>
          <span class="subtitle">管理和维护所有题目</span>
        </div>
        <div class="header-actions">
          <button class="btn-primary">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            添加题目
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-group">
          <select class="filter-select">
            <option>所有难度</option>
            <option>简单</option>
            <option>中等</option>
            <option>困难</option>
          </select>
          <select class="filter-select">
            <option>所有分类</option>
            <option>言语理解</option>
            <option>数量关系</option>
            <option>判断推理</option>
            <option>资料分析</option>
            <option>常识判断</option>
          </select>
        </div>
        <div class="search-wrapper">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="text" placeholder="搜索题目..." class="filter-search">
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>题目标题</th>
              <th>难度</th>
              <th>分类</th>
              <th>通过率</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in questions" :key="item.id">
              <td class="id-cell">#{{ item.id }}</td>
              <td class="title-cell">
                <div class="title-wrapper">
                  <span class="title">{{ item.title }}</span>
                </div>
              </td>
              <td>
                <span :class="['difficulty-badge', item.difficulty]">
                  {{ item.difficultyText }}
                </span>
              </td>
              <td>{{ item.category }}</td>
              <td>
                <div class="pass-rate">
                  <div class="rate-bar">
                    <div class="rate-fill" :style="{ width: item.passRate + '%' }"></div>
                  </div>
                  <span class="rate-text">{{ item.passRate }}%</span>
                </div>
              </td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.statusText }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn delete">
                    <svg viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="page-btn" disabled>上一页</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <span class="page-dots">...</span>
        <button class="page-btn">25</button>
        <button class="page-btn">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const questions = ref([
  { id: 1, title: '言语理解与表达：主旨概括题', difficulty: 'easy', difficultyText: '简单', category: '言语理解', passRate: 72.5, status: 'active', statusText: '已发布' },
  { id: 2, title: '数量关系：行程问题', difficulty: 'easy', difficultyText: '简单', category: '数量关系', passRate: 65.3, status: 'active', statusText: '已发布' },
  { id: 3, title: '判断推理：图形推理题', difficulty: 'medium', difficultyText: '中等', category: '判断推理', passRate: 48.2, status: 'active', statusText: '已发布' },
  { id: 4, title: '资料分析：增长率计算', difficulty: 'medium', difficultyText: '中等', category: '资料分析', passRate: 52.1, status: 'draft', statusText: '草稿' },
  { id: 5, title: '常识判断：时事政治题', difficulty: 'medium', difficultyText: '中等', category: '常识判断', passRate: 60.8, status: 'active', statusText: '已发布' },
  { id: 6, title: '数量关系：排列组合题', difficulty: 'hard', difficultyText: '困难', category: '数量关系', passRate: 32.4, status: 'active', statusText: '已发布' },
  { id: 7, title: '判断推理：逻辑判断题', difficulty: 'hard', difficultyText: '困难', category: '判断推理', passRate: 28.6, status: 'draft', statusText: '草稿' },
  { id: 8, title: '资料分析：比重变化题', difficulty: 'hard', difficultyText: '困难', category: '资料分析', passRate: 18.9, status: 'draft', statusText: '草稿' }
])
</script>

<style scoped lang="css">
.question-management {
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
  font-size: 28px;
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
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--success);
}

.stat-trend.up {
  color: var(--success);
}

.stat-trend svg {
  width: 16px;
  height: 16px;
}

.stat-percent {
  font-size: 18px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: var(--primary-gradient);
  color: #ffffff;
}

.btn-primary:hover {
  box-shadow: var(--shadow-primary-strong);
  transform: translateY(-2px);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(37, 99, 235, 0.08);
}

.btn-secondary svg {
  width: 18px;
  height: 18px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  gap: 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: var(--border-color);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 320px;
}

.search-wrapper svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.filter-search {
  width: 100%;
  padding: 10px 16px 10px 42px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s;
}

.filter-search::placeholder {
  color: var(--text-muted);
}

.filter-search:focus {
  outline: none;
  border-color: var(--primary);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: var(--bg-secondary);
}

.data-table th {
  padding: 16px 28px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-light);
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border-light);
  transition: background 0.3s;
}

.data-table tbody tr:hover {
  background: rgba(37, 99, 235, 0.05);
}

.data-table td {
  padding: 20px 28px;
  font-size: 14px;
  color: var(--text-secondary);
}

.id-cell {
  color: var(--text-muted);
  font-weight: 600;
}

.title-cell .title {
  color: var(--text-primary);
  font-weight: 500;
}

.difficulty-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.difficulty-badge.easy {
  background: rgba(74, 222, 128, 0.15);
  color: var(--success);
}

.difficulty-badge.medium {
  background: rgba(251, 191, 36, 0.15);
  color: var(--warning);
}

.difficulty-badge.hard {
  background: rgba(248, 113, 113, 0.15);
  color: var(--danger);
}

.pass-rate {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rate-bar {
  flex: 1;
  max-width: 120px;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.rate-text {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 40px;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(37, 99, 235, 0.15);
  color: var(--primary);
}

.status-badge.draft {
  background: rgba(156, 163, 175, 0.15);
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-secondary);
}

.action-btn:hover {
  border-color: var(--border-color);
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-primary-color);
}

.action-btn.edit:hover {
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(96, 165, 250, 0.08);
  color: var(--info);
}

.action-btn.delete:hover {
  border-color: rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.08);
  color: var(--danger);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border-top: 1px solid var(--border-light);
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--border-color);
  color: var(--text-primary-color);
  background: rgba(37, 99, 235, 0.08);
}

.page-btn.active {
  background: var(--primary-gradient);
  border-color: transparent;
  color: #ffffff;
  font-weight: 700;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-dots {
  color: var(--text-muted);
  padding: 0 8px;
}
</style>
