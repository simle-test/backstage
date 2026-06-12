export const IMAGE_BASE_URL = 'https://www.civilservant.cloud/'

export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  let path = imagePath
  if (path.startsWith('./')) {
    path = path.substring(2)
  } else if (path.startsWith('/')) {
    path = path.substring(1)
  } else if (path.startsWith('.')) {
    path = path.substring(1)
  }
  return IMAGE_BASE_URL + path
}

export const isImagePath = (text: string): boolean => {
  if (!text) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const lowerText = text.toLowerCase()
  return imageExtensions.some(ext => lowerText.includes(ext))
}

export interface QuestionContent {
  image?: string
  option?: Record<string, string>
}

export interface QuestionOption {
  key: string
  value: string
  isImage: boolean
  imageUrl: string
}

export const parseQuestionContent = (content: string | null | undefined): QuestionContent => {
  if (!content) return {}
  try {
    const parsed = JSON.parse(content)
    console.log('解析questionContent成功:', parsed)
    return parsed
  } catch (error) {
    console.error('解析questionContent失败:', error, '原始内容:', content)
    return {}
  }
}

export const getQuestionImageUrl = (questionContent: string | null | undefined): string => {
  const parsed = parseQuestionContent(questionContent)
  return getFullImageUrl(parsed.image)
}

export const getQuestionOptions = (questionContent: string | null | undefined): Record<string, string> => {
  const parsed = parseQuestionContent(questionContent)
  return parsed.option || {}
}

export const getQuestionOptionsWithImages = (questionContent: string | null | undefined): QuestionOption[] => {
  const options = getQuestionOptions(questionContent)
  return Object.entries(options).map(([key, value]) => ({
    key,
    value,
    isImage: isImagePath(value),
    imageUrl: isImagePath(value) ? getFullImageUrl(value) : ''
  }))
}