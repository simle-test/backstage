<template>
  <div class="recent-questions">
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          返回
        </button>
        <div class="header-title">
          <h2>近期新增题目</h2>
          <span class="subtitle">最近 {{ days }} 天新增的题目，共 {{ total }} 道</span>
        </div>
      </div>
      <div class="header-right">
        <select v-model="days" class="day-select" @change="loadData">
          <option :value="7">最近7天</option>
          <option :value="14">最近14天</option>
          <option :value="30">最近30天</option>
        </select>
        <select v-model="categoryFilter" class="category-select" @change="loadData">
          <option value="">全部分类</option>
          <option value="political_theory">政治理论</option>
          <option value="quantity_relation">数量关系</option>
          <option value="material_analysis">资料分析</option>
          <option value="common_sense_judgment">常识判断</option>
          <option value="logical_judgment">判断推理</option>
          <option value="language_understanding">言语理解</option>
        </select>
      </div>
    </div>

    <div class="question-list">
      <div v-for="question in questions" :key="question.id" class="question-card">
        <div class="question-header">
          <div class="question-meta">
            <span class="category-tag">{{ getCategoryText(question.category) }}</span>
            <span class="difficulty-badge" :class="`difficulty-${question.difficulty}`">{{ getDifficultyText(question.difficulty) }}</span>
            <span class="create-time">{{ question.createdAt }}</span>
          </div>
          <div class="question-id">#{{ question.questionId || question.id }}</div>
        </div>
        
        <div class="question-content">
          <div v-if="question.imageUrl" class="question-image">
            <img :src="question.imageUrl" alt="题目图片" class="preview-image" />
          </div>
          <div class="question-title">
            {{ question.title }}
          </div>
          <div v-if="question.questionContent" class="question-options">
            <div v-for="(opt, key) in getOptions(question.questionContent)" :key="key" class="option-item">
              <span class="option-key">{{ key }}.</span>
              <span class="option-value">{{ opt }}</span>
            </div>
          </div>
        </div>
        
        <div class="question-footer">
          <span v-if="question.source" class="source-tag">来源: {{ question.source }}</span>
          <div class="question-actions">
            <button class="action-btn" @click="handleEdit(question.id)">查看详情</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="questions.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>暂无新增题目</p>
    </div>

    <div v-if="total > size" class="pagination">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecentQuestions } from '@/api/question'
import { ElMessage } from 'element-plus'

const router = useRouter()

const days = ref(7)
const currentPage = ref(1)
const size = ref(20)
const total = ref(0)
const categoryFilter = ref('')
const questions = ref<any[]>([])

const totalPages = computed(() => Math.ceil(total.value / size.value))

const loadData = async () => {
  currentPage.value = 1
  try {
    const res = await getRecentQuestions(days.value, currentPage.value, size.value, categoryFilter.value)
    if (res.data.code === 200) {
      questions.value = res.data.data.list || []
      total.value = res.data.data.total || 0
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || '获取数据失败'
    ElMessage.error(errMsg)
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  loadData()
}

const goBack = () => {
  router.push('/app/questions')
}

const handleEdit = (id: number) => {
  router.push(`/app/questions/edit/${id}`)
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
  return map[category] || category
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
  }
  return map[difficulty] || difficulty
}

const getOptions = (questionContent: string) => {
  if (!questionContent) return {}
  try {
    const content = JSON.parse(questionContent)
    return content.option || {}
  } catch {
    return {}
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="css">
.recent-questions {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-secondary);
}

.back-btn:hover {
  border-color: var(--border-color);
  color: var(--text-primary);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-title h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  gap: 12px;
}

.day-select,
.category-select {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.day-select:focus,
.category-select:focus {
  outline: none;
  border-color: var(--primary);
}

.question-list {
  display: grid;
  gap: 20px;
}

.question-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
}

.question-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.1);
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-tag {
  padding: 4px 12px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
}

.difficulty-badge {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
}

.difficulty-easy {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.difficulty-medium {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
}

.difficulty-hard {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.create-time {
  font-size: 13px;
  color: var(--text-muted);
}

.question-id {
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
}

.question-content {
  margin-bottom: 16px;
}

.question-image {
  margin-bottom: 12px;
  max-width: 200px;
}

.preview-image {
  max-width: 100%;
  border-radius: 8px;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.question-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.option-item {
  display: flex;
  gap: 8px;
}

.option-key {
  font-weight: 600;
  color: var(--primary);
  min-width: 24px;
}

.option-value {
  color: var(--text-secondary);
}

.question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.source-tag {
  font-size: 13px;
  color: var(--text-muted);
}

.question-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: var(--primary-gradient);
  color: #ffffff;
}

.action-btn:hover {
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-secondary);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn svg {
  width: 18px;
  height: 18px;
}

.page-info {
  font-size: 14px;
  color: var(--text-muted);
}
</style>