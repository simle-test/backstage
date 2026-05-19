import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import QuestionManagement from '@/views/QuestionManagement.vue'
import QuestionBank from '@/views/QuestionBank.vue'
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
        { path: 'questions', component: QuestionManagement, name: 'QuestionManagement' },
        { path: 'bank', component: QuestionBank, name: 'QuestionBank' },
        { path: 'users', component: UserManagement, name: 'UserManagement' },
        { path: 'statistics', component: Statistics, name: 'Statistics' }
      ]
    }
  ]
})

export default router
