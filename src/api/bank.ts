import request from './request'

export interface Bank {
  id: number
  name: string
  desc: string
  color: string
  questionCount: number
  updatedAt: string
  tags?: string[]
}

export const getBankList = () => {
  return request.get<any, any>('/banks')
}

export const getBankById = (id: number) => {
  return request.get<any, any>(`/banks/${id}`)
}

export interface CreateBankData {
  name: string
  desc?: string
  color?: string
}

export interface UpdateBankData {
  name?: string
  desc?: string
  color?: string
}

export const createBank = (data: CreateBankData) => {
  return request.post<any, any>('/banks', data)
}

export const updateBank = (id: number, data: UpdateBankData) => {
  return request.put<any, any>(`/banks/${id}`, data)
}