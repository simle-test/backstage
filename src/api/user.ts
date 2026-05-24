import request from './request'

export interface User {
  id: number
  username: string
  email: string
  phone: string
  role: string
  roleName: string
  practiceCount: number
  passRate: number
  joinDate: string
  status: string
  statusText: string
  avatar: string
  avatarColor: string
}

export interface UserListParams {
  page?: number
  size?: number
  keyword?: string
  role?: string
}

export interface UserStatistics {
  total: number
  active: number
  todayNew: number
  avgActiveDays: number
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  size: number
}

export const getUserList = (params: UserListParams) => {
  return request.get<any, any>('/users', { params })
}

export const getUserStatistics = () => {
  return request.get<any, any>('/users/statistics')
}

export const getCurrentUser = () => {
  return request.get<any, any>('/users/me')
}

export const getUserById = (id: number) => {
  return request.get<any, any>(`/users/${id}`)
}

export interface UpdateUserData {
  username?: string
  email?: string
  phone?: string
  role?: string
  status?: string
  avatar?: string
}

export const updateUser = (id: number, data: UpdateUserData) => {
  return request.put<any, any>(`/users/${id}`, data)
}

export const addUser = (data: UpdateUserData & { password: string }) => {
  return request.post<any, any>('/users', data)
}

export const deleteUser = (id: number) => {
  return request.delete<any, any>(`/users/${id}`)
}