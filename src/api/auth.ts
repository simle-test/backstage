import request from './request'

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expire: string
  user: {
    id: number
    username: string
    email: string
    phone: string
    role: string
  }
}

export interface RegisterData {
  username: string
  password: string
  email: string
  phone?: string
}

export const login = (data: LoginData) => {
  return request.post<any, any>('/auth/login', data)
}

export const register = (data: RegisterData) => {
  return request.post<any, any>('/auth/register', data)
}