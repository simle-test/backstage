<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="openAddModal">
        <Plus class="icon" />
        添加用户
      </el-button>
    </div>
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名或邮箱"
        class="search-input"
        prefix-icon="Search"
      />
      <el-select v-model="filterStatus" placeholder="用户状态" class="filter-select">
        <el-option label="全部" value="" />
        <el-option label="正常" value="active" />
        <el-option label="禁用" value="disabled" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" border class="data-table">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">{{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-switch :value="scope.row.status === 'active'" @change="toggleStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="totalQuestions" label="做题数" width="100" />
      <el-table-column prop="correctRate" label="正确率" width="100">
        <template #default="scope">
          <span>{{ scope.row.correctRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerTime" label="注册时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="viewUser(scope.row)">查看</el-button>
          <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
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
    <el-dialog title="添加用户" :visible.sync="showAddModal" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
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
const filterStatus = ref('')
const showAddModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(120)

const formData = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  role: 'user'
})

const tableData = ref([
  { id: 1, username: 'zhangsan', email: 'zhangsan@example.com', phone: '13800138001', role: 'admin', status: 'active', totalQuestions: 520, correctRate: 85, registerTime: '2024-01-01 10:00:00' },
  { id: 2, username: 'lisi', email: 'lisi@example.com', phone: '13800138002', role: 'user', status: 'active', totalQuestions: 380, correctRate: 72, registerTime: '2024-01-03 14:20:00' },
  { id: 3, username: 'wangwu', email: 'wangwu@example.com', phone: '13800138003', role: 'user', status: 'disabled', totalQuestions: 150, correctRate: 68, registerTime: '2024-01-05 09:30:00' },
  { id: 4, username: 'zhaoliu', email: 'zhaoliu@example.com', phone: '13800138004', role: 'user', status: 'active', totalQuestions: 890, correctRate: 91, registerTime: '2024-01-02 16:45:00' },
  { id: 5, username: 'sunqi', email: 'sunqi@example.com', phone: '13800138005', role: 'user', status: 'active', totalQuestions: 230, correctRate: 76, registerTime: '2024-01-06 11:00:00' }
])

const handleSearch = () => {
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const openAddModal = () => {
  showAddModal.value = true
}

const viewUser = (row: any) => {
}

const editUser = (row: any) => {
}

const deleteUser = (id: number) => {
  tableData.value = tableData.value.filter(item => item.id !== id)
}

const toggleStatus = (row: any) => {
  row.status = row.status === 'active' ? 'disabled' : 'active'
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