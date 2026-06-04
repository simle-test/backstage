<template>
  <div class="question-bank animate-fade-in">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>
    <div v-else class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>题目管理</h2>
          <span class="subtitle">管理行测五大模块题目</span>
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
              <button class="action-btn-small" @click="handleEdit(bank)">编辑</button>
              <button class="action-btn-small primary" @click="handleEnterBank(bank.id)">进入</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editDialogVisible" class="dialog-overlay" @click.self="handleCloseDialog">
      <div class="edit-dialog">
        <div class="dialog-header">
          <h3>编辑模块</h3>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBankList, updateBank } from '@/api/bank'
import { ElMessage } from 'element-plus'

const router = useRouter()

interface Bank {
  id: number
  name: string
  desc: string
  color: string
  count: number
  updateTime: string
}

const banks = ref<Bank[]>([])
const loading = ref(true)
const editDialogVisible = ref(false)
const saving = ref(false)

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
    const res = await getBankList()
    if (res.code === 200) {
      banks.value = res.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        desc: item.desc || '',
        color: item.color || 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        count: item.count || 0,
        updateTime: item.updateTime || ''
      }))
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.response?.data?.msg || error.message || '获取数据失败'
    ElMessage.error(errMsg)
    console.error('获取题库数据失败:', error.response?.data || error)
  } finally {
    loading.value = false
  }
}

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
  editForm.id = bank.id
  editForm.name = bank.name
  editForm.desc = bank.desc
  editForm.color = bank.color
  editDialogVisible.value = true
}

const handleCloseDialog = () => {
  editDialogVisible.value = false
}

const handleSave = async () => {
  if (!editForm.name.trim()) {
    ElMessage.warning('请输入模块名称')
    return
  }
  
  saving.value = true
  try {
    const res = await updateBank(editForm.id, {
      name: editForm.name,
      desc: editForm.desc,
      color: editForm.color
    })
    
    if (res.code === 200) {
      ElMessage.success('保存成功')
      editDialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || '保存失败'
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-light);
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
  margin-top: 16px;
  color: var(--text-muted);
  font-size: 14px;
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

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  padding: 28px;
}

.bank-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
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
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.bank-card:hover {
  transform: translateY(-6px);
  border-color: var(--primary);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
}

.bank-card:hover::before {
  opacity: 1;
}

.bank-header {
  display: flex;
  gap: 18px;
  margin-bottom: 22px;
}

.bank-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bank-icon svg {
  width: 30px;
  height: 30px;
}

.bank-info {
  flex: 1;
  min-width: 0;
}

.bank-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.bank-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.bank-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.stat-num {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Noto Serif SC', serif;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.bank-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
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
  border-radius: 16px;
  width: 480px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.dialog-header h3 {
  font-family: 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.dialog-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
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
  width: 20px;
  height: 20px;
}

.dialog-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
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
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid transparent;
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
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.btn-cancel {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
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
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: var(--primary-gradient);
  color: #ffffff;
}

.btn-save:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
