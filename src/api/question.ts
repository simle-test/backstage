import request from './request'

export interface Question {
  id: number
  questionId: string
  title: string
  content: string
  options: string[]
  answer: string
  analysis: string
  difficulty: string
  difficultyText: string
  category: string
  categoryText: string
  bankId: number
  bankName: string
  createdAt: string
  updatedAt?: string
}

export interface QuestionListParams {
  page?: number
  size?: number
  keyword?: string
  difficulty?: string
  category?: string
}

export interface QuestionStatistics {
  total: number
  easyCount: number
  mediumCount: number
  hardCount: number
  categoryList: {
    category: string
    categoryText: string
    count: number
  }[]
}

export interface QuestionListResponse {
  list: Question[]
  total: number
  page: number
  size: number
}

export const getQuestionList = (params: QuestionListParams) => {
  return request.get<any, any>('/questions', { params })
}

export const getQuestionStatistics = () => {
  return request.get<any, any>('/questions/statistics')
}

export const getQuestionById = (id: number) => {
  return request.get<any, any>(`/questions/${id}`)
}

export const getQuestionDetail = (id: number) => {
  return request.get<any, any>(`/questions/${id}`)
}

export interface AddQuestionData {
  questionId?: string
  title: string
  content?: string
  options?: string[]
  answer: string
  analysis?: string
  difficulty: string
  category: string
  bankId?: number
  questionContent?: string
  source?: string
  year?: number | null
  status?: string
}

export interface UpdateQuestionData extends Partial<AddQuestionData> {}

export const addQuestion = (data: AddQuestionData) => {
  return request.post<any, any>('/questions', data)
}

export const updateQuestion = (id: number, data: UpdateQuestionData) => {
  return request.put<any, any>(`/questions/${id}`, data)
}

export const deleteQuestion = (id: number) => {
  return request.delete<any, any>(`/questions/${id}`)
}

// 批量导入相关接口
export interface BatchImportPreviewResponse {
  success: boolean
  message: string
  questions: Array<{
    number: string
    typeName: string
    content: string
    options: string[]
    correctAnswer: string
    category: string
  }>
  statistics: {
    total: number
    singleChoice: number
    multipleChoice: number
    fillBlank: number
    trueFalse: number
    essay: number
    parsed: number
  }
  errors: string[]
}

export const batchImportPreview = (formData: FormData) => {
  return request.post<any, any>('/questions/batch-import/preview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getImportCategories = () => {
  return request.get<any, any>('/questions/batch-import/categories')
}