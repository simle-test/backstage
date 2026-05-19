<template>
  <div class="question-bank animate-fade-in">
    <div class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>模块管理</h2>
          <span class="subtitle">管理行测五大模块</span>
        </div>
        <div class="header-actions">
          <button class="btn-primary">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            新建模块
          </button>
        </div>
      </div>

      <div class="bank-grid">
        <div v-for="bank in banks" :key="bank.id" class="bank-card">
          <div class="bank-header">
            <div class="bank-icon" :style="{ background: bank.color }">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="bank-info">
              <h3 class="bank-name">{{ bank.name }}</h3>
              <p class="bank-desc">{{ bank.desc }}</p>
            </div>
          </div>
          
          <div class="bank-stats">
            <div class="stat-item">
              <span class="stat-num">{{ bank.count }}</span>
              <span class="stat-label">题目数量</span>
            </div>
          </div>

          <div class="bank-footer">
            <span class="update-time">更新于 {{ bank.updateTime }}</span>
            <div class="bank-actions">
              <button class="action-btn-small">编辑</button>
              <button class="action-btn-small primary">进入</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const banks = ref([
  { id: 1, name: '言语理解与表达', desc: '选词填空、片段阅读、语句表达', color: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', count: 320, completed: 189, progress: 59, updateTime: '2小时前' },
  { id: 2, name: '数量关系', desc: '数字推理、数学运算专项训练', color: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', count: 200, completed: 134, progress: 67, updateTime: '5小时前' },
  { id: 3, name: '判断推理', desc: '图形推理、定义判断、类比推理、逻辑判断', color: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)', count: 280, completed: 168, progress: 60, updateTime: '1天前' },
  { id: 4, name: '资料分析', desc: '速算技巧、统计术语、高频考点', color: 'linear-gradient(135deg, #22c55e 0%, #86efac 100%)', count: 180, completed: 151, progress: 84, updateTime: '2天前' },
  { id: 5, name: '常识判断', desc: '政治、经济、法律、历史、地理、科技', color: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)', count: 250, completed: 100, progress: 40, updateTime: '3天前' },
  { id: 6, name: '历年真题', desc: '国考、省考、联考真题精选', color: 'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)', count: 350, completed: 165, progress: 47, updateTime: '1周前' }
])
</script>

<style scoped lang="css">
.question-bank {
  width: 100%;
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
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
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

.btn-primary {
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
  background: var(--gold-gradient);
  color: #0a0a0a;
}

.btn-primary:hover {
  box-shadow: var(--shadow-gold-strong);
  transform: translateY(-2px);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  padding: 24px 28px;
}

.bank-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 22px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.bank-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.bank-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-color);
  box-shadow: var(--shadow-primary);
}

.bank-card:hover::before {
  opacity: 1;
}

.bank-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.bank-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bank-icon svg {
  width: 28px;
  height: 28px;
}

.bank-info {
  flex: 1;
  min-width: 0;
}

.bank-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.bank-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.bank-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border-radius: 10px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  font-family: 'Noto Serif SC', serif;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.bank-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.update-time {
  font-size: 12px;
  color: var(--text-muted);
}

.bank-actions {
  display: flex;
  gap: 8px;
}

.action-btn-small {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-light);
  background: transparent;
  color: var(--text-secondary);
}

.action-btn-small:hover {
  border-color: var(--border-color);
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-primary-color);
}

.action-btn-small.primary {
  background: var(--primary-gradient);
  border-color: transparent;
  color: #ffffff;
  font-weight: 600;
}

.action-btn-small.primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
</style>
