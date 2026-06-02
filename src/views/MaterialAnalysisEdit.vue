<template>
  <div class="material-analysis-edit">
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
            <h2>资料分析题编辑</h2>
            <span class="subtitle">编辑材料和小题内容</span>
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
        <!-- 材料信息 -->
        <div class="form-section">
          <h3 class="section-title">材料信息</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">来源</label>
              <input type="text" v-model="form.source" class="form-input" placeholder="请输入题目来源" />
            </div>
            <div class="form-group">
              <label class="form-label">年份</label>
              <input type="number" v-model="form.year" class="form-input" placeholder="请输入年份" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">材料标题</label>
            <input type="text" v-model="form.materialTitle" class="form-input" placeholder="请输入材料标题" />
          </div>

          <div class="form-group">
            <label class="form-label">材料内容</label>
            <textarea v-model="form.materialContent" class="form-textarea-large" placeholder="请输入材料内容（主题干）" rows="8"></textarea>
          </div>
        </div>

        <!-- 小题列表 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">小题列表</h3>
            <button class="btn-add-problem" @click="addProblem">
              <svg viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              添加小题
            </button>
          </div>

          <div class="problems-list">
            <div v-for="(problem, index) in form.problems" :key="problem.id || index" class="problem-card">
              <div class="problem-header">
                <span class="problem-number">第 {{ index + 1 }} 题</span>
                <div class="problem-actions">
                  <button 
                    v-if="form.problems.length > 1" 
                    class="action-btn move-up"
                    :disabled="index === 0"
                    @click="moveProblem(index, -1)"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <button 
                    v-if="form.problems.length > 1" 
                    class="action-btn move-down"
                    :disabled="index === form.problems.length - 1"
                    @click="moveProblem(index, 1)"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <button 
                    v-if="form.problems.length > 1" 
                    class="action-btn delete"
                    @click="removeProblem(index)"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="problem-body">
                <div class="form-group">
                  <label class="form-label">题目内容</label>
                  <textarea v-model="problem.questionText" class="form-textarea" placeholder="请输入小题内容" rows="3"></textarea>
                </div>

                <div class="options-grid">
                  <div class="option-item">
                    <span class="option-label">A</span>
                    <input type="text" v-model="problem.optionA" class="form-input" placeholder="请输入选项A" />
                  </div>
                  <div class="option-item">
                    <span class="option-label">B</span>
                    <input type="text" v-model="problem.optionB" class="form-input" placeholder="请输入选项B" />
                  </div>
                  <div class="option-item">
                    <span class="option-label">C</span>
                    <input type="text" v-model="problem.optionC" class="form-input" placeholder="请输入选项C" />
                  </div>
                  <div class="option-item">
                    <span class="option-label">D</span>
                    <input type="text" v-model="problem.optionD" class="form-input" placeholder="请输入选项D" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">正确答案</label>
                    <select v-model="problem.correctAnswer" class="form-select">
                      <option value="">请选择正确答案</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">难度</label>
                    <select v-model="problem.difficulty" class="form-select">
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">答案解析</label>
                  <textarea v-model="problem.analysis" class="form-textarea" placeholder="请输入答案解析" rows="3"></textarea>
                </div>
              </div>
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
import { ElMessage } from 'element-plus'
import { getMaterialAnalysisDetail, saveMaterialAnalysis } from '../api/material-analysis'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const saving = ref(false)

interface MaterialProblem {
  id: number | null
  questionId: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  correctAnswer: string
  analysis: string
  orderNum: number
  difficulty: string
}

const form = ref({
  materialId: null as number | null,
  materialTitle: '',
  materialContent: '',
  source: '',
  year: null as number | null,
  problems: [] as MaterialProblem[]
})

const addProblem = () => {
  form.value.problems.push({
    id: null,
    questionId: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    optionE: '',
    correctAnswer: '',
    analysis: '',
    orderNum: form.value.problems.length + 1,
    difficulty: 'medium'
  })
}

const removeProblem = (index: number) => {
  if (form.value.problems.length > 1) {
    form.value.problems.splice(index, 1)
    // 更新序号
    form.value.problems.forEach((p, i) => {
      p.orderNum = i + 1
    })
  }
}

const moveProblem = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < form.value.problems.length) {
    const temp = form.value.problems[index]
    const newProblem = form.value.problems[newIndex]
    if (temp && newProblem) {
      form.value.problems[index] = newProblem
      form.value.problems[newIndex] = temp
      // 更新序号
      form.value.problems.forEach((p, i) => {
        if (p) p.orderNum = i + 1
      })
    }
  }
}

const loadMaterialAnalysis = async () => {
  const materialId = route.query.materialId
  if (materialId) {
    loading.value = true
    try {
      const res = await getMaterialAnalysisDetail(Number(materialId))
      const detail = res.data
      form.value = {
        materialId: detail.materialId,
        materialTitle: detail.materialTitle || '',
        materialContent: detail.materialContent || '',
        source: detail.source || '',
        year: detail.year || null,
        problems: detail.problems ? detail.problems.map((p: any) => ({
          id: p.id,
          questionId: p.questionId || '',
          questionText: p.questionText || '',
          optionA: p.optionA || '',
          optionB: p.optionB || '',
          optionC: p.optionC || '',
          optionD: p.optionD || '',
          optionE: p.optionE || '',
          correctAnswer: p.correctAnswer || '',
          analysis: p.analysis || '',
          orderNum: p.orderNum,
          difficulty: p.difficulty || 'medium'
        })) : []
      }
    } catch (error) {
      console.error('加载资料分析题失败:', error)
      ElMessage.error('加载资料分析题失败')
    } finally {
      loading.value = false
    }
  }
  
  // 如果没有数据，初始化一个小题
  if (form.value.problems.length === 0) {
    addProblem()
  }
}

const handleSave = async () => {
  if (!form.value.materialContent.trim()) {
    ElMessage.warning('请输入材料内容')
    return
  }

  for (let i = 0; i < form.value.problems.length; i++) {
    const problem = form.value.problems[i]
    if (!problem) continue
    if (!problem.questionText.trim()) {
      ElMessage.warning(`第 ${i + 1} 题请输入题目内容`)
      return
    }
    if (!problem.correctAnswer) {
      ElMessage.warning(`第 ${i + 1} 题请选择正确答案`)
      return
    }
  }

  saving.value = true
  try {
    const params = {
      materialId: form.value.materialId,
      materialTitle: form.value.materialTitle,
      materialContent: form.value.materialContent,
      source: form.value.source,
      year: form.value.year,
      problems: form.value.problems
    }

    await saveMaterialAnalysis(params)
    ElMessage.success('保存成功')
    goBack()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
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
  loadMaterialAnalysis()
})
</script>

<style scoped lang="css">
.material-analysis-edit {
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

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.btn-add-problem {
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

.btn-add-problem:hover {
  background: rgba(37, 99, 235, 0.15);
  border-color: var(--primary);
}

.btn-add-problem svg {
  width: 16px;
  height: 16px;
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

.form-textarea-large {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: all 0.3s;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  line-height: 1.8;
}

.form-textarea:focus,
.form-textarea-large:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.problem-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
}

.problem-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(37, 99, 235, 0.05);
  border-bottom: 1px solid var(--border-light);
}

.problem-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.problem-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-btn:hover:not(:disabled) {
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-btn.delete:hover:not(:disabled) {
  background: rgba(245, 108, 108, 0.1);
  color: var(--danger);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.problem-body {
  padding: 20px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(37, 99, 235, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  min-width: 32px;
  text-align: center;
}

.option-item .form-input {
  flex: 1;
}
</style>
