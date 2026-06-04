import request from './request'

export interface MaterialProblemItem {
  id?: number
  questionId: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  correctAnswer: string
  analysis: string
  orderNum: number
  difficulty: string
  difficultyText?: string
}

export interface MaterialAnalysisDetailResponse {
  materialId?: number
  materialContent: string
  imageUrl?: string
  categoryId?: string
  categoryName?: string
  problems: MaterialProblemItem[]
  problemCount?: number
}

export interface SaveMaterialAnalysisRequest {
  materialId?: number
  materialContent: string
  problems: MaterialProblemItem[]
}

export const getMaterialAnalysisDetail = (materialId: number) => {
  return request.get<any, any>(`/material-analysis/${materialId}`)
}

export const saveMaterialAnalysis = (data: SaveMaterialAnalysisRequest) => {
  return request.post<any, any>('/material-analysis/save', data)
}
