<template>
  <div class="page-container">
    <div class="page-header">
      <h2>题库管理</h2>
      <el-button type="primary" @click="openAddModal">
        <Plus class="icon" />
        添加题库
      </el-button>
    </div>
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索题库名称"
        class="search-input"
        prefix-icon="Search"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <div class="bank-grid">
      <div class="bank-card" v-for="bank in bankList" :key="bank.id" @click="viewBankDetail(bank)">
        <div class="card-header">
          <div class="bank-icon">
            <Folder class="icon" />
          </div>
          <div class="bank-info">
            <h3>{{ bank.name }}</h3>
            <p class="bank-desc">{{ bank.description }}</p>
          </div>
        </div>
        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-value">{{ bank.questionCount }}</span>
            <span class="stat-label">题目数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ bank.category }}</span>
            <span class="stat-label">分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ bank.updateTime }}</span>
            <span class="stat-label">更新时间</span>
          </div>
        </div>
        <div class="card-actions">
          <el-button size="small" @click.stop="editBank(bank)">编辑</el-button>
          <el-button size="small" type="danger" @click.stop="deleteBank(bank.id)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
      />
    </div>
    <el-dialog title="添加题库" :visible.sync="showAddModal" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="题库名称">
          <el-input v-model="formData.name" placeholder="请输入题库名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option label="前端开发" value="前端开发" />
            <el-option label="后端开发" value="后端开发" />
            <el-option label="数据库" value="数据库" />
            <el-option label="算法" value="算法" />
            <el-option label="操作系统" value="操作系统" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-textarea v-model="formData.description" rows="3" placeholder="请输入题库描述" />
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
import { Plus, Folder } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const showAddModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(20)

const formData = reactive({
  name: '',
  category: '',
  description: ''
})

const bankList = ref([
  { id: 1, name: 'Vue3 基础题库', description: '包含Vue3核心概念、组合式API、响应式原理等题目', questionCount: 120, category: '前端开发', updateTime: '2024-01-15' },
  { id: 2, name: 'JavaScript 进阶题库', description: '涵盖ES6+特性、异步编程、设计模式等内容', questionCount: 85, category: '前端开发', updateTime: '2024-01-14' },
  { id: 3, name: 'TypeScript 题库', description: '类型系统、泛型、装饰器等TypeScript核心知识点', questionCount: 60, category: '前端开发', updateTime: '2024-01-13' },
  { id: 4, name: '算法基础题库', description: '排序、查找、动态规划等经典算法题目', questionCount: 200, category: '算法', updateTime: '2024-01-12' },
  { id: 5, name: 'MySQL 题库', description: 'SQL语句、索引优化、事务处理等数据库知识', questionCount: 95, category: '数据库', updateTime: '2024-01-11' },
  { id: 6, name: 'Node.js 题库', description: 'Node.js核心模块、Express、异步编程等', questionCount: 70, category: '后端开发', updateTime: '2024-01-10' }
])

const handleSearch = () => {
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const openAddModal = () => {
  showAddModal.value = true
}

const viewBankDetail = (bank: any) => {
}

const editBank = (bank: any) => {
}

const deleteBank = (id: number) => {
  bankList.value = bankList.value.filter(item => item.id !== id)
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

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.bank-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
}

.bank-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.bank-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bank-icon .icon {
  font-size: 24px;
  color: #fff;
}

.bank-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.bank-desc {
  margin: 0;
  font-size: 13px;
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>