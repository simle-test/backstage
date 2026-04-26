import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import QuestionManagement from '@/views/QuestionManagement.vue'
import QuestionBank from '@/views/QuestionBank.vue'
import UserManagement from '@/views/UserManagement.vue'
import Statistics from '@/views/Statistics.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', redirect: '/questions' },
        { path: '/questions', component: QuestionManagement, name: 'QuestionManagement' },
        { path: '/bank', component: QuestionBank, name: 'QuestionBank' },
        { path: '/users', component: UserManagement, name: 'UserManagement' },
        { path: '/statistics', component: Statistics, name: 'Statistics' }
      ]
    }
  ]
})

export default router