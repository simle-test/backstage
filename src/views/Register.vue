<template>
  <div class="auth-page">
    <div class="auth-bg"></div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#logoGradient)"/>
              <path d="M16 32V16l12 8 12-8v16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 24h16" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#2563eb"/>
                  <stop offset="100%" style="stop-color:#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="title">创建账号</h1>
          <p class="subtitle">开启您的行测备考之旅</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input 
                v-model="form.username" 
                type="text" 
                class="form-input" 
                placeholder="请输入用户名"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">邮箱</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-input" 
                placeholder="请输入邮箱"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                class="form-input" 
                placeholder="请输入密码"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" stroke-width="2"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-8.13 15.74" stroke="currentColor" stroke-width="2"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-labels">
                <span :class="{ active: passwordStrength >= 1 }">弱</span>
                <span :class="{ active: passwordStrength >= 2 }">中</span>
                <span :class="{ active: passwordStrength >= 3 }">强</span>
              </div>
              <div class="strength-bar">
                <div class="strength-fill" :style="{ width: passwordStrength * 33.33 + '%' }" :class="strengthClass"></div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">确认密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input 
                v-model="form.confirmPassword" 
                :type="showPassword ? 'text' : 'password'" 
                class="form-input" 
                placeholder="请再次输入密码"
                required
              />
            </div>
            <span v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="error-text">两次输入的密码不一致</span>
          </div>

          <label class="checkbox-label terms">
            <input type="checkbox" v-model="form.agree" required />
            <span class="checkmark"></span>
            <span>我已阅读并同意</span>
            <a href="#" class="terms-link">用户协议</a>
            <span>和</span>
            <a href="#" class="terms-link">隐私政策</a>
          </label>

          <button type="submit" class="submit-btn" :disabled="loading || !isValid">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? '注册中...' : '注 册' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>已有账号?</span>
          <router-link to="/login" class="link-primary">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const passwordStrength = computed(() => {
  const pwd = form.password
  let strength = 0
  if (pwd.length >= 8) strength++
  if (pwd.match(/[A-Z]/)) strength++
  if (pwd.match(/[0-9]/)) strength++
  if (pwd.match(/[^a-zA-Z0-9]/)) strength++
  return Math.min(strength, 3)
})

const strengthClass = computed(() => {
  if (passwordStrength.value === 1) return 'weak'
  if (passwordStrength.value === 2) return 'medium'
  if (passwordStrength.value === 3) return 'strong'
  return ''
})

const isValid = computed(() => {
  return form.password === form.confirmPassword && form.agree && form.username && form.email && form.password
})

const handleRegister = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  loading.value = false
  router.push('/login')
}
</script>

<style scoped lang="css">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
}

.auth-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.08) 0%, transparent 40%);
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.auth-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  padding: 40px 32px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
}

.logo svg {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-family: 'Noto Serif SC', serif;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.3s;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-muted);
  transition: color 0.3s;
}

.toggle-password:hover {
  color: var(--text-secondary);
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 48px;
}

.strength-labels {
  display: flex;
  gap: 8px;
}

.strength-labels span {
  font-size: 11px;
  color: var(--text-muted);
  transition: color 0.3s;
}

.strength-labels span.active {
  color: var(--text-primary-color);
}

.strength-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s;
  background: var(--text-muted);
}

.strength-fill.weak {
  background: var(--danger);
}

.strength-fill.medium {
  background: var(--warning);
}

.strength-fill.strong {
  background: var(--success);
}

.error-text {
  font-size: 12px;
  color: var(--danger);
  padding-left: 48px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
}

.checkbox-label.terms {
  flex-wrap: wrap;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  position: relative;
  transition: all 0.3s;
}

.checkbox-label input:checked + .checkmark {
  background: var(--primary-gradient);
  border-color: var(--primary);
}

.checkbox-label input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-link {
  color: var(--text-primary-color);
  text-decoration: none;
  transition: color 0.3s;
}

.terms-link:hover {
  color: var(--primary-dark);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary-gradient);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
}

.submit-btn:hover:not(:disabled) {
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.auth-footer span {
  font-size: 14px;
  color: var(--text-muted);
}

.link-primary {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary-color);
  text-decoration: none;
  margin-left: 8px;
  transition: color 0.3s;
}

.link-primary:hover {
  color: var(--primary-dark);
}
</style>
