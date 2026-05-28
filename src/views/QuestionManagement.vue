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
          <div class="stat-value">{{ (stats.total ?? 0).toLocaleString() }}</div>
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
          <div class="stat-value">{{ (stats.easyCount ?? 0).toLocaleString() }}</div>
          <div class="stat-label">简单题目</div>
        </div>
        <div class="stat-percent">{{ (stats.total ?? 0) > 0 ? (((stats.easyCount ?? 0) / (stats.total ?? 1)) * 100).toFixed(1) : 0 }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon medium">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats.mediumCount ?? 0).toLocaleString() }}</div>
          <div class="stat-label">中等题目</div>
        </div>
        <div class="stat-percent">{{ (stats.total ?? 0) > 0 ? (((stats.mediumCount ?? 0) / (stats.total ?? 1)) * 100).toFixed(1) : 0 }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon hard">
          <svg viewBox="0 0 24 24" fill="none">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats.hardCount ?? 0).toLocaleString() }}</div>
          <div class="stat-label">困难题目</div>
        </div>
        <div class="stat-percent">{{ (stats.total ?? 0) > 0 ? (((stats.hardCount ?? 0) / (stats.total ?? 1)) * 100).toFixed(1) : 0 }}%</div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>题目列表</h2>
          <span class="subtitle">管理和维护所有题目</span>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="openAddDialog">
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
          <select class="filter-select" v-model="selectedDifficulty" @change="loadData(1)">
            <option value="">所有难度</option>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
          <select class="filter-select" v-model="selectedCategory" @change="loadData(1)">
            <option value="">所有分类</option>
            <option value="language_understanding">言语理解</option>
            <option value="quantity_relation">数量关系</option>
            <option value="material_analysis">资料分析</option>
            <option value="common_sense_judgment">常识判断</option>
            <option value="logical_judgment">判断推理</option>
            <option value="political_theory">政治理论</option>
          </select>
        </div>
        <div class="search-wrapper">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="text" v-model="searchKeyword" placeholder="搜索题目..." class="filter-search" @keyup.enter="loadData(1)">
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
              <th>正确答案</th>
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
              <td>{{ item.categoryText }}</td>
              <td>
                <span class="answer-badge">{{ item.answer || '-' }}</span>
              </td>
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
                  <div class="dropdown" :class="{ active: item.showDropdown }">
                    <button class="action-btn view" @click="toggleDropdown(item.id)">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                    <div class="dropdown-content">
                      <div class="dropdown-header">
                        <span class="dropdown-title">题目详情</span>
                        <button class="close-btn" @click="toggleDropdown(item.id)">
                          <svg viewBox="0 0 24 24" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          </svg>
                        </button>
                      </div>
                      <div class="dropdown-body">
                        <div class="detail-section">
                          <div class="detail-label">选项</div>
                          <div class="options-list">
                            <div v-for="(opt, idx) in item.options" :key="idx" class="option-item" :class="{ correct: String.fromCharCode(65 + idx) === item.answer }">
                              <span class="option-label">{{ String.fromCharCode(65 + idx) }}.</span>
                              <span class="option-text">{{ opt }}</span>
                              <span v-if="String.fromCharCode(65 + idx) === item.answer" class="correct-badge">正确答案</span>
                            </div>
                          </div>
                        </div>
                        <div class="detail-section">
                          <div class="detail-label">解析</div>
                          <div class="detail-content">{{ item.analysis || '暂无解析' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="action-btn edit" @click="openEditDialog(item)">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn delete" @click="handleDeleteQuestion(item.id)">
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
        <button class="page-btn" :disabled="currentPage <= 1" @click="prevPage">上一页</button>
        <template v-for="page in visiblePages" :key="page">
          <button 
            v-if="typeof page === 'number'"
            class="page-btn"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <span v-else class="page-dots">{{ page }}</span>
        </template>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="nextPage">下一页</button>
      </div>

      <div v-if="showAddDialog" class="dialog-overlay" @click.self="showAddDialog = false">
        <div class="dialog">
          <div class="dialog-header">
            <h3>添加题目</h3>
            <button class="close-btn" @click="showAddDialog = false">
              <svg viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-group">
              <label>题目标题</label>
              <input type="text" v-model="newQuestion.title" placeholder="请输入题目标题" class="form-input">
            </div>
            <div class="form-group">
              <label>题目选项</label>
              <div class="options-row">
                <div class="option-input-group">
                  <span class="option-label">A</span>
                  <input type="text" v-model="newQuestion.options[0]" placeholder="请输入选项A内容" class="form-input option-input">
                </div>
                <div class="option-input-group">
                  <span class="option-label">B</span>
                  <input type="text" v-model="newQuestion.options[1]" placeholder="请输入选项B内容" class="form-input option-input">
                </div>
              </div>
              <div class="options-row">
                <div class="option-input-group">
                  <span class="option-label">C</span>
                  <input type="text" v-model="newQuestion.options[2]" placeholder="请输入选项C内容" class="form-input option-input">
                </div>
                <div class="option-input-group">
                  <span class="option-label">D</span>
                  <input type="text" v-model="newQuestion.options[3]" placeholder="请输入选项D内容" class="form-input option-input">
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>难度</label>
                <select v-model="newQuestion.difficulty" class="form-select">
                  <option value="">请选择难度</option>
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>
              <div class="form-group">
                <label>分类</label>
                <select v-model="newQuestion.category" class="form-select">
                  <option value="">请选择分类</option>
                  <option value="language_understanding">言语理解</option>
                  <option value="quantity_relation">数量关系</option>
                  <option value="material_analysis">资料分析</option>
                  <option value="common_sense_judgment">常识判断</option>
                  <option value="logical_judgment">判断推理</option>
                  <option value="political_theory">政治理论</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>正确答案</label>
              <input type="text" v-model="newQuestion.answer" placeholder="请输入正确答案，如：A" class="form-input">
            </div>
            <div class="form-group">
              <label>答案解析</label>
              <textarea v-model="newQuestion.analysis" placeholder="请输入答案解析" class="form-textarea"></textarea>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-secondary" @click="showAddDialog = false">取消</button>
            <button class="btn-primary" @click="handleAddQuestion" :disabled="addLoading">确认添加</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 编辑题目弹窗 -->
  <div v-if="showEditDialog" class="dialog-overlay" @click.self="showEditDialog = false">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>编辑题目</h3>
        <button class="close-btn" @click="showEditDialog = false">
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="dialog-body">
        <div class="form-group">
          <label>题目标题</label>
          <input type="text" v-model="editQuestion.title" placeholder="请输入题目标题" class="form-input">
        </div>
        <div class="form-group">
          <label>题目选项</label>
          <div class="options-row">
            <div class="option-input-group">
              <span class="option-label">A</span>
              <input type="text" v-model="editQuestion.options[0]" placeholder="请输入选项A内容" class="form-input option-input">
            </div>
            <div class="option-input-group">
              <span class="option-label">B</span>
              <input type="text" v-model="editQuestion.options[1]" placeholder="请输入选项B内容" class="form-input option-input">
            </div>
          </div>
          <div class="options-row">
            <div class="option-input-group">
              <span class="option-label">C</span>
              <input type="text" v-model="editQuestion.options[2]" placeholder="请输入选项C内容" class="form-input option-input">
            </div>
            <div class="option-input-group">
              <span class="option-label">D</span>
              <input type="text" v-model="editQuestion.options[3]" placeholder="请输入选项D内容" class="form-input option-input">
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>难度</label>
            <select v-model="editQuestion.difficulty" class="form-select">
              <option value="">请选择难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="editQuestion.category" class="form-select">
              <option value="">请选择分类</option>
              <option value="language_understanding">言语理解</option>
              <option value="quantity_relation">数量关系</option>
              <option value="material_analysis">资料分析</option>
              <option value="common_sense_judgment">常识判断</option>
              <option value="logical_judgment">判断推理</option>
              <option value="political_theory">政治理论</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>正确答案</label>
          <input type="text" v-model="editQuestion.answer" placeholder="请输入正确答案，如：A" class="form-input">
        </div>
        <div class="form-group">
          <label>答案解析</label>
          <textarea v-model="editQuestion.analysis" placeholder="请输入答案解析" class="form-textarea"></textarea>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn-secondary" @click="showEditDialog = false">取消</button>
        <button class="btn-primary" @click="handleEditQuestion" :disabled="editLoading">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getQuestionList, getQuestionStatistics, addQuestion, updateQuestion, deleteQuestion } from '@/api/question'
import { ElMessage } from 'element-plus'

interface Question {
  id: number
  title: string
  difficulty: string
  difficultyText: string
  category: string
  categoryText: string
  passRate: number
  status: string
  statusText: string
  showDropdown: boolean
  content?: string
  options?: string[]
  answer?: string
  analysis?: string
}

interface Statistics {
  total: number
  easyCount: number
  mediumCount: number
  hardCount: number
  categoryList: { category: string; categoryText: string; count: number }[]
}

const questions = ref<Question[]>([])
const stats = ref<Statistics>({ total: 0, easyCount: 0, mediumCount: 0, hardCount: 0, categoryList: [] })
const loading = ref(false)

const currentPage = ref(1)
const pageSize = ref(1000)
const totalPages = ref(1)
const totalCount = ref(0)
const searchKeyword = ref('')
const selectedDifficulty = ref('')
const selectedCategory = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addLoading = ref(false)
const editLoading = ref(false)
const newQuestion = ref({
  title: '',
  options: ['', '', '', ''],
  difficulty: '',
  category: '',
  answer: '',
  analysis: ''
})
const editQuestion = ref({
  id: 0,
  title: '',
  options: ['', '', '', ''],
  difficulty: '',
  category: '',
  answer: '',
  analysis: ''
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  return pages
})

const loadData = async (page: number = 1) => {
  loading.value = true
  currentPage.value = page
  try {
    const [questionRes, statRes] = await Promise.all([
      getQuestionList({ 
        page, 
        size: pageSize.value, 
        keyword: searchKeyword.value,
        difficulty: selectedDifficulty.value,
        category: selectedCategory.value
      }),
      getQuestionStatistics()
    ])

    if (questionRes.data.code === 200) {
      questions.value = questionRes.data.data.list.map((item: any) => {
        let options = ['A', 'B', 'C', 'D']
        if (item.questionContent) {
          try {
            const content = typeof item.questionContent === 'string' ? JSON.parse(item.questionContent) : item.questionContent
            if (content.option && typeof content.option === 'object') {
              const keys = ['A', 'B', 'C', 'D']
              options = keys.map(key => content.option[key] || key)
            }
          } catch (e) {
            console.error('解析选项失败:', e)
          }
        }
        return {
          id: item.id,
          title: item.title,
          difficulty: item.difficulty,
          difficultyText: item.difficultyText,
          category: item.category,
          categoryText: item.categoryText,
          passRate: item.passRate || 0,
          status: item.status,
          statusText: item.status === 'active' ? '已发布' : '草稿',
          showDropdown: false,
          content: item.content || '暂无题目内容',
          options: options,
          answer: item.answer,
          analysis: item.analysis
        }
      })
      totalCount.value = questionRes.data.data.total || 0
      totalPages.value = Math.ceil(totalCount.value / pageSize.value)
    }

    if (statRes.data.code === 200) {
      stats.value = statRes.data.data
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.response?.data?.msg || error.message || '获取数据失败'
    ElMessage.error(errMsg)
    console.error('获取题目数据失败:', error.response?.data || error)
  } finally {
    loading.value = false
  }
}

const openAddDialog = () => {
  newQuestion.value = {
    title: '',
    options: ['', '', '', ''],
    difficulty: '',
    category: '',
    answer: '',
    analysis: ''
  }
  showAddDialog.value = true
}

const handleAddQuestion = async () => {
  if (!newQuestion.value.title.trim()) {
    ElMessage.error('请输入题目标题')
    return
  }
  const hasEmptyOption = newQuestion.value.options.some(opt => !opt.trim())
  if (hasEmptyOption) {
    ElMessage.error('请填写所有选项内容')
    return
  }
  if (!newQuestion.value.difficulty) {
    ElMessage.error('请选择难度')
    return
  }
  if (!newQuestion.value.category) {
    ElMessage.error('请选择分类')
    return
  }
  if (!newQuestion.value.answer.trim()) {
    ElMessage.error('请输入正确答案')
    return
  }

  const content = JSON.stringify({
    option: {
      A: newQuestion.value.options[0],
      B: newQuestion.value.options[1],
      C: newQuestion.value.options[2],
      D: newQuestion.value.options[3]
    }
  })

  addLoading.value = true
  try {
    const res = await addQuestion({
      title: newQuestion.value.title,
      content: content,
      difficulty: newQuestion.value.difficulty,
      category: newQuestion.value.category,
      answer: newQuestion.value.answer,
      analysis: newQuestion.value.analysis || '',
      options: ['A', 'B', 'C', 'D']
    })
    if (res.data.code === 200) {
      ElMessage.success('添加成功')
      showAddDialog.value = false
      loadData(1)
    } else {
      ElMessage.error(res.data.message || '添加失败')
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || error.message || '添加失败')
  } finally {
    addLoading.value = false
  }
}

const toggleDropdown = (id: number) => {
  questions.value.forEach(q => {
    if (q.id === id) {
      q.showDropdown = !q.showDropdown
    } else {
      q.showDropdown = false
    }
  })
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    loadData(page)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    loadData(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    loadData(currentPage.value + 1)
  }
}

const openEditDialog = (question: Question) => {
  editQuestion.value = {
    id: question.id,
    title: question.title,
    options: question.options || ['', '', '', ''],
    difficulty: question.difficulty,
    category: question.category,
    answer: question.answer || '',
    analysis: question.analysis || ''
  }
  showEditDialog.value = true
}

const handleEditQuestion = async () => {
  if (!editQuestion.value.title.trim()) {
    ElMessage.error('请输入题目标题')
    return
  }
  const hasEmptyOption = editQuestion.value.options.some(opt => !opt.trim())
  if (hasEmptyOption) {
    ElMessage.error('请填写所有选项内容')
    return
  }
  if (!editQuestion.value.difficulty) {
    ElMessage.error('请选择难度')
    return
  }
  if (!editQuestion.value.category) {
    ElMessage.error('请选择分类')
    return
  }
  if (!editQuestion.value.answer.trim()) {
    ElMessage.error('请输入正确答案')
    return
  }

  const content = JSON.stringify({
    option: {
      A: editQuestion.value.options[0],
      B: editQuestion.value.options[1],
      C: editQuestion.value.options[2],
      D: editQuestion.value.options[3]
    }
  })

  editLoading.value = true
  try {
    const res = await updateQuestion(editQuestion.value.id, {
      title: editQuestion.value.title,
      content: content,
      difficulty: editQuestion.value.difficulty,
      category: editQuestion.value.category,
      answer: editQuestion.value.answer,
      analysis: editQuestion.value.analysis || '',
      options: ['A', 'B', 'C', 'D']
    })
    if (res.data.code === 200) {
      ElMessage.success('修改成功')
      showEditDialog.value = false
      loadData(currentPage.value)
    } else {
      ElMessage.error(res.data.message || '修改失败')
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || error.message || '修改失败')
  } finally {
    editLoading.value = false
  }
}

const handleDeleteQuestion = async (id: number) => {
  if (!confirm('确定要删除这道题目吗？')) {
    return
  }
  try {
    const res = await deleteQuestion(id)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      loadData(currentPage.value)
    } else {
      ElMessage.error(res.data.message || '删除失败')
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || error.message || '删除失败')
  }
}

onMounted(() => {
  loadData(1)
})
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

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s;
}

.search-btn:hover {
  color: var(--text-primary-color);
  background: rgba(37, 99, 235, 0.08);
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
  padding: 12px 20px;
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
  background: transparent;
}

.data-table td {
  padding: 12px 20px;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 40px;
  line-height: 1.5;
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
  border-color: var(--border-light);
  background: transparent;
  transform: none;
  color: var(--text-secondary);
}

.action-btn.edit:hover {
  border-color: var(--border-light);
  background: transparent;
  color: var(--text-secondary);
}

.action-btn.delete:hover {
  border-color: var(--border-light);
  background: transparent;
  color: var(--text-secondary);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.dropdown {
  position: relative;
}

.action-btn.view:hover {
  border-color: rgba(37, 99, 235, 0.3);
  background: rgba(37, 99, 235, 0.08);
  color: var(--primary);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  width: 480px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  box-shadow: var(--shadow-primary);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 8px;
}

.dropdown.active .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
  border-radius: 12px 12px 0 0;
}

.dropdown-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.dropdown-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-body::-webkit-scrollbar {
  width: 6px;
}

.dropdown-body::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 3px;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.dropdown-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-light);
  transition: all 0.3s;
}

.option-item.correct {
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.3);
}

.option-label {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}

.option-item.correct .option-label {
  background: var(--success);
  color: #ffffff;
}

.option-text {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.correct-badge {
  padding: 4px 10px;
  background: var(--success);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
}

.answer-badge {
  display: inline-block;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: rgba(74, 222, 128, 0.15);
  color: var(--success);
  font-size: 14px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
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
  border-color: var(--border-light);
  color: var(--text-secondary);
  background: transparent;
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
}

.dialog {
  background: var(--bg-card);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.dialog-header .close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
}

.dialog-header .close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.options-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.options-row:last-child {
  margin-bottom: 0;
}

.option-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-input-group .option-label {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.option-input {
  flex: 1;
}
</style>
