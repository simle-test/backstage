import request from './request'

export interface OverallStatistics {
  totalQuestions: number
  totalSubmissions: number
  totalUsers: number
  avgPassRate: number
}

export interface DailyTrend {
  date: string
  count: number
}

export interface CategoryScores {
  easyScore: number
  mediumScore: number
  hardScore: number
}

export interface RankingItem {
  rank: number
  username: string
  avatar: string
  avatarColor: string
  title: string
  practiceCount: number
}

export const getOverallStatistics = () => {
  return request.get<any, any>('/statistics')
}

export const getDailyTrend = (days?: number) => {
  return request.get<any, any>('/statistics/daily', { params: { days } })
}

export const getCategoryScores = () => {
  return request.get<any, any>('/statistics/categories')
}

export const getRanking = (limit?: number) => {
  return request.get<any, any>('/statistics/ranking', { params: { limit } })
}