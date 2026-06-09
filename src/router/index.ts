import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import QuestionManagement from '@/views/QuestionManagement.vue'
import QuestionBank from '@/views/QuestionBank.vue'
import QuestionEdit from '@/views/QuestionEdit.vue'
import MaterialAnalysisEdit from '@/views/MaterialAnalysisEdit.vue'
import BatchImport from '@/views/BatchImport.vue'
import UserManagement from '@/views/UserManagement.vue'
import Statistics from '@/views/Statistics.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/', redirect: '/login' },
    {
      path: '/app',
      component: MainLayout,
      children: [
        { path: '', redirect: '/app/questions' },
        { path: 'questions', component: QuestionBank, name: 'QuestionManagement' },
        { path: 'questions/list', component: QuestionManagement, name: 'QuestionList' },
        { path: 'questions/edit/:id?', component: QuestionEdit, name: 'QuestionEdit' },
        { path: 'questions/material-analysis', component: MaterialAnalysisEdit, name: 'MaterialAnalysisEdit' },
        { path: 'questions/batch-import', component: BatchImport, name: 'BatchImport' },
        { path: 'users', component: UserManagement, name: 'UserManagement' },
        { path: 'statistics', component: Statistics, name: 'Statistics' }
      ]
    }
  ]
})

// 全局路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

// 路由守卫：处理路由切换时的异常
router.beforeEach((to, from, next) => {
  // 重置可能影响渲染的状态
  next()
})

router.afterEach(() => {
  // 路由切换完成后的清理操作
})

export default router