import { cmsService } from '..'

const PORT1 = '/mova-cms'

// 请求响应参数（不包含data）
export interface Result {
  code: string | number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = unknown> extends Result {
  data: T
}

export interface Diet {
  id: number
  image: string
  time: number
  difficulty: number
  name: string
  name_en: string
  category: string
  description: string
  description_en: string
  createdAt: string
}

export type Category = string

export interface Ingredients {
  id: number
  name: string
  name_en: string
  quantity: string
  unit: string
}

export interface Steps {
  id: number
  step_number: number
  description: string
  description_en: string
  image_url: null | string
}

/**
 * @name 条件查询列表
 */
export const searchDiet = (params: {
  time?: number
  difficulty?: number
  name?: string
  category?: string
  id: number
}) => {
  return cmsService.get<ResultData<Diet[]>>(PORT1 + '/cookbooks/search/condition', params)
}

/**
 * @name 查询品类列表
 */
export const getCategoryList = () => {
  return cmsService.get<ResultData<Category[]>>(PORT1 + '/cookbooks/list/categories')
}

/**
 * @name 查询材料列表
 */
export const getIngredients = (id: number) => {
  return cmsService.get<ResultData<Ingredients[]>>(PORT1 + `/ingredients/recipe/${id}`)
}

/**
 * @name 查询步骤列表
 */
export const getSteps = (id: number) => {
  return cmsService.get<ResultData<Steps[]>>(PORT1 + `/steps/recipe/${id}`)
}

/**
 * @name 获取id的diet
 */
export const getDietById = (params: { id: number }) => {
  return cmsService.get<ResultData<Diet>>(`${PORT1}/cookbooks/${params.id}`)
}

/**
 * @name ai营养师
 */

export const getAIAnswer = (messages: { role: string; content: string }[]) => {
  return cmsService.post<ResultData<string>>(`${PORT1}/deepseek/completion`, {
    json: JSON.stringify(messages),
  })
}
