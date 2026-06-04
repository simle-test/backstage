<template>
  <div class="user-management animate-fade-in">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats.total ?? 0).toLocaleString() }}</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-trend up">+{{ (stats.avgActiveDays ?? 0) }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon easy">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats.active ?? 0).toLocaleString() }}</div>
          <div class="stat-label">活跃用户</div>
        </div>
        <div class="stat-percent">{{ ((stats.active ?? 0) / ((stats.total ?? 0) || 1) * 100).toFixed(1) }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon medium">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats.todayNew ?? 0).toLocaleString() }}</div>
          <div class="stat-label">今日新增</div>
        </div>
        <div class="stat-percent">+{{ (stats.avgActiveDays ?? 0) }}%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon hard">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.retentionRate ?? 0 }}%</div>
          <div class="stat-label">留存率</div>
        </div>
        <div class="stat-percent">+3.1%</div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="header-title">
          <h2>用户列表</h2>
          <span class="subtitle">管理所有平台用户</span>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="搜索用户名或邮箱" v-model="searchKeyword" @keyup.enter="handleSearch">
          </div>
          <select v-model="roleFilter" class="filter-select" @change="handleSearch">
            <option value="">全部角色</option>
            <option value="ROLE_ADMIN">管理员</option>
            <option value="ROLE_USER">普通用户</option>
            <option value="ROLE_VIP">VIP用户</option>
          </select>
          <button class="btn-primary" @click="handleAdd">添加用户</button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>角色</th>
              <th>刷题数</th>
              <th>通过率</th>
              <th>注册时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar" :style="{ background: user.color }">
                    {{ user.avatar }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ user.username }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td><span :class="['role-badge', getRoleClass(user.role)]">{{ user.roleText }}</span></td>
              <td class="num-cell">{{ user.practiceCount }}</td>
              <td>
                <div class="pass-rate">
                  <div class="rate-bar">
                    <div class="rate-fill" :style="{ width: (user.passRate || 0) + '%' }"></div>
                  </div>
                  <span class="rate-text">{{ (user.passRate || 0).toFixed(1) }}%</span>
                </div>
              </td>
              <td>{{ user.joinDate || '-' }}</td>
              <td><span :class="['status-badge', user.status]">{{ user.statusText }}</span></td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" @click="handleEdit(user)" title="编辑">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <button class="action-btn delete" @click="handleDelete(user)" title="删除">
                    <svg viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !loading">
              <td colspan="7" class="empty-state">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>暂无用户数据</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="totalPages > 0">
        <button class="page-btn" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
          上一页
        </button>
        <template v-for="p in visiblePages" :key="p">
          <button v-if="p !== '...'" class="page-btn" :class="{ active: p === currentPage }" @click="changePage(p)">
            {{ p }}
          </button>
          <span v-else class="page-dots">...</span>
        </template>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">
          下一页
        </button>
        <span class="page-info">共 {{ total }} 条</span>
      </div>
    </div>

    <div v-if="dialogVisible" class="dialog-overlay" @click.self="handleCloseDialog">
      <div class="edit-dialog">
        <div class="dialog-header">
          <h3>{{ isEdit ? '编辑用户' : '添加用户' }}</h3>
          <button class="dialog-close" @click="handleCloseDialog">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">用户名 <span class="required">*</span></label>
            <input 
              type="text" 
              class="form-input" 
              v-model="editForm.username" 
              placeholder="请输入用户名"
              :disabled="isEdit"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">密码 <span v-if="!isEdit" class="required">*</span></label>
            <input 
              type="text" 
              class="form-input" 
              v-model="editForm.password" 
              placeholder="请输入密码"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">邮箱 <span class="required">*</span></label>
            <input 
              type="email" 
              class="form-input" 
              v-model="editForm.email" 
              placeholder="请输入邮箱"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">手机号</label>
            <input 
              type="tel" 
              class="form-input" 
              v-model="editForm.phone" 
              placeholder="请输入手机号"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">微信OpenID</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="editForm.wechatOpenid" 
              placeholder="请输入微信OpenID"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">角色 <span class="required">*</span></label>
            <select class="form-input" v-model="editForm.role">
              <option value="ROLE_USER">普通用户</option>
              <option value="ROLE_VIP">VIP用户</option>
              <option value="ROLE_ADMIN">管理员</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">状态</label>
            <select class="form-input" v-model="editForm.status">
              <option value="active">正常</option>
              <option value="inactive">未激活</option>
              <option value="banned">禁用</option>
            </select>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { getUserList, getUserStatistics, getUserById, addUser, updateUser, deleteUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

interface User {
  id: number
  username: string
  email: string
  phone?: string
  role: string
  roleText: string
  practiceCount: number
  passRate: number
  joinDate: string
  status: string
  statusText: string
  avatar: string
  color: string
}

interface Statistics {
  total: number
  active: number
  todayNew: number
  avgActiveDays: number
  retentionRate?: number
}

const users = ref<User[]>([])
const stats = ref<Statistics>({ total: 0, active: 0, todayNew: 0, avgActiveDays: 0 })
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const roleFilter = ref('')

const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editForm = reactive({
  id: 0,
  username: '',
  password: '',
  email: '',
  phone: '',
  wechatOpenid: '',
  role: 'ROLE_USER',
  status: 'active'
})

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

const getRoleClass = (role: string) => {
  if (role === 'ROLE_ADMIN') return 'admin'
  if (role === 'ROLE_VIP') return 'vip'
  return 'user'
}

const loadData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (roleFilter.value) params.role = roleFilter.value
    
    const userRes = await getUserList(params)
    if (userRes.data.code === 200) {
      users.value = userRes.data.data.list || []
      total.value = userRes.data.data.total || 0
    }
    
    const statRes = await getUserStatistics()
    if (statRes.data.code === 200) {
      stats.value = statRes.data.data
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.response?.data?.msg || error.message || '获取数据失败'
    ElMessage.error(errMsg)
    console.error('获取用户数据失败:', error.response?.data || error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page as number
    loadData()
  }
}

const handleAdd = () => {
  isEdit.value = false
  editForm.id = 0
  editForm.username = ''
  editForm.password = ''
  editForm.email = ''
  editForm.phone = ''
  editForm.wechatOpenid = ''
  editForm.role = 'ROLE_USER'
  editForm.status = 'active'
  dialogVisible.value = true
}

const handleEdit = async (user: User) => {
  isEdit.value = true
  editForm.id = user.id
  editForm.username = user.username
  editForm.email = user.email
  editForm.phone = user.phone || ''
  editForm.role = user.role
  editForm.status = user.status
  
  try {
    const res = await getUserById(user.id)
    if (res.code === 200) {
      const detail = res.data
      editForm.password = detail.password || ''
      editForm.wechatOpenid = detail.wechatOpenid || ''
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
  }
  
  dialogVisible.value = true
}

const handleCloseDialog = () => {
  dialogVisible.value = false
}

const handleSave = async () => {
  if (!editForm.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!editForm.email.trim()) {
    ElMessage.warning('请输入邮箱')
    return
  }
  if (!isEdit.value && !editForm.password.trim()) {
    ElMessage.warning('请输入密码')
    return
  }
  
  saving.value = true
  try {
    const data: any = {
      username: editForm.username,
      email: editForm.email,
      phone: editForm.phone,
      wechatOpenid: editForm.wechatOpenid,
      role: editForm.role,
      status: editForm.status
    }
    
    if (editForm.password.trim()) {
      data.password = editForm.password
    }
    
    const res = isEdit.value 
      ? await updateUser(editForm.id, data)
      : await addUser(data)
    
    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
      handleCloseDialog()
      loadData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || '操作失败'
    ElMessage.error(errMsg)
  } finally {
    saving.value = false
  }
}

const handleDelete = (user: User) => {
  ElMessageBox.confirm(
    `确定要删除用户「${user.username}」吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await deleteUser(user.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || '删除失败'
      ElMessage.error(errMsg)
    }
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="css">
.user-management {
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
  font-size: 22px;
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
  font-size: 14px;
  font-weight: 600;
  color: var(--success);
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
  flex-wrap: wrap;
  gap: 16px;
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
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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

.filter-select {
  padding: 10px 16px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.filter-select:hover {
  border-color: var(--border-color);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
}

.btn-primary {
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
  padding: 16px 28px;
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
  background: rgba(37, 99, 235, 0.05);
}

.data-table td {
  padding: 20px 28px;
  font-size: 14px;
  color: var(--text-secondary);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  font-size: 12px;
  color: var(--text-muted);
}

.role-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge.admin {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.role-badge.vip {
  background: rgba(37, 99, 235, 0.15);
  color: var(--primary);
}

.role-badge.user {
  background: rgba(156, 163, 175, 0.15);
  color: var(--text-muted);
}

.num-cell {
  font-weight: 600;
  color: var(--text-primary);
}

.pass-rate {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rate-bar {
  flex: 1;
  max-width: 100px;
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
  min-width: 45px;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}

.status-badge.inactive {
  background: rgba(156, 163, 175, 0.15);
  color: var(--text-muted);
}

.status-badge.banned {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
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
  border-color: var(--border-color);
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-primary-color);
}

.action-btn.edit:hover {
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(96, 165, 250, 0.08);
  color: var(--info);
}

.action-btn.delete:hover {
  border-color: rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.08);
  color: var(--danger);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
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
  border-color: var(--border-color);
  color: var(--text-primary-color);
  background: rgba(37, 99, 235, 0.08);
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

.page-info {
  font-size: 14px;
  color: var(--text-muted);
  margin-left: 16px;
}

.page-dots {
  color: var(--text-muted);
  padding: 0 8px;
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

.required {
  color: var(--danger);
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

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
