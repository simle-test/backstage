<template>
  <div class="question-bank animate-fade-in">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>
    <div v-else>
      <!-- 近期新增概览卡片 -->
      <div class="overview-card">
        <div class="overview-header">
          <div class="overview-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="overview-title">
            <h3>近期新增数据概览</h3>
            <span class="overview-subtitle">最近7天（{{ dateRange }}）共新增题目 <strong>{{ totalRecentAdded }}</strong> 道</span>
          </div>
        </div>
        <button class="view-detail-btn" @click="handleViewRecent">
          <span>查看新增详情</span>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 统计卡片区域 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-num">{{ statistics.total || 0 }}</span>
            <span class="stat-label">总题目数</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon today-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-num today-num">{{ statistics.todayCount || 0 }}</span>
            <span class="stat-label">今日新增</span>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="header-title">
            <h2>题目管理</h2>
            <span class="subtitle">管理行测五大模块题目</span>
          </div>
          <div class="header-actions">
            <button class="btn-primary" @click="handleCreate">
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
                <div class="bank-name-row">
                  <h3 class="bank-name">{{ bank.name }}</h3>
                  <span class="new-badge">NEW</span>
                </div>
                <p class="bank-desc">{{ bank.desc }}</p>
              </div>
            </div>
            
            <div class="bank-stats">
              <div class="stat-item primary-stat">
                <span class="stat-num">{{ bank.count }}</span>
                <span class="stat-label">题目数量</span>
              </div>
              <div class="stat-divider"></div>
              <div class="recent-addition">
                <div class="recent-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="recent-info">
                  <span class="recent-label">近期新增（7天）</span>
                  <div class="recent-stats">
                    <span class="recent-count">{{ bank.recentAdded || 0 }} 道</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="latest-additions">
              <div class="latest-header">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="latest-title">最新新增</span>
              </div>
              <div class="latest-list">
                <div v-for="(item, index) in bank.latestQuestions.slice(0, 2)" :key="index" class="latest-item">
                  <span class="latest-dot"></span>
                  <span class="latest-time">{{ item.time }}</span>
                  <span class="latest-source">{{ item.source }}</span>
                </div>
              </div>
            </div>

            <div class="bank-footer">
              <span class="update-time">更新于 {{ bank.updateTime }}</span>
              <div class="bank-actions">
                <button class="action-btn-small delete" @click="handleDelete(bank)">删除</button>
                <button class="action-btn-small" @click="handleEdit(bank)">编辑</button>
                <button class="action-btn-small primary" @click="handleEnterBank(bank.id)">进入</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editDialogVisible" class="dialog-overlay" @click.self="handleCloseDialog">
      <div class="edit-dialog">
        <div class="dialog-header">
          <h3>{{ isEdit ? '编辑模块' : '新建模块' }}</h3>
          <button class="dialog-close" @click="handleCloseDialog">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">模块名称</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="editForm.name" 
              placeholder="请输入模块名称"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">模块描述</label>
            <textarea 
              class="form-textarea" 
              v-model="editForm.desc" 
              placeholder="请输入模块描述"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">主题颜色</label>
            <div class="color-picker">
              <div 
                v-for="color in colorOptions" 
                :key="color.value"
                class="color-option"
                :class="{ active: editForm.color === color.value }"
                :style="{ background: color.value }"
                @click="editForm.color = color.value"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="dialog-footer">
          <button class="btn-cancel" @click="handleCloseDialog">取消</button>
          <button class="btn-save" @click="handleSave" :disabled="saving">
            <span v-if="saving" class="loading-spinner-small"></span>
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBankList, updateBank, createBank, deleteBank } from '@/api/bank'
import { getQuestionStatistics, getRecentStats, type QuestionStatistics } from '@/api/question'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const handleViewRecent = () => {
  router.push('/app/questions/recent')
}

interface LatestQuestion {
  time: string
  source: string
}

interface Bank {
  id: number
  name: string
  desc: string
  color: string
  count: number
  updateTime: string
  recentAdded: number
  growthRate: number
  latestQuestions: LatestQuestion[]
}

const banks = ref<Bank[]>([])
const loading = ref(true)
const editDialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const statistics = ref<QuestionStatistics>({
  total: 0,
  easyCount: 0,
  mediumCount: 0,
  hardCount: 0,
  todayCount: 0,
  categoryList: []
})

const editForm = reactive({
  id: 0,
  name: '',
  desc: '',
  color: ''
})

const colorOptions = [
  { label: '蓝色', value: '#409EFF' },
  { label: '绿色', value: '#67C23A' },
  { label: '橙色', value: '#E6A23C' },
  { label: '红色', value: '#F56C6C' },
  { label: '灰色', value: '#909399' },
  { label: '紫色', value: '#B37FEB' },
  { label: '青色', value: '#36B37E' },
  { label: '粉色', value: '#E87890' }
]

const loadData = async () => {
  loading.value = true
  try {
    // 并行获取题库列表、统计数据和近期新增统计
    const [bankRes, statsRes, recentStatsRes] = await Promise.all([
      getBankList(),
      getQuestionStatistics(),
      getRecentStats(7)
    ])
    
    // 构建分类统计映射
    const categoryStatsMap: Record<string, any> = {}
    if (recentStatsRes.data.code === 200) {
      const categoryStats = recentStatsRes.data.data.categoryStats || []
      categoryStats.forEach((stat: any) => {
        categoryStatsMap[stat.categoryId] = stat
      })
    }
    
    // 处理题库列表
    if (bankRes.data.code === 200) {
      banks.value = bankRes.data.data.map((item: any) => {
        const categoryId = getCategoryIdByName(item.name)
        const recentStat = categoryStatsMap[categoryId] || {}
        
        return {
          id: item.id,
          name: item.name,
          desc: item.desc || '',
          color: item.color || 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          count: item.count || 0,
          updateTime: item.updateTime || '2026-06-01 16:05',
          recentAdded: recentStat.count || 0,
          growthRate: recentStat.growthRate || 0,
          latestQuestions: recentStat.latestQuestions || []
        }
      })
    }
    
    // 处理统计数据
    if (statsRes.data.code === 200) {
      statistics.value = {
        total: statsRes.data.data.total || 0,
        easyCount: statsRes.data.data.easyCount || 0,
        mediumCount: statsRes.data.data.mediumCount || 0,
        hardCount: statsRes.data.data.hardCount || 0,
        todayCount: statsRes.data.data.todayCount || 0,
        categoryList: statsRes.data.data.categoryList || []
      }
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.response?.data?.msg || error.message || '获取数据失败'
    ElMessage.error(errMsg)
    console.error('获取数据失败:', error.response?.data || error)
  } finally {
    loading.value = false
  }
}

const getCategoryIdByName = (name: string): string => {
  const map: Record<string, string> = {
    '政治理论': 'political_theory',
    '数量关系': 'quantity_relation',
    '资料分析': 'material_analysis',
    '常识判断': 'common_sense_judgment',
    '判断推理': 'logical_judgment',
    '言语理解': 'language_understanding'
  }
  return map[name] || ''
}

const dateRange = computed(() => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
  
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
})

const totalRecentAdded = computed(() => {
  return banks.value.reduce((sum, bank) => sum + (bank.recentAdded || 0), 0)
})

const handleEnterBank = (bankId: number) => {
  const bank = banks.value.find(b => b.id === bankId)
  if (bank) {
    const categoryId = getCategoryIdByBankName(bank.name)
    router.push({ path: '/app/questions/list', query: { bankId, categoryId } })
  } else {
    router.push({ path: '/app/questions/list', query: { bankId } })
  }
}

const getCategoryIdByBankName = (bankName: string): string | null => {
  if (!bankName) return null
  
  if (bankName.includes('政治理论')) return 'political_theory'
  if (bankName.includes('数量关系')) return 'quantity_relation'
  if (bankName.includes('资料分析')) return 'material_analysis'
  if (bankName.includes('常识判断')) return 'common_sense_judgment'
  if (bankName.includes('判断推理')) return 'logical_judgment'
  if (bankName.includes('言语理解')) return 'language_understanding'
  
  return null
}

const handleEdit = (bank: Bank) => {
  isEdit.value = true
  editForm.id = bank.id
  editForm.name = bank.name
  editForm.desc = bank.desc
  editForm.color = bank.color
  editDialogVisible.value = true
}

const handleCreate = () => {
  isEdit.value = false
  editForm.id = 0
  editForm.name = ''
  editForm.desc = ''
  editForm.color = '#409EFF'
  editDialogVisible.value = true
}

const handleCloseDialog = () => {
  editDialogVisible.value = false
  editForm.id = 0
  editForm.name = ''
  editForm.desc = ''
  editForm.color = ''
}

const handleDelete = (bank: Bank) => {
  ElMessageBox.confirm(
    `确定要删除模块「${bank.name}」吗？此操作无法撤销。`,
    '确认删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await deleteBank(bank.id)
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      } else {
        ElMessage.error(res.data.message || '删除失败')
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || '删除失败'
      ElMessage.error(errMsg)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const handleSave = async () => {
  if (!editForm.name.trim()) {
    ElMessage.warning('请输入模块名称')
    return
  }
  
  saving.value = true
  try {
    const data = {
      name: editForm.name,
      desc: editForm.desc,
      color: editForm.color
    }
    
    const res = isEdit.value 
      ? await updateBank(editForm.id, data)
      : await createBank(data)
    
    if (res.data.code === 200) {
      ElMessage.success(isEdit.value ? '保存成功' : '新建成功')
      editDialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.data.message || (isEdit.value ? '保存失败' : '新建失败'))
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || (isEdit.value ? '保存失败' : '新建失败')
    ElMessage.error(errMsg)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="css">
.question-bank {
  width: 100%;
  min-height: 400px;
}

/* 概览卡片样式 - 紧凑版 */
.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.overview-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview-icon svg {
  width: 22px;
  height: 22px;
  color: #ffffff;
}

.overview-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.overview-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.overview-subtitle strong {
  color: #fbbf24;
  font-weight: 700;
}

.view-detail-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.view-detail-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.view-detail-btn svg {
  width: 16px;
  height: 16px;
}

/* 统计区域样式 - 紧凑版 */
.stats-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  min-width: 180px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.total-icon {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: #ffffff;
}

.today-icon {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #ffffff;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Noto Serif SC', serif;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-num.today-num {
  color: #10b981;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 12px;
  color: var(--text-muted);
  font-size: 13px;
}

.content-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
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
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.header-title h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: var(--primary-gradient);
  color: #ffffff;
}

.btn-primary:hover {
  box-shadow: var(--shadow-primary-strong);
  transform: translateY(-1px);
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.bank-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  transition: opacity 0.3s;
}

.bank-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
}

.bank-card:hover::before {
  opacity: 1;
}

.bank-header {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.bank-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.bank-icon svg {
  width: 24px;
  height: 24px;
}

.bank-info {
  flex: 1;
  min-width: 0;
}

.bank-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.bank-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.new-badge {
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 600;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 8px;
}

.bank-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

.bank-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 10px 14px;
  background: var(--bg-tertiary);
  border-radius: 10px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-item.primary-stat {
  flex-direction: column;
  align-items: flex-start;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-light);
}

.recent-addition {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recent-icon {
  width: 28px;
  height: 28px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-icon svg {
  width: 14px;
  height: 14px;
  color: #059669;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-label {
  font-size: 11px;
  color: var(--text-muted);
}

.recent-stats {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recent-count {
  font-size: 15px;
  font-weight: 700;
  color: #059669;
}

.growth-rate {
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
  padding: 1px 6px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.growth-rate.positive {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

.stat-num {
  font-size: 26px;
  font-weight: 700;
  font-family: 'Noto Serif SC', serif;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.latest-additions {
  margin-bottom: 12px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border-light);
}

.latest-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.latest-header svg {
  width: 14px;
  height: 14px;
  color: #2563eb;
}

.latest-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.latest-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.latest-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.latest-dot {
  width: 5px;
  height: 5px;
  background: #2563eb;
  border-radius: 50%;
  flex-shrink: 0;
}

.latest-time {
  color: var(--text-muted);
  font-size: 11px;
  min-width: 80px;
}

.latest-source {
  color: var(--text-secondary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bank-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.update-time {
  font-size: 11px;
  color: var(--text-muted);
}

.bank-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn-small {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-light);
  background: #ffffff;
  color: var(--text-secondary);
  min-width: 50px;
  text-align: center;
}

.action-btn-small:hover {
  border-color: var(--border-color);
  background: rgba(37, 99, 235, 0.05);
  color: var(--text-primary-color);
  transform: translateY(-1px);
}

.action-btn-small:active {
  transform: translateY(0);
}

.action-btn-small.primary {
  background: var(--primary-gradient);
  border-color: transparent;
  color: #ffffff;
  font-weight: 600;
}

.action-btn-small.primary:hover {
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
  background: linear-gradient(135deg, #4f9dff 0%, #367cf0 100%);
}

.action-btn-small.delete {
  background: rgba(245, 108, 108, 0.08);
  border-color: rgba(245, 108, 108, 0.25);
  color: #e85d5d;
}

.action-btn-small.delete:hover {
  background: rgba(245, 108, 108, 0.15);
  border-color: rgba(245, 108, 108, 0.4);
  color: #dc4c4c;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.edit-dialog {
  background: var(--bg-card);
  border-radius: 12px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.dialog-header h3 {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.dialog-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.dialog-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.dialog-close svg {
  width: 18px;
  height: 18px;
}

.dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: all 0.3s;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-card);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-textarea {
  resize: vertical;
  min-height: 70px;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 2px var(--bg-card);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.btn-cancel {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  border-color: var(--border-color);
  color: var(--text-primary);
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: var(--primary-gradient);
  color: #ffffff;
}

.btn-save:hover:not(:disabled) {
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
