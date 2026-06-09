<template>
  <div class="batch-import">
    <!-- 顶部标题栏 -->
    <div class="import-header">
      <div class="header-left">
        <h1>批量导入题目</h1>
        <p class="subtitle">支持批量导入试题，智能识别并结构化题目内容</p>
      </div>
      <div class="header-right">
        <button class="btn-secondary" @click="showImportRecords">
          <span class="icon">📋</span>
          导入记录
        </button>
        <button class="btn-secondary" @click="showHelp">
          <span class="icon">❓</span>
          使用帮助
        </button>
      </div>
    </div>

    <!-- 步骤导航 -->
    <div class="steps-container">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        :class="['step-item', { active: currentStep === index, completed: currentStep > index }]"
      >
        <span class="step-number">{{ index + 1 }}</span>
        <span class="step-label">{{ step }}</span>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧内容区 -->
      <div class="left-panel">
        <!-- 文件上传区域 -->
        <div class="section">
          <h2 class="section-title">上传文件</h2>
          
          <!-- 合并的文件上传区域 -->
          <div class="file-upload-wrapper">
            <div class="file-upload-label">
              <span class="required">*</span>
              <span>题目文件</span>
              <span class="optional-label">（支持多文件，不填答案文件时默认所有文件均为题目）</span>
            </div>
            
            <!-- 主上传区域 -->
            <div 
              :class="['upload-area', 'main-upload', { dragging: isDraggingQuestion, 'has-file': uploadFiles.length > 0 }]" 
              @drop.prevent="handleDrop($event, 'question')" 
              @dragover.prevent="isDraggingQuestion = true" 
              @dragleave="isDraggingQuestion = false"
              @click="triggerFileInput('question')"
            >
              <template v-if="uploadFiles.length === 0">
                <div class="upload-icon-large">📂</div>
                <p class="upload-main-text">拖拽文件到这里，或点击上传</p>
                <p class="upload-hint">支持格式：Word(.docx)、TXT（可多选）</p>
              </template>
              <template v-else>
                <div class="files-grid">
                  <div v-for="(file, index) in uploadFiles" :key="index" class="file-card">
                    <div class="file-card-icon">📄</div>
                    <div class="file-card-info">
                      <span class="file-card-name">{{ file.name }}</span>
                      <span class="file-card-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                    <button class="file-card-remove" @click.stop="removeUploadFile(index)">×</button>
                  </div>
                  <div class="add-more-card" @click.stop="triggerFileInput('question')">
                    <span class="add-icon">+</span>
                    <span class="add-text">添加更多</span>
                  </div>
                </div>
              </template>
            </div>
            <input ref="questionFileInput" type="file" class="file-input" accept=".docx,.txt" multiple @change="handleFileSelect($event, 'question')" />
          </div>

          <!-- AI文件关系说明 -->
          <div class="ai-file-tip">
            <div class="ai-file-icon">🤖</div>
            <div class="ai-file-content">
              <h4>文件说明</h4>
              <ul>
                <li><strong>单文件上传：</strong>全部内容作为题目文件解析</li>
                <li><strong>多文件上传：</strong>第一个文件为题目，其余为答案/解析文件</li>
                <li><strong>答案文件格式：</strong>答案行 + 解析行（可选）</li>
                <li><strong>示例：</strong><code>1. A</code> 或 <code>1. A 解析：选A是因为...</code></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 导入设置 -->
        <div class="section settings-section">
          <h3 class="section-subtitle">导入设置</h3>
          <div class="settings-grid">
            <div class="setting-item">
              <label>题目分类</label>
              <select v-model="settings.category" class="form-select">
                <option value="">请选择分类</option>
                <option value="political_theory">政治理论</option>
                <option value="quantity_relation">数量关系</option>
                <option value="material_analysis">资料分析</option>
                <option value="common_sense_judgment">常识判断</option>
                <option value="logical_judgment">判断推理</option>
                <option value="language_understanding">言语理解</option>
              </select>
            </div>
            <div class="setting-item">
              <label>解析方式</label>
              <div class="radio-group">
                <label :class="['radio-option', { active: settings.parseMethod === 'rule' }]">
                  <input type="radio" v-model="settings.parseMethod" value="rule" />
                  <span>规则解析</span>
                </label>
                <label :class="['radio-option', { active: settings.parseMethod === 'ai' }]">
                  <input type="radio" v-model="settings.parseMethod" value="ai" />
                  <span>AI智能解析</span>
                </label>
              </div>
            </div>
            <div class="setting-item full-width">
              <label>去重方式</label>
              <div class="radio-group">
                <label :class="['radio-option', { active: settings.dedup === 'skip' }]">
                  <input type="radio" v-model="settings.dedup" value="skip" />
                  <span>跳过重复</span>
                </label>
                <label :class="['radio-option', { active: settings.dedup === 'override' }]">
                  <input type="radio" v-model="settings.dedup" value="override" />
                  <span>覆盖重复</span>
                </label>
                <label :class="['radio-option', { active: settings.dedup === 'all' }]">
                  <input type="radio" v-model="settings.dedup" value="all" />
                  <span>全部导入</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- AI解析说明 -->
          <div v-if="settings.parseMethod === 'ai'" class="ai-tip">
            <div class="ai-icon">🤖</div>
            <div class="ai-text">
              <strong>AI智能解析</strong>
              <p>利用AI技术智能识别题目内容，支持更复杂的文档格式，自动区分材料数据与题目</p>
            </div>
          </div>
        </div>

        <!-- 导入说明 -->
        <div class="section">
          <h3 class="section-subtitle">导入说明</h3>
          <ul class="import-tips">
            <li>• 文档中的每道题目将被自动识别并拆分</li>
            <li>• 支持识别单选题、多选题、判断题、填空题、解答题</li>
            <li>• 题目和答案建议分两个文件上传，系统会自动匹配</li>
            <li>• 题目文档格式示例：<code>1. 单选题：题干内容...</code></li>
            <li>• 答案文档格式示例：<code>1. A</code> 或 <code>答案1：B</code></li>
          </ul>
        </div>

        <!-- 开始导入按钮 -->
        <div class="next-step">
          <button 
            class="btn-primary large" 
            @click="startImport"
            :disabled="uploadFiles.length === 0 || loading"
          >
            {{ loading ? '正在解析...' : '开始导入' }}
          </button>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="right-panel">
        <div class="preview-card">
          <h3 class="preview-title">{{ previewTitle }}</h3>
          
          <!-- 空状态 -->
          <template v-if="!previewData">
            <div class="empty-state">
              <div class="empty-icon">📋</div>
              <p>上传文件后将显示预览</p>
              <p class="empty-hint">系统将自动识别题目内容</p>
            </div>
          </template>
          
          <!-- 预览数据 -->
          <template v-else>
            <!-- 识别统计 -->
            <div class="stats-section">
              <h4 class="stats-title">识别统计</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-value">{{ previewData.statistics?.total || 0 }}</span>
                  <span class="stat-label">题目总数</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ previewData.statistics?.singleChoice || 0 }}</span>
                  <span class="stat-label">单选题</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ previewData.statistics?.multipleChoice || 0 }}</span>
                  <span class="stat-label">多选题</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ previewData.statistics?.fillBlank || 0 }}</span>
                  <span class="stat-label">填空题</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ previewData.statistics?.trueFalse || 0 }}</span>
                  <span class="stat-label">判断题</span>
                </div>
              </div>
            </div>

            <!-- 内容预览 -->
            <div class="content-preview">
              <div class="preview-header">
                <h4>内容预览</h4>
                <span v-if="previewData.parseMethod === 'ai'" class="ai-badge">
                  🤖 AI解析
                </span>
                <button 
                  v-if="(previewData.questions && previewData.questions.length > 5) || (previewData.materialQuestions && previewData.materialQuestions.length > 0)"
                  class="view-all-btn"
                  @click="showAllQuestions = true"
                >
                  查看全部
                </button>
              </div>
              <div class="preview-list">
                <!-- 资料分析大题 -->
                <template v-if="previewData.materialQuestions && previewData.materialQuestions.length > 0">
                  <div v-for="(material, mIndex) in previewData.materialQuestions" :key="'material-' + mIndex" class="material-question">
                    <div class="material-header">
                      <span class="material-tag">📊 资料分析大题</span>
                      <span class="material-number">第{{ material.orderNum }}组</span>
                      <span class="material-count">（{{ material.subQuestions?.length || 0 }}小题）</span>
                    </div>
                    <!-- 材料内容 -->
                    <div class="material-content">
                      <div class="material-label">📋 材料：</div>
                      <p class="material-text">{{ material.material }}</p>
                    </div>
                    <!-- 子题目 -->
                    <div class="sub-questions">
                      <div v-for="(item, index) in material.subQuestions?.slice(0, 2)" :key="'sub-' + mIndex + '-' + index" class="preview-item sub-item">
                        <div class="item-header">
                          <span :class="['item-tag', getTypeClass(item.type)]">{{ getTypeName(item.type) }}</span>
                          <span class="item-number">第{{ item.orderNum }}题</span>
                          <span v-if="item.category" class="item-category">{{ item.category }}</span>
                          <span v-if="item.difficulty" :class="['difficulty-tag', getDifficultyClass(item.difficulty)]">
                            {{ getDifficultyName(item.difficulty) }}
                          </span>
                        </div>
                        <div class="item-content">
                          <p class="question-title">{{ item.title }}</p>
                          <div v-if="item.options && item.options.length > 0" class="item-options">
                            <div v-for="(opt, idx) in item.options" :key="idx" class="option-item">
                              <span class="option-label">{{ opt.charAt(0) }}.</span>
                              <span class="option-text">{{ opt.substring(2) }}</span>
                            </div>
                          </div>
                          <div v-if="item.correctAnswer" class="item-answer">
                            <span class="answer-label">✓ 答案：</span>
                            <span class="answer-value">{{ item.correctAnswer }}</span>
                          </div>
                          <div v-if="item.analysis" class="item-analysis">
                            <span class="analysis-label">💡 解析：</span>
                            <span class="analysis-text">{{ item.analysis }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="material.subQuestions && material.subQuestions.length > 2" class="more-sub">
                        ... 还有 {{ material.subQuestions.length - 2 }} 道小题（点击查看全部）
                      </div>
                    </div>
                  </div>
                </template>
                
                <!-- 普通题目 -->
                <div v-for="(item, index) in previewData.questions?.slice(0, 5)" :key="'normal-' + index" class="preview-item">
                  <div class="item-header">
                    <span :class="['item-tag', getTypeClass(item.type)]">{{ getTypeName(item.type) }}</span>
                    <span class="item-number">第{{ item.orderNum }}题</span>
                    <span v-if="item.category" class="item-category">{{ item.category }}</span>
                    <span v-if="item.difficulty" :class="['difficulty-tag', getDifficultyClass(item.difficulty)]">
                      {{ getDifficultyName(item.difficulty) }}
                    </span>
                  </div>
                  <div class="item-content">
                    <p class="question-title">{{ item.title }}</p>
                    <div v-if="item.options && item.options.length > 0" class="item-options">
                      <div v-for="(opt, idx) in item.options" :key="idx" class="option-item">
                        <span class="option-label">{{ opt.charAt(0) }}.</span>
                        <span class="option-text">{{ opt.substring(2) }}</span>
                      </div>
                    </div>
                    <div v-if="item.correctAnswer" class="item-answer">
                      <span class="answer-label">✓ 答案：</span>
                      <span class="answer-value">{{ item.correctAnswer }}</span>
                    </div>
                    <div v-if="item.analysis" class="item-analysis">
                      <span class="analysis-label">💡 解析：</span>
                      <span class="analysis-text">{{ item.analysis }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 温馨提示 -->
            <div class="tips-box">
              <div class="tips-icon">💡</div>
              <p>如识别不准确，可在下一步进行手动校对和编辑</p>
            </div>

            <!-- 进入校对按钮 -->
            <div class="confirm-import">
              <button class="btn-primary" @click="goToProofread">
                进入校对
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 步骤2：校对题目 -->
  <div v-if="currentStep === 2" class="step-content">
    <div class="proofread-header">
      <h3>题目校对</h3>
      <p class="proofread-count">共 {{ totalQuestionCount }} 道题目需要校对</p>
      <div class="proofread-actions">
        <button class="btn-secondary" @click="addQuestion">+ 添加题目</button>
        <button class="btn-secondary" @click="clearAllErrors">清除所有错误标记</button>
      </div>
    </div>

    <!-- 校对标签页 -->
    <div class="proofread-tabs">
      <button 
        :class="['tab-btn', { active: proofreadTab === 'all' }]" 
        @click="proofreadTab = 'all'"
      >
        全部 ({{ totalQuestionCount }})
      </button>
      <button 
        :class="['tab-btn', { active: proofreadTab === 'error' }]" 
        @click="proofreadTab = 'error'"
      >
        有错误 ({{ errorCount }})
      </button>
      <button 
        :class="['tab-btn', { active: proofreadTab === 'material' }]" 
        @click="proofreadTab = 'material'"
      >
        资料分析大题 ({{ materialQuestionCount }})
      </button>
    </div>

    <!-- 校对列表 -->
    <div class="proofread-list">
      <!-- 资料分析大题校对 -->
      <template v-if="proofreadTab === 'all' || proofreadTab === 'material'">
        <div 
          v-for="(material, mIndex) in editableData.materialQuestions" 
          :key="'material-proofread-' + mIndex" 
          class="proofread-material-item"
        >
          <div class="material-header">
            <span class="material-tag">📊 资料分析大题</span>
            <span class="material-number">第{{ material.orderNum }}组</span>
            <span class="material-count">（{{ material.subQuestions?.length || 0 }}小题）</span>
            <div class="material-actions">
              <button class="action-btn" @click="removeMaterial(mIndex)">删除</button>
            </div>
          </div>
          
          <!-- 可编辑材料内容 -->
          <div class="proofread-section">
            <label class="proofread-label">📋 材料内容</label>
            <textarea 
              v-model="material.material" 
              class="proofread-textarea"
              placeholder="请输入材料内容"
            ></textarea>
          </div>

          <!-- 子题目 -->
          <div class="sub-questions">
            <div 
              v-for="(item, sIndex) in material.subQuestions" 
              :key="'sub-proofread-' + mIndex + '-' + sIndex" 
              :class="['proofread-item', { 'has-error': item.hasError }]"
            >
              <div class="item-header">
                <span :class="['item-tag', getTypeClass(item.type)]">{{ getTypeName(item.type) }}</span>
                <span class="item-number">第{{ item.orderNum }}题</span>
                <span v-if="item.category" class="item-category">{{ item.category }}</span>
                <span v-if="item.difficulty" :class="['difficulty-tag', getDifficultyClass(item.difficulty)]">
                  {{ getDifficultyName(item.difficulty) }}
                </span>
                <span v-if="item.hasError" class="error-badge">⚠ 有错误</span>
                <div class="item-actions">
                  <button class="action-btn" @click="addSubQuestion(mIndex, sIndex)">+ 添加小题</button>
                  <button class="action-btn" @click="removeSubQuestion(mIndex, sIndex)">删除</button>
                  <button class="action-btn" @click="markError(item)">标记错误</button>
                </div>
              </div>

              <div class="proofread-section">
                <label class="proofread-label">题目内容</label>
                <textarea 
                  v-model="item.title" 
                  class="proofread-textarea"
                  placeholder="请输入题目内容"
                ></textarea>
              </div>

              <div class="proofread-section">
                <label class="proofread-label">选项（每行一个选项，格式：A. 选项内容）</label>
                <textarea 
                  v-model="item.optionsText" 
                  class="proofread-textarea options-textarea"
                  placeholder="A. 选项内容&#10;B. 选项内容&#10;C. 选项内容&#10;D. 选项内容"
                  @blur="parseOptions(item)"
                ></textarea>
              </div>

              <div class="proofread-row">
                <div class="proofread-section half">
                  <label class="proofread-label">正确答案</label>
                  <input 
                    v-model="item.correctAnswer" 
                    type="text" 
                    class="proofread-input"
                    placeholder="如：A、AB、ABCD"
                  />
                </div>
                <div class="proofread-section half">
                  <label class="proofread-label">题型</label>
                  <select v-model="item.type" class="proofread-select">
                    <option value="single_choice">单选题</option>
                    <option value="multiple_choice">多选题</option>
                    <option value="fill_blank">填空题</option>
                    <option value="true_false">判断题</option>
                    <option value="essay">简答题</option>
                  </select>
                </div>
              </div>

              <div class="proofread-section">
                <label class="proofread-label">解析</label>
                <textarea 
                  v-model="item.analysis" 
                  class="proofread-textarea"
                  placeholder="请输入题目解析（可选）"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 普通题目校对 -->
      <div 
        v-for="(item, index) in filteredQuestions" 
        :key="'normal-proofread-' + index" 
        :class="['proofread-item', { 'has-error': item.hasError }]"
      >
        <div class="item-header">
          <span :class="['item-tag', getTypeClass(item.type)]">{{ getTypeName(item.type) }}</span>
          <span class="item-number">第{{ item.orderNum }}题</span>
          <span v-if="item.category" class="item-category">{{ item.category }}</span>
          <span v-if="item.difficulty" :class="['difficulty-tag', getDifficultyClass(item.difficulty)]">
            {{ getDifficultyName(item.difficulty) }}
          </span>
          <span v-if="item.hasError" class="error-badge">⚠ 有错误</span>
          <div class="item-actions">
            <button class="action-btn" @click="addQuestionAfter(index)">+ 在后面添加</button>
            <button class="action-btn" @click="removeQuestion(index)">删除</button>
            <button class="action-btn" @click="markError(item)">标记错误</button>
          </div>
        </div>

        <div class="proofread-section">
          <label class="proofread-label">题目内容</label>
          <textarea 
            v-model="item.title" 
            class="proofread-textarea"
            placeholder="请输入题目内容"
          ></textarea>
        </div>

        <div class="proofread-section">
          <label class="proofread-label">选项（每行一个选项，格式：A. 选项内容）</label>
          <textarea 
            v-model="item.optionsText" 
            class="proofread-textarea options-textarea"
            placeholder="A. 选项内容&#10;B. 选项内容&#10;C. 选项内容&#10;D. 选项内容"
            @blur="parseOptions(item)"
          ></textarea>
        </div>

        <div class="proofread-row">
          <div class="proofread-section half">
            <label class="proofread-label">正确答案</label>
            <input 
              v-model="item.correctAnswer" 
              type="text" 
              class="proofread-input"
              placeholder="如：A、AB、ABCD"
            />
          </div>
          <div class="proofread-section half">
            <label class="proofread-label">题型</label>
            <select v-model="item.type" class="proofread-select">
              <option value="single_choice">单选题</option>
              <option value="multiple_choice">多选题</option>
              <option value="fill_blank">填空题</option>
              <option value="true_false">判断题</option>
              <option value="essay">简答题</option>
            </select>
          </div>
        </div>

        <div class="proofread-section">
          <label class="proofread-label">解析</label>
          <textarea 
            v-model="item.analysis" 
            class="proofread-textarea"
            placeholder="请输入题目解析（可选）"
          ></textarea>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredQuestions.length === 0 && (!editableData.materialQuestions || editableData.materialQuestions.length === 0)" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>暂无题目</p>
      </div>
    </div>

    <!-- 校对操作栏 -->
    <div class="proofread-footer">
      <button class="btn-secondary" @click="currentStep--">返回预览</button>
      <button class="btn-primary" @click="confirmImport">确认导入</button>
    </div>
  </div>

  <!-- 查看全部题目模态框 -->
  <div v-if="showAllQuestions" class="modal-overlay" @click.self="showAllQuestions = false">
    <div class="modal-content">
      <div class="modal-header">
        <h3>全部题目（共{{ totalPreviewCount }}题）</h3>
        <button class="modal-close" @click="showAllQuestions = false">×</button>
      </div>
      <div class="modal-body">
        <div class="all-questions-list">
          <!-- 资料分析大题 -->
          <template v-if="previewData.materialQuestions && previewData.materialQuestions.length > 0">
            <div v-for="(material, mIndex) in previewData.materialQuestions" :key="'material-all-' + mIndex" class="material-question">
              <div class="material-header">
                <span class="material-tag">📊 资料分析大题</span>
                <span class="material-number">第{{ material.orderNum }}组</span>
                <span class="material-count">（{{ material.subQuestions?.length || 0 }}小题）</span>
              </div>
              <div class="material-content">
                <div class="material-label">📋 材料：</div>
                <p class="material-text">{{ material.material }}</p>
              </div>
              <div class="sub-questions">
                <div v-for="(item, index) in material.subQuestions" :key="'sub-all-' + mIndex + '-' + index" class="preview-item sub-item">
                  <div class="item-header">
                    <span :class="['item-tag', getTypeClass(item.type)]">{{ getTypeName(item.type) }}</span>
                    <span class="item-number">第{{ item.orderNum }}题</span>
                    <span v-if="item.category" class="item-category">{{ item.category }}</span>
                    <span v-if="item.difficulty" :class="['difficulty-tag', getDifficultyClass(item.difficulty)]">
                      {{ getDifficultyName(item.difficulty) }}
                    </span>
                  </div>
                  <div class="item-content">
                    <p class="question-title">{{ item.title }}</p>
                    <div v-if="item.options && item.options.length > 0" class="item-options">
                      <div v-for="(opt, idx) in item.options" :key="idx" class="option-item">
                        <span class="option-label">{{ opt.charAt(0) }}.</span>
                        <span class="option-text">{{ opt.substring(2) }}</span>
                      </div>
                    </div>
                    <div v-if="item.correctAnswer" class="item-answer">
                      <span class="answer-label">✓ 答案：</span>
                      <span class="answer-value">{{ item.correctAnswer }}</span>
                    </div>
                    <div v-if="item.analysis" class="item-analysis">
                      <span class="analysis-label">💡 解析：</span>
                      <span class="analysis-text">{{ item.analysis }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- 普通题目 -->
          <div v-for="(item, index) in previewData.questions" :key="'normal-all-' + index" class="preview-item">
            <div class="item-header">
              <span :class="['item-tag', getTypeClass(item.type)]">{{ getTypeName(item.type) }}</span>
              <span class="item-number">第{{ item.orderNum }}题</span>
              <span v-if="item.category" class="item-category">{{ item.category }}</span>
              <span v-if="item.difficulty" :class="['difficulty-tag', getDifficultyClass(item.difficulty)]">
                {{ getDifficultyName(item.difficulty) }}
              </span>
            </div>
            <div class="item-content">
              <p class="question-title">{{ item.title }}</p>
              <div v-if="item.options && item.options.length > 0" class="item-options">
                <div v-for="(opt, idx) in item.options" :key="idx" class="option-item">
                  <span class="option-label">{{ opt.charAt(0) }}.</span>
                  <span class="option-text">{{ opt.substring(2) }}</span>
                </div>
              </div>
              <div v-if="item.correctAnswer" class="item-answer">
                <span class="answer-label">✓ 答案：</span>
                <span class="answer-value">{{ item.correctAnswer }}</span>
              </div>
              <div v-if="item.analysis" class="item-analysis">
                <span class="analysis-label">💡 解析：</span>
                <span class="analysis-text">{{ item.analysis }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="showAllQuestions = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { batchImportPreview } from '@/api/question'

interface ParsedQuestion {
  title: string
  options: string[]
  optionsText: string
  type: string
  difficulty?: string
  category?: string
  correctAnswer?: string
  analysis?: string
  hasError: boolean
  orderNum: number
}

interface MaterialQuestion {
  material: string
  subQuestions: ParsedQuestion[]
  category?: string
  orderNum: number
}

const steps = ['上传文件', '识别与预览', '题目校对', '完成导入']
const currentStep = ref(0)
const loading = ref(false)
const questionFile = ref<File | null>(null)
const answerFile = ref<File | null>(null)
const isDraggingQuestion = ref(false)
const isDraggingAnswer = ref(false)
const questionFileInput = ref<HTMLInputElement | null>(null)
const answerFileInput = ref<HTMLInputElement | null>(null)
const previewData = ref<any>(null)
const showAllQuestions = ref(false)
const uploadFiles = ref<File[]>([])

// 用于取消未完成的fetch请求
const abortController = ref<AbortController | null>(null)

// 校对相关状态
const editableData = reactive<{
  questions: ParsedQuestion[]
  materialQuestions: MaterialQuestion[]
}>({
  questions: [],
  materialQuestions: []
})
const proofreadTab = ref('all')

const settings = reactive({
  category: '',
  dedup: 'skip',
  parseMethod: 'ai' // 'rule' | 'ai'
})

// 计算属性：总题目数
const totalQuestionCount = computed(() => {
  const normalCount = editableData.questions?.length || 0
  const materialCount = editableData.materialQuestions?.reduce((acc: number, mq: any) => {
    return acc + (mq.subQuestions?.length || 0)
  }, 0) || 0
  return normalCount + materialCount
})

// 计算属性：资料分析大题数
const materialQuestionCount = computed(() => {
  return editableData.materialQuestions?.length || 0
})

// 计算属性：错误题目数
const errorCount = computed(() => {
  let count = 0
  // 普通题目
  editableData.questions?.forEach((item: any) => {
    if (item.hasError) count++
  })
  // 资料分析大题的子题目
  editableData.materialQuestions?.forEach((mq: any) => {
    mq.subQuestions?.forEach((item: any) => {
      if (item.hasError) count++
    })
  })
  return count
})

// 计算属性：过滤后的题目列表
const filteredQuestions = computed(() => {
  if (proofreadTab.value === 'error') {
    return editableData.questions?.filter((item: any) => item.hasError) || []
  }
  return editableData.questions || []
})

// 计算属性：预览数据的题目总数
const totalPreviewCount = computed(() => {
  const normalCount = previewData.value?.questions?.length || 0
  const materialCount = previewData.value?.materialQuestions?.reduce((acc: number, mq: any) => {
    return acc + (mq.subQuestions?.length || 0)
  }, 0) || 0
  return normalCount + materialCount
})

const previewTitle = computed(() => {
  return previewData.value ? '导入预览' : '导入预览'
})

// 触发文件选择
const triggerFileInput = (type: string) => {
  if (type === 'question') {
    questionFileInput.value?.click()
  } else {
    answerFileInput.value?.click()
  }
}

// 处理文件选择（支持多文件）
const handleFileSelect = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    const validTypes = ['.docx', '.txt']
    const validFiles = files.filter(file => {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
      return validTypes.includes(fileExt)
    })
    
    if (validFiles.length > 0) {
      if (type === 'question') {
        uploadFiles.value = [...uploadFiles.value, ...validFiles]
      } else {
        answerFile.value = validFiles[0] as File
      }
      ElMessage.success(`成功添加 ${validFiles.length} 个文件`)
    } else {
      ElMessage.warning('只支持 Word(.docx) 和 TXT 格式文件')
    }
  }
  // 清空input以支持重复选择同一文件
  target.value = ''
}

// 处理拖拽（支持多文件）
const handleDrop = (event: DragEvent, type: string) => {
  if (type === 'question') {
    isDraggingQuestion.value = false
  } else {
    isDraggingAnswer.value = false
  }
  
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    const validTypes = ['.docx', '.txt']
    const validFiles = files.filter(file => {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
      return validTypes.includes(fileExt)
    })
    
    if (validFiles.length > 0) {
      if (type === 'question') {
        uploadFiles.value = [...uploadFiles.value, ...validFiles]
        ElMessage.success(`成功添加 ${validFiles.length} 个文件`)
      } else {
        answerFile.value = validFiles[0] as File
      }
    } else {
      ElMessage.warning('只支持 Word(.docx) 和 TXT 格式文件')
    }
  }
}

// 移除单个上传文件
const removeUploadFile = (index: number) => {
  uploadFiles.value.splice(index, 1)
}

// 移除文件
const removeFile = (type: string) => {
  if (type === 'question') {
    uploadFiles.value = []
    if (questionFileInput.value) {
      questionFileInput.value.value = ''
    }
  } else {
    answerFile.value = null
    if (answerFileInput.value) {
      answerFileInput.value.value = ''
    }
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 开始导入（预览）
const startImport = async () => {
  if (uploadFiles.value.length === 0) {
    ElMessage.warning('请上传题目文件')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    
    // 第一个文件作为题目文件
    formData.append('questionFile', uploadFiles.value[0] as File)
    
    // 后续文件作为答案/解析文件（如果有）
    if (uploadFiles.value.length > 1) {
      for (let i = 1; i < uploadFiles.value.length; i++) {
        formData.append('answerFile', uploadFiles.value[i] as File)
      }
    }
    
    if (settings.category) {
      formData.append('category', settings.category)
    }

    // 根据解析方式选择接口
    const apiUrl = settings.parseMethod === 'ai' 
      ? '/api/questions/batch-import/preview-ai' 
      : '/api/questions/batch-import/preview'
    
    // 创建新的AbortController，取消之前的请求
    abortController.value?.abort()
    abortController.value = new AbortController()
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      signal: abortController.value.signal
    })
    
    const data = await response.json()
    
    if (data.code === 200) {
      previewData.value = data.data
      currentStep.value = 1
      ElMessage.success(data.message || '解析成功')
    } else {
      ElMessage.error(data.message || '解析失败')
    }
  } catch (error: any) {
    console.error('解析失败:', error)
    const errMsg = error.response?.data?.message || error.message || '解析失败'
    ElMessage.error(errMsg)
  } finally {
    loading.value = false
  }
}

// 确认导入
const confirmImport = async () => {
  // 收集所有题目数据
  const allQuestions: any[] = []
  
  // 添加普通题目
  editableData.questions?.forEach((q: any) => {
    allQuestions.push({
      title: q.title,
      options: q.options,
      type: q.type,
      difficulty: q.difficulty,
      category: q.category,
      correctAnswer: q.correctAnswer,
      analysis: q.analysis
    })
  })
  
  // 添加资料分析大题的子题目
  editableData.materialQuestions?.forEach((mq: any) => {
    mq.subQuestions?.forEach((q: any) => {
      allQuestions.push({
        title: q.title,
        options: q.options,
        type: q.type,
        difficulty: q.difficulty,
        category: mq.category || '资料分析',
        correctAnswer: q.correctAnswer,
        analysis: q.analysis,
        material: mq.material // 关联材料
      })
    })
  })
  
  console.log('准备导入的题目数据:', allQuestions)
  ElMessage.success(`即将导入 ${allQuestions.length} 道题目`)
}

// 进入校对
const goToProofread = () => {
  console.log('进入校对，previewData:', previewData.value)
  
  // 深拷贝预览数据到可编辑数据
  editableData.questions = JSON.parse(JSON.stringify(previewData.value?.questions || []))
  editableData.materialQuestions = JSON.parse(JSON.stringify(previewData.value?.materialQuestions || []))
  
  // 为每个题目添加 optionsText 属性，并检查答案和解析
  let answerCount = 0
  let analysisCount = 0
  editableData.questions?.forEach((q: any) => {
    q.optionsText = q.options?.join('\n') || ''
    q.hasError = false
    if (q.correctAnswer) answerCount++
    if (q.analysis) analysisCount++
  })
  
  console.log(`普通题目: ${editableData.questions?.length || 0} 道, 有答案: ${answerCount} 道, 有解析: ${analysisCount} 道`)
  
  // 为资料分析大题的子题目添加 optionsText 属性
  editableData.materialQuestions?.forEach((mq: any, mIndex: number) => {
    let subAnswerCount = 0
    let subAnalysisCount = 0
    mq.subQuestions?.forEach((q: any) => {
      q.optionsText = q.options?.join('\n') || ''
      q.hasError = false
      if (q.correctAnswer) subAnswerCount++
      if (q.analysis) subAnalysisCount++
    })
    console.log(`材料大题 ${mIndex + 1}: ${mq.subQuestions?.length || 0} 道小题, 有答案: ${subAnswerCount} 道, 有解析: ${subAnalysisCount} 道`)
  })
  
  currentStep.value = 2
}

// 解析选项文本
const parseOptions = (item: any) => {
  if (item.optionsText) {
    const lines = item.optionsText.split('\n').filter((line: string) => line.trim())
    item.options = lines.map((line: string) => line.trim())
  }
}

// 标记错误
const markError = (item: any) => {
  item.hasError = !item.hasError
  if (item.hasError) {
    ElMessage.warning('已标记为有错误')
  } else {
    ElMessage.success('已取消错误标记')
  }
}

// 清除所有错误标记
const clearAllErrors = () => {
  editableData.questions?.forEach((q: any) => {
    q.hasError = false
  })
  editableData.materialQuestions?.forEach((mq: any) => {
    mq.subQuestions?.forEach((q: any) => {
      q.hasError = false
    })
  })
  ElMessage.success('已清除所有错误标记')
}

// 添加新题目
const addQuestion = () => {
  const newQuestion = {
    title: '',
    options: [],
    optionsText: '',
    type: 'single_choice',
    difficulty: 'medium',
    category: '',
    correctAnswer: '',
    analysis: '',
    hasError: false,
    orderNum: (editableData.questions?.length || 0) + 1
  }
  editableData.questions?.push(newQuestion)
  ElMessage.success('已添加新题目')
}

// 在指定位置后添加题目
const addQuestionAfter = (index: number) => {
  const newQuestion = {
    title: '',
    options: [],
    optionsText: '',
    type: 'single_choice',
    difficulty: 'medium',
    category: '',
    correctAnswer: '',
    analysis: '',
    hasError: false,
    orderNum: index + 2
  }
  editableData.questions?.splice(index + 1, 0, newQuestion)
  // 更新序号
  editableData.questions?.forEach((q: any, i: number) => {
    q.orderNum = i + 1
  })
  ElMessage.success('已添加新题目')
}

// 删除题目
const removeQuestion = (index: number) => {
  editableData.questions?.splice(index, 1)
  // 更新序号
  editableData.questions?.forEach((q: any, i: number) => {
    q.orderNum = i + 1
  })
  ElMessage.success('已删除题目')
}

// 删除资料分析大题
const removeMaterial = (index: number) => {
  editableData.materialQuestions?.splice(index, 1)
  // 更新序号
  editableData.materialQuestions?.forEach((mq: any, i: number) => {
    mq.orderNum = i + 1
  })
  ElMessage.success('已删除资料分析大题')
}

// 添加子题目
const addSubQuestion = (materialIndex: number, afterIndex: number) => {
  const material = editableData.materialQuestions?.[materialIndex]
  if (material) {
    const newQuestion = {
      title: '',
      options: [],
      optionsText: '',
      type: 'single_choice',
      difficulty: 'medium',
      category: material.category,
      correctAnswer: '',
      analysis: '',
      hasError: false,
      orderNum: (material.subQuestions?.length || 0) + 1
    }
    material.subQuestions?.splice(afterIndex + 1, 0, newQuestion)
    // 更新序号
    material.subQuestions?.forEach((q: any, i: number) => {
      q.orderNum = i + 1
    })
    ElMessage.success('已添加子题目')
  }
}

// 删除子题目
const removeSubQuestion = (materialIndex: number, subIndex: number) => {
  const material = editableData.materialQuestions?.[materialIndex]
  if (material) {
    material.subQuestions?.splice(subIndex, 1)
    // 更新序号
    material.subQuestions?.forEach((q: any, i: number) => {
      q.orderNum = i + 1
    })
    ElMessage.success('已删除子题目')
  }
}

const showImportRecords = () => {
  ElMessage.info('查看导入记录')
}

const showHelp = () => {
  ElMessage.info('查看使用帮助')
}

// 类型名称映射
const typeNameMap: Record<string, string> = {
  'single_choice': '单选题',
  'multiple_choice': '多选题',
  'fill_blank': '填空题',
  'true_false': '判断题',
  'essay': '简答题'
}

// 类型样式映射
const typeClassMap: Record<string, string> = {
  'single_choice': 'tag-single',
  'multiple_choice': 'tag-multiple',
  'fill_blank': 'tag-fill',
  'true_false': 'tag-judge',
  'essay': 'tag-essay'
}

// 难度名称映射
const difficultyNameMap: Record<string, string> = {
  'easy': '简单',
  'medium': '中等',
  'hard': '困难'
}

// 难度样式映射
const difficultyClassMap: Record<string, string> = {
  'easy': 'diff-easy',
  'medium': 'diff-medium',
  'hard': 'diff-hard'
}

const getTypeName = (type: string) => {
  return typeNameMap[type] || '未知类型'
}

const getTypeClass = (type: string) => {
  return typeClassMap[type] || 'tag-default'
}

const getDifficultyName = (difficulty: string) => {
  return difficultyNameMap[difficulty] || difficulty
}

const getDifficultyClass = (difficulty: string) => {
  return difficultyClassMap[difficulty] || 'diff-default'
}

// 组件卸载时重置状态，防止路由切换时状态污染
onUnmounted(() => {
  try {
    // 取消所有未完成的请求
    abortController.value?.abort()
    abortController.value = null
    
    currentStep.value = 0
    previewData.value = null
    uploadFiles.value = []
    // 彻底清空 reactive 对象
    editableData.questions.splice(0, editableData.questions.length)
    editableData.materialQuestions.splice(0, editableData.materialQuestions.length)
    proofreadTab.value = 'all'
    showAllQuestions.value = false
    isDraggingQuestion.value = false
    isDraggingAnswer.value = false
    loading.value = false
    questionFile.value = null
    answerFile.value = null
  } catch (error) {
    console.error('BatchImport component cleanup error:', error)
  }
})
</script>

<style scoped lang="css">
.batch-import {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

/* 顶部标题栏 */
.import-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #d0d0d0;
  background: #fafafa;
}

/* 步骤导航 */
.steps-container {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  position: relative;
}

.step-item:not(:last-child) {
  margin-right: 32px;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 2px;
  background: #e8e8e8;
}

.step-item.completed::after,
.step-item.active::after {
  background: #409eff;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.step-item.active .step-number {
  background: #409eff;
  color: #fff;
}

.step-item.completed .step-number {
  background: #67c23a;
  color: #fff;
}

.step-label {
  font-size: 14px;
  color: #666;
}

.step-item.active .step-label {
  color: #409eff;
  font-weight: 500;
}

/* 主内容区 */
.main-content {
  display: flex;
  gap: 24px;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  width: 420px;
  flex-shrink: 0;
}

/* 区域通用样式 */
.section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

/* 文件上传区域 */
.file-upload-wrapper {
  margin-bottom: 20px;
}

.file-upload-wrapper:last-child {
  margin-bottom: 0;
}

.file-upload-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.file-upload-label .required {
  color: #f56c6c;
  margin-right: 4px;
}

.file-upload-label .optional {
  color: #909399;
  font-size: 12px;
  margin-right: 4px;
  padding: 2px 6px;
  background: #f4f4f5;
  border-radius: 4px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 0.25s;
  cursor: pointer;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-area:hover,
.upload-area.dragging {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.upload-area.has-file {
  border-style: solid;
  border-color: #67c23a;
  background: rgba(103, 194, 58, 0.05);
  padding: 16px;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.upload-area p {
  font-size: 14px;
  color: #333;
  margin: 0 0 6px 0;
}

.upload-hint {
  font-size: 12px !important;
  color: #999 !important;
}

.file-input {
  display: none;
}

/* 文件信息（内联） */
.file-info-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
}

.file-icon-small {
  font-size: 28px;
}

.file-details-inline {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name-inline {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.file-size-inline {
  font-size: 12px;
  color: #999;
}

.remove-file {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #f56c6c;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-file:hover {
  background: #f78989;
}

/* 导入设置 */
.settings-section {
  padding-bottom: 24px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-item.full-width {
  grid-column: span 2;
}

.setting-item label {
  font-size: 13px;
  color: #666;
}

.form-select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  font-size: 14px;
  color: #333;
  background: #fff;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #409eff;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #d0d0d0;
}

.radio-option.active {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.08);
  color: #409eff;
}

.radio-option input {
  display: none;
}

/* 导入说明 */
.import-tips {
  margin: 0;
  padding: 0;
  list-style: none;
}

.import-tips li {
  font-size: 13px;
  color: #666;
  line-height: 2;
}

.import-tips code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: #409eff;
}

/* 下一步按钮 */
.next-step {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 12px 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff 0%, #367cf0 100%);
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary.large {
  padding: 14px 32px;
  font-size: 15px;
}

/* 右侧预览区 */
.preview-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 24px;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 12px !important;
  color: #999 !important;
}

/* 识别统计 */
.stats-section {
  margin-bottom: 16px;
}

.stats-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 12px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 12px 4px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.stat-label {
  font-size: 10px;
  color: #999;
  display: block;
  margin-top: 4px;
}

/* 内容预览 */
.content-preview {
  margin-bottom: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-header h4 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.preview-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.item-tag {
  padding: 4px 10px;
  background: #409eff;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
}

.item-tag.tag-single {
  background: #409eff;
}

.item-tag.tag-multiple {
  background: #67c23a;
}

.item-tag.tag-fill {
  background: #e6a23c;
}

.item-tag.tag-judge {
  background: #909399;
}

.item-tag.tag-essay {
  background: #f56c6c;
}

.item-tag.tag-default {
  background: #909399;
}

.item-number {
  font-size: 12px;
  color: #999;
}

.item-content p {
  font-size: 13px;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.item-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.item-options span {
  font-size: 12px;
  color: #666;
}

.item-answer {
  padding-top: 8px;
  border-top: 1px dashed #e8e8e8;
}

.answer-label {
  font-size: 12px;
  color: #999;
}

.answer-value {
  font-size: 13px;
  font-weight: 600;
  color: #67c23a;
}

/* 解析内容 */
.item-analysis {
  padding: 10px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-left: 3px solid #667eea;
  border-radius: 0 6px 6px 0;
  margin-top: 8px;
}

.analysis-label {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.analysis-text {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

/* 温馨提示 */
.tips-box {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tips-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.tips-box p {
  font-size: 13px;
  color: #ad8b00;
  margin: 0;
  line-height: 1.5;
}

/* 确认导入按钮 */
.confirm-import {
  display: flex;
  justify-content: flex-end;
}

.confirm-import .btn-primary {
  width: 100%;
}

/* AI徽章 */
.ai-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 500;
}

/* 分类标签 */
.item-category {
  font-size: 11px;
  color: #666;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* 难度标签 */
.difficulty-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.difficulty-tag.diff-easy {
  background: #e8f5e9;
  color: #67c23a;
}

.difficulty-tag.diff-medium {
  background: #fff3e0;
  color: #e6a23c;
}

.difficulty-tag.diff-hard {
  background: #ffeef0;
  color: #f56c6c;
}

/* 题目标题 */
.question-title {
  font-size: 13px;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.6;
}

/* 选项样式 */
.item-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.option-item {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.option-label {
  font-weight: 600;
  color: #409eff;
  flex-shrink: 0;
}

.option-text {
  color: #666;
}

/* AI提示框 */
.ai-tip {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  margin-top: 16px;
}

.ai-icon {
  font-size: 24px;
}

.ai-text strong {
  display: block;
  font-size: 14px;
  color: #667eea;
  margin-bottom: 4px;
}

.ai-text p {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* 查看全部按钮 */
.view-all-btn {
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.view-all-btn:hover {
  opacity: 0.9;
}

/* 模态框遮罩 */
.modal-overlay {
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

/* 模态框内容 */
.modal-content {
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #eee;
  color: #666;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.all-questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 8px 20px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #eee;
}

/* 新的多文件上传样式 */
.upload-icon-large {
  font-size: 56px;
  margin-bottom: 16px;
}

.upload-main-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  width: 100%;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.2s;
}

.file-card:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.file-card-icon {
  font-size: 32px;
}

.file-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.file-card-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-card-size {
  font-size: 11px;
  color: #999;
}

.file-card-remove {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #f56c6c;
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.file-card-remove:hover {
  background: #f78989;
  transform: scale(1.1);
}

.add-more-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
}

.add-more-card:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.add-icon {
  font-size: 28px;
  color: #409eff;
  font-weight: 300;
}

.add-text {
  font-size: 12px;
  color: #999;
}

.main-upload {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.main-upload.has-file {
  padding: 16px;
  cursor: default;
}

.optional-label {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}

/* AI文件说明框 */
.ai-file-tip {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  margin-top: 20px;
}

.ai-file-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.ai-file-content {
  flex: 1;
}

.ai-file-content h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.ai-file-content ul {
  margin: 0;
  padding-left: 20px;
}

.ai-file-content li {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 4px;
}

.ai-file-content li strong {
  color: #333;
}

.ai-file-content code {
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: #667eea;
}

/* 资料分析大题样式 */
.material-question {
  background: linear-gradient(135deg, rgba(52, 131, 235, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%);
  border: 2px solid rgba(52, 131, 235, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.material-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(52, 131, 235, 0.3);
}

.material-tag {
  background: linear-gradient(135deg, #3483eb 0%, #667eea 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.material-number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.material-count {
  font-size: 12px;
  color: #999;
}

.material-content {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border-left: 4px solid #3483eb;
}

.material-label {
  font-size: 12px;
  font-weight: 600;
  color: #3483eb;
  margin-bottom: 4px;
}

.material-text {
  font-size: 13px;
  color: #555;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
}

.sub-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-item {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
}

.more-sub {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 8px;
  background: rgba(52, 131, 235, 0.05);
  border-radius: 4px;
}

/* 校对界面样式 */
.proofread-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.proofread-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.proofread-count {
  font-size: 14px;
  color: #666;
  margin: 0 16px 0 0;
}

.proofread-actions {
  display: flex;
  gap: 8px;
}

.proofread-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 8px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #fff;
  color: #409eff;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.proofread-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-right: 8px;
}

.proofread-material-item {
  background: linear-gradient(135deg, rgba(52, 131, 235, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%);
  border: 2px solid rgba(52, 131, 235, 0.2);
  border-radius: 12px;
  padding: 16px;
}

.proofread-item {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
}

.proofread-item.has-error {
  border-color: #f56c6c;
  background: rgba(245, 108, 108, 0.05);
}

.proofread-item.has-error .item-header {
  border-color: #f56c6c;
}

.error-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  margin-left: 8px;
}

.proofread-section {
  margin-bottom: 12px;
}

.proofread-section.half {
  flex: 1;
  min-width: 200px;
}

.proofread-row {
  display: flex;
  gap: 16px;
}

.proofread-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.proofread-textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;
}

.proofread-textarea:focus {
  outline: none;
  border-color: #409eff;
}

.proofread-textarea.options-textarea {
  min-height: 120px;
}

.proofread-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 13px;
  transition: border-color 0.2s;
}

.proofread-input:focus {
  outline: none;
  border-color: #409eff;
}

.proofread-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.proofread-select:focus {
  outline: none;
  border-color: #409eff;
}

.item-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.material-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.action-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #409eff;
  color: #fff;
}

.proofread-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
</style>
