<template>
  <div class="user-management animate-fade-in">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">12,458</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-trend up">+8.2%</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon easy">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">3,847</div>
          <div class="stat-label">活跃用户</div>
        </div>
        <div class="stat-percent">30.9%</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon medium">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">892</div>
          <div class="stat-label">今日新增</div>
        </div>
        <div class="stat-percent">7.2%</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon hard">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">62%</div>
          <div class="stat-label">留存率</div>
        </div>
        <div class="stat-percent">+3.1%</div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>用户列表</h2>
          <span class="subtitle">管理所有平台用户</span>
        </div>
        <div class="header-actions">
          <button class="btn-secondary">导出</button>
          <button class="btn-primary">添加用户</button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>角色</th>
              <th>刷题数</th>
              <th>通过率</th>
              <th>注册时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar" :style="{ background: user.color }">
                    {{ user.avatar }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td><span :class="['role-badge', user.role]">{{ user.roleText }}</span></td>
              <td class="num-cell">{{ user.solved }}</td>
              <td>
                <div class="pass-rate">
                  <div class="rate-bar">
                    <div class="rate-fill" :style="{ width: user.passRate + '%' }"></div>
                  </div>
                  <span class="rate-text">{{ user.passRate }}%</span>
                </div>
              </td>
              <td>{{ user.joinDate }}</td>
              <td><span :class="['status-badge', user.status]">{{ user.statusText }}</span></td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <button class="action-btn delete">
                    <svg viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
        <button class="page-btn">50</button>
        <button class="page-btn">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
  { id: 1, name: '李明', email: 'liming@example.com', avatar: '李', color: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', role: 'user', roleText: '用户', solved: 256, passRate: 72, joinDate: '2024-01-15', status: 'active', statusText: '正常' },
  { id: 2, name: '王芳', email: 'wangfang@example.com', avatar: '王', color: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', role: 'admin', roleText: '管理员', solved: 489, passRate: 85, joinDate: '2023-08-20', status: 'active', statusText: '正常' },
  { id: 3, name: '张伟', email: 'zhangwei@example.com', avatar: '张', color: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)', role: 'user', roleText: '用户', solved: 178, passRate: 64, joinDate: '2024-02-10', status: 'active', statusText: '正常' },
  { id: 4, name: '刘洋', email: 'liuyang@example.com', avatar: '刘', color: 'linear-gradient(135deg, #22c55e 0%, #86efac 100%)', role: 'user', roleText: '用户', solved: 89, passRate: 58, joinDate: '2024-03-05', status: 'inactive', statusText: '离线' },
  { id: 5, name: '陈静', email: 'chenjing@example.com', avatar: '陈', color: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)', role: 'vip', roleText: 'VIP', solved: 367, passRate: 78, joinDate: '2023-11-22', status: 'active', statusText: '正常' },
  { id: 6, name: '杨林', email: 'yanglin@example.com', avatar: '杨', color: 'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)', role: 'user', roleText: '用户', solved: 45, passRate: 52, joinDate: '2024-03-28', status: 'banned', statusText: '封禁' }
])
</script>

<style scoped lang="css">
.user-management {
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

.btn-primary,
.btn-secondary {
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

.btn-secondary {
  background: transparent;
  color: var(--text-primary-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(37, 99, 235, 0.08);
}

.header-actions {
  display: flex;
  gap: 12px;
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  font-size: 12px;
  color: var(--text-muted);
}

.role-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge.admin {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.role-badge.vip {
  background: rgba(37, 99, 235, 0.15);
  color: var(--primary);
}

.role-badge.user {
  background: rgba(156, 163, 175, 0.15);
  color: var(--text-muted);
}

.num-cell {
  font-weight: 600;
  color: var(--text-primary);
}

.pass-rate {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rate-bar {
  flex: 1;
  max-width: 100px;
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
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}

.status-badge.inactive {
  background: rgba(156, 163, 175, 0.15);
  color: var(--text-muted);
}

.status-badge.banned {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
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
