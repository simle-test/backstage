<template>
  <div class="page-container">
    <div class="page-header">
      <h2>题目管理</h2>
      <el-button type="primary" @click="openAddModal">
        <Plus class="icon" />
        添加题目
      </el-button>
    </div>
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索题目内容"
        class="search-input"
        prefix-icon="Search"
      />
      <el-select v-model="filterType" placeholder="题目类型" class="filter-select">
        <el-option label="全部" value="" />
        <el-option label="单选题" value="single" />
        <el-option label="多选题" value="multiple" />
        <el-option label="判断题" value="judge" />
        <el-option label="填空题" value="fill" />
        <el-option label="问答题" value="essay" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" border class="data-table">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.type)">{{ getTypeName(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="题目内容" min-width="300" />
      <el-table-column prop="difficulty" label="难度" width="100">
        <template #default="scope">
          <el-tag :type="getDifficultyType(scope.row.difficulty)">{{ scope.row.difficulty }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bankName" label="所属题库" width="150" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="editQuestion(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteQuestion(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
      />
    </div>
    <el-dialog title="添加题目" :visible.sync="showAddModal" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="题目类型">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
            <el-option label="填空题" value="fill" />
            <el-option label="问答题" value="essay" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容">
          <el-textarea v-model="formData.content" rows="4" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="选项">
          <el-input v-model="formData.options" placeholder="选项用逗号分隔，如：A,B,C,D" />
        </el-form-item>
        <el-form-item label="正确答案">
          <el-input v-model="formData.answer" placeholder="请输入正确答案" />
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="formData.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属题库">
          <el-select v-model="formData.bankId" placeholder="请选择题库">
            <el-option label="题库一" value="1" />
            <el-option label="题库二" value="2" />
            <el-option label="题库三" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterType = ref('')
const showAddModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

const formData = reactive({
  type: '',
  content: '',
  options: '',
  answer: '',
  difficulty: '',
  bankId: ''
})

const tableData = ref([
  { id: 1, type: 'single', content: '下列选项中，哪个是Vue3的组合式API？', options: 'A. data() B. setup() C. mounted() D. created()', answer: 'B', difficulty: '简单', bankName: '题库一', createTime: '2024-01-15 10:30:00' },
  { id: 2, type: 'multiple', content: '以下哪些是JavaScript的基本数据类型？', options: 'A. string B. number C. array D. object', answer: 'AB', difficulty: '中等', bankName: '题库二', createTime: '2024-01-14 14:20:00' },
  { id: 3, type: 'judge', content: 'Vue3中，ref可以用来创建响应式对象。', answer: '错误', difficulty: '简单', bankName: '题库一', createTime: '2024-01-13 09:15:00' },
  { id: 4, type: 'fill', content: 'Vue3的核心响应式API是______。', answer: 'reactive', difficulty: '中等', bankName: '题库三', createTime: '2024-01-12 16:45:00' },
  { id: 5, type: 'essay', content: '请简述Vue3相比于Vue2的主要改进。', answer: '略', difficulty: '困难', bankName: '题库二', createTime: '2024-01-11 11:00:00' }
])

const typeMap: Record<string, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
  fill: '填空题',
  essay: '问答题'
}

const getTypeName = (type: string) => typeMap[type] || type

const getTagType = (type: string) => {
  const map: Record<string, string> = {
    single: 'primary',
    multiple: 'success',
    judge: 'warning',
    fill: 'info',
    essay: 'danger'
  }
  return map[type] || 'default'
}

const getDifficultyType = (difficulty: string) => {
  const map: Record<string, string> = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return map[difficulty] || 'default'
}

const openAddModal = () => {
  showAddModal.value = true
}

const handleSearch = () => {
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const editQuestion = (row: any) => {
}

const deleteQuestion = (id: number) => {
  tableData.value = tableData.value.filter(item => item.id !== id)
}

const submitForm = () => {
  showAddModal.value = false
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.icon {
  margin-right: 5px;
}

.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 150px;
}

.data-table {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>