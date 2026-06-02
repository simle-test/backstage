<template>
  <div class="question-list-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>
    <div v-else class="content-card">
      <div class="card-header">
        <div class="header-left">
          <button class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回
          </button>
          <div class="header-title">
            <h2>{{ currentBankName || '题目列表' }}</h2>
            <span class="subtitle">共 {{ total }} 道题目</span>
          </div>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="搜索题目" v-model="searchKeyword" @keyup.enter="handleSearch">
          </div>
          <button class="btn-primary" @click="handleAddQuestion">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            添加题目
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <select v-model="difficultyFilter" class="filter-select" @change="handleFilter">
          <option value="">全部难度</option>
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
        <select v-model="categoryFilter" class="filter-select" @change="handleFilter">
          <option value="">全部分类</option>
          <option value="language_understanding">言语理解</option>
          <option value="quantity_relation">数量关系</option>
          <option value="material_analysis">资料分析</option>
          <option value="common_sense_judgment">常识判断</option>
          <option value="logical_judgment">判断推理</option>
          <option value="political_theory">政治理论</option>
        </select>
      </div>

      <div class="table-container">
        <table class="question-table">
          <thead>
            <tr>
              <th>题目ID</th>
              <th>题目内容</th>
              <th>分类</th>
              <th>难度</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in questions" :key="question.id" class="table-row">
              <td class="question-id">{{ question.questionId || question.id }}</td>
              <td class="question-content">
                <div class="content-preview">{{ question.title || question.content || '暂无内容' }}</div>
              </td>
              <td class="question-category">
                <span class="category-tag">{{ getCategoryText(question.category) }}</span>
              </td>
              <td class="question-difficulty">
                <span :class="['difficulty-badge', `difficulty-${question.difficulty}`]">{{ getDifficultyText(question.difficulty) }}</span>
              </td>
              <td class="question-time">{{ formatTime(question.updatedAt || question.createdAt) }}</td>
              <td class="question-actions">
                <button class="action-btn edit" @click="handleEdit(question.id)">编辑</button>
                <button class="action-btn delete" @click="handleDelete(question.id)">删除</button>
              </td>
            </tr>
            <tr v-if="questions.length === 0">
              <td colspan="6" class="empty-state">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>暂无题目</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="page-btn" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">
          下一页
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getQuestionList, deleteQuestion } from '@/api/question'
import { getBankList } from '@/api/bank'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const questions = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const difficultyFilter = ref('')
const categoryFilter = ref('')
const currentBankName = ref('')
const selectedCategoryId = ref('')

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const loadQuestionList = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (difficultyFilter.value) params.difficulty = difficultyFilter.value
    
    const urlCategoryId = route.query.categoryId as string
    if (urlCategoryId && !categoryFilter.value) {
      params.category = urlCategoryId
    } else if (categoryFilter.value) {
      params.category = categoryFilter.value
    }
    
    const bankId = route.query.bankId
    if (bankId) {
      params.bankId = bankId
    }
    
    const res = await getQuestionList(params)
    if (res.data.code === 200) {
      questions.value = res.data.data.list || []
      total.value = res.data.data.total || 0
    } else {
      ElMessage.error(res.data.message || '获取题目列表失败')
    }
  } catch (error: any) {
    console.error('获取题目列表失败:', error)
    const errMsg = error.response?.data?.message || error.message || '获取题目列表失败'
    ElMessage.error(errMsg)
  } finally {
    loading.value = false
  }
}

const loadBankName = async () => {
  const bankId = route.query.bankId
  if (bankId) {
    try {
      const res = await getBankList()
      if (res.data.code === 200) {
        const banks = res.data.data || []
        const bank = banks.find((b: any) => b.id === bankId)
        if (bank) {
          currentBankName.value = bank.name || '题目列表'
        }
      }
    } catch (error) {
      console.error('获取题库名称失败:', error)
    }
  }
}

const goBack = () => {
  router.push('/app/questions')
}

const handleSearch = () => {
  currentPage.value = 1
  loadQuestionList()
}

const handleFilter = () => {
  currentPage.value = 1
  loadQuestionList()
}

const handleAddQuestion = () => {
  const bankId = route.query.bankId
  const categoryId = route.query.categoryId
  
  // 如果是资料分析题，跳转到专用编辑页面
  if (categoryId === 'material_analysis') {
    router.push({
      path: '/app/questions/material-analysis',
      query: { bankId, categoryId }
    })
  } else {
    router.push({
      path: '/app/questions/edit',
      query: { bankId, categoryId }
    })
  }
}

const handleEdit = (id: number) => {
  const bankId = route.query.bankId
  const categoryId = route.query.categoryId
  
  // 查找题目信息
  const question = questions.value.find(q => q.id === id)
  
  // 如果是资料分析题并且有materialId，跳转到专用编辑页面
  if (categoryId === 'material_analysis' || (question && question.materialId)) {
    router.push({
      path: '/app/questions/material-analysis',
      query: { bankId, categoryId, materialId: question?.materialId }
    })
  } else {
    router.push({
      path: `/app/questions/edit/${id}`,
      query: { bankId, categoryId }
    })
  }
}

const handleDelete = (id: number) => {
  ElMessageBox.confirm(
    '确定要删除这道题目吗?',
    '确认删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteQuestion(id)
      ElMessage.success('删除成功')
      loadQuestionList()
    } catch (error: any) {
      const errMsg = error.response?.data?.message || '删除失败'
      ElMessage.error(errMsg)
    }
  }).catch(() => {
  })
}

const changePage = (page: number) => {
  currentPage.value = page
  loadQuestionList()
}

const getCategoryText = (category: string) => {
  const map: Record<string, string> = {
    'language_understanding': '言语理解',
    'quantity_relation': '数量关系',
    'material_analysis': '资料分析',
    'common_sense_judgment': '常识判断',
    'logical_judgment': '判断推理',
    'political_theory': '政治理论'
  }
  return map[category] || category || '未分类'
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
  }
  return map[difficulty] || difficulty || '未知'
}

const formatTime = (time: string) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  const urlCategoryId = route.query.categoryId as string
  if (urlCategoryId) {
    categoryFilter.value = urlCategoryId
  }
  loadBankName()
  loadQuestionList()
})
</script>

<style scoped lang="css">
.question-list-container {
  width: 100%;
  min-height: 100%;
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

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-title h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.header-title .subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  transition: all 0.3s;
}

.search-box:focus-within {
  border-color: var(--primary);
  background: var(--bg-card);
}

.search-box svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
  width: 200px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: var(--primary-gradient);
  color: #fff;
}

.btn-primary:hover {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
  transform: translateY(-1px);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.filter-select:hover {
  border-color: var(--border-color);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
}

.table-container {
  overflow-x: auto;
}

.question-table {
  width: 100%;
  border-collapse: collapse;
}

.question-table thead {
  background: var(--bg-secondary);
}

.question-table th {
  padding: 16px 24px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--border-light);
}

.table-row {
  transition: background 0.3s;
}

.table-row:hover {
  background: var(--bg-secondary);
}

.question-table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-light);
}

.question-id {
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.content-preview {
  max-width: 400px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.difficulty-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.difficulty-easy {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.difficulty-medium {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.difficulty-hard {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.question-time {
  font-size: 13px;
  color: var(--text-muted);
}

.question-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
  background: transparent;
}

.action-btn.edit {
  color: var(--primary);
  border-color: rgba(37, 99, 235, 0.2);
}

.action-btn.edit:hover {
  background: rgba(37, 99, 235, 0.1);
}

.action-btn.delete {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

.empty-state {
  text-align: center;
  padding: 60px 24px !important;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px;
  border-top: 1px solid var(--border-light);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--border-color);
  color: var(--text-primary);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn svg {
  width: 18px;
  height: 18px;
}

.page-info {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
