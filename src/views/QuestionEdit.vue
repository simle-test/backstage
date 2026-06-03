<template>
  <div class="question-edit-container">
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
            <h2>{{ isEdit ? '编辑题目' : '添加题目' }}</h2>
            <span class="subtitle">{{ isEdit ? '修改题目内容' : '创建新题目' }}</span>
          </div>
        </div>
        <div class="header-right">
          <button class="btn-primary" @click="handleSave">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>

      <div class="form-container">
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">题目分类</label>
              <select v-model="form.category" class="form-select">
                <option value="">请选择分类</option>
                <option value="language_understanding">言语理解</option>
                <option value="quantity_relation">数量关系</option>
                <option value="material_analysis">资料分析</option>
                <option value="common_sense_judgment">常识判断</option>
                <option value="logical_judgment">判断推理</option>
                <option value="political_theory">政治理论</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">难度等级</label>
              <select v-model="form.difficulty" class="form-select">
                <option value="">请选择难度</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">题目内容</label>
            <textarea v-model="form.title" class="form-textarea" placeholder="请输入题目内容" rows="4"></textarea>
          </div>

          <div v-if="form.category === 'material_analysis' && form.imageUrl" class="form-group">
            <label class="form-label">题目图片</label>
            <div class="material-image-container">
              <img :src="form.imageUrl" alt="题目图片" class="material-image" />
            </div>
          </div>

          <div v-if="form.category === 'material_analysis' && form.materialImageUrl" class="form-group">
            <label class="form-label">材料图片</label>
            <div class="material-image-container">
              <img :src="form.materialImageUrl" alt="材料图片" class="material-image" />
              <div class="material-info">
                <p v-if="form.materialTitle" class="material-title">{{ form.materialTitle }}</p>
                <p v-if="form.materialContent" class="material-content">{{ form.materialContent }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">选项设置</h3>

          <div class="options-grid">
            <div v-for="(option, index) in form.options" :key="index" class="option-item">
              <div class="option-header">
                <span class="option-label">{{ getOptionLabel(index) }}</span>
                <button
                  v-if="form.options.length > 2"
                  class="option-remove"
                  @click="removeOption(index)"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <input
                type="text"
                v-model="form.options[index]"
                class="form-input"
                :placeholder="`请输入选项${getOptionLabel(index)}的内容`"
              />
            </div>
          </div>

          <button class="btn-add-option" @click="addOption" v-if="form.options.length < 6">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            添加选项
          </button>
        </div>

        <div class="form-section">
          <h3 class="section-title">答案与解析</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">正确答案</label>
              <select v-model="form.answer" class="form-select">
                <option value="">请选择正确答案</option>
                <option v-for="(_, index) in form.options" :key="index" :value="getOptionLabel(index)">
                  {{ getOptionLabel(index) }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">题目来源</label>
              <input type="text" v-model="form.source" class="form-input" placeholder="请输入题目来源" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">答案解析</label>
            <textarea v-model="form.analysis" class="form-textarea" placeholder="请输入答案解析" rows="4"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">其他信息</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">年份</label>
              <input type="number" v-model="form.year" class="form-input" placeholder="请输入年份" />
            </div>
            <div class="form-group">
              <label class="form-label">题目状态</label>
              <select v-model="form.status" class="form-select">
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addQuestion, updateQuestion, getQuestionDetail } from '@/api/question'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const saving = ref(false)
const isEdit = ref(false)

const form = ref({
  id: null as number | null,
  title: '',
  category: '',
  difficulty: '',
  options: ['', '', '', ''],
  answer: '',
  analysis: '',
  source: '',
  year: null as number | null,
  status: 'active',
  imageUrl: '',
  materialImageUrl: '',
  materialTitle: '',
  materialContent: ''
})

const getOptionLabel = (index: number): string => {
  return ['A', 'B', 'C', 'D', 'E', 'F'][index] || String.fromCharCode(65 + index)
}

const addOption = () => {
  if (form.value.options.length < 6) {
    form.value.options.push('')
  }
}

const removeOption = (index: number) => {
  if (form.value.options.length > 2) {
    form.value.options.splice(index, 1)
    if (form.value.answer === getOptionLabel(index)) {
      form.value.answer = ''
    }
  }
}

const loadQuestionDetail = async () => {
  const idParam = route.params.id
  if (idParam) {
    const id = typeof idParam === 'string' ? parseInt(idParam, 10) : idParam
    isEdit.value = true
    loading.value = true
    try {
      const res = await getQuestionDetail(id as number)
      if (res.data.code === 200) {
          const data = res.data.data
          form.value = {
            id: data.id,
            title: data.title || '',
            category: data.categoryId || data.category || '',
            difficulty: data.difficulty || '',
            options: parseOptions(data.questionContent) || ['', '', '', ''],
            answer: data.answer || '',
            analysis: data.analysis || '',
            source: data.source || '',
            year: data.year || null,
            status: data.status || 'active',
            imageUrl: data.imageUrl || '',
            materialImageUrl: data.materialImageUrl || '',
            materialTitle: data.materialTitle || '',
            materialContent: data.materialContent || ''
          }
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || '获取题目详情失败'
      ElMessage.error(errMsg)
    } finally {
      loading.value = false
    }
  }
}

const parseOptions = (questionContent: string): string[] | null => {
  if (!questionContent) return null
  try {
    const content = JSON.parse(questionContent)
    if (content.option) {
      return Object.values(content.option)
    }
  } catch {
    return null
  }
  return null
}

const handleSave = async () => {
  if (!form.value.title.trim()) {
    ElMessage.warning('请输入题目内容')
    return
  }
  if (!form.value.category) {
    ElMessage.warning('请选择题目分类')
    return
  }
  if (!form.value.difficulty) {
    ElMessage.warning('请选择难度等级')
    return
  }
  if (!form.value.answer) {
    ElMessage.warning('请选择正确答案')
    return
  }

  const validOptions = form.value.options.filter(opt => opt.trim())
  if (validOptions.length < 2) {
    ElMessage.warning('至少需要两个有效选项')
    return
  }

  saving.value = true
  try {
    const questionContent = {
      image: '',
      option: form.value.options.reduce((acc, opt, index) => {
        acc[getOptionLabel(index)] = opt
        return acc
      }, {} as Record<string, string>)
    }

    const params = {
      title: form.value.title,
      category: form.value.category,
      difficulty: form.value.difficulty,
      questionContent: JSON.stringify(questionContent),
      answer: form.value.answer,
      analysis: form.value.analysis,
      source: form.value.source,
      year: form.value.year,
      status: form.value.status
    }

    let res
    if (isEdit.value && form.value.id) {
      res = await updateQuestion(form.value.id, params)
    } else {
      res = await addQuestion(params)
    }

    if (res.data.code === 200) {
      ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
      goBack()
    } else {
      ElMessage.error(res.data.message || (isEdit.value ? '修改失败' : '添加失败'))
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || (isEdit.value ? '修改失败' : '添加失败')
    ElMessage.error(errMsg)
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  const bankId = route.query.bankId
  const categoryId = route.query.categoryId
  router.push({
    path: '/app/questions/list',
    query: { bankId, categoryId }
  })
}

onMounted(() => {
  loadQuestionDetail()
})
</script>

<style scoped lang="css">
.question-edit-container {
  width: 100%;
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
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
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(37, 99, 235, 0.08);
  border-color: var(--primary);
  color: var(--primary);
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.header-title h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  gap: 12px;
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

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.form-container {
  padding: 28px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: all 0.3s;
  box-sizing: border-box;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: all 0.3s;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(37, 99, 235, 0.1);
  padding: 4px 12px;
  border-radius: 6px;
}

.option-remove {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.option-remove:hover {
  background: rgba(245, 108, 108, 0.1);
  color: var(--danger);
}

.option-remove svg {
  width: 14px;
  height: 14px;
}

.btn-add-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--primary);
  background: rgba(37, 99, 235, 0.08);
  border: 1px dashed var(--border-color);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-option:hover {
  background: rgba(37, 99, 235, 0.15);
  border-color: var(--primary);
}

.btn-add-option svg {
  width: 16px;
  height: 16px;
}

.material-image-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
}

.material-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.material-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.material-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}
</style>
