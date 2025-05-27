import { userService } from '..'
import { PORT1 } from '../config/servicePort'

// 请求响应参数（不包含data）
export interface Result {
  code: string | number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = unknown> extends Result {
  data: T
}

export interface ProductModel {
  productId: number
  productModel: string
}
export interface CookbookNutrition {
  id?: number
  category: string
  quantity: string
}

export interface Diet {
  id: number
  cookingTime: number
  difficultyLevel: number
  taste: string
  category: string
  imageUrl: string
  productModelIdList?: ProductModel[]
  cookbookNutritionList: CookbookNutrition[]
  cookbookMultiLanguageList: CookBookMultiLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dietMultiLanguageObj?: any
}

export interface MultiLanguage {
  languageId: number
  languageCode: string
  displayLanguage: string
}

export interface CookBookMultiLanguage extends MultiLanguage {
  id: number
  cookbookName: string
  description: string
  cookbookIngredientList: Ingredients[]
  cookbookStepList: Steps[]
}
export type Category = {
  typeEn: string
}

export interface Ingredients {
  id: number
  ingredientName: string
  quantity: string
  unit: string
}

export interface Steps {
  id: number
  stepNum: number
  description: string
}

/**
 * @name 条件查询列表
 */
export const searchDiet = (params: {
  time?: number
  difficulty?: number
  name?: string
  category?: string
  pageNo: number
  pageSize: number
  productModel?: string
}) => {
  return userService.post<ResultData<{ cookbookList: Diet[]; total: number }>>(
    PORT1 + '/web/cookbook/list',
    params,
  )
}

/**
 * @name 查询品类列表
 */
export const getCategoryList = () => {
  return userService.get<ResultData<{ categoryList: Category[] }>>(
    PORT1 + '/web/cookbook/category/list',
  )
}

/**
 * @name 获取id的diet
 */
export const getDietById = (params: { id: number }) => {
  return userService.get<ResultData<Diet>>(`${PORT1}/web/cookbook/${params.id}`)
}

/**
 * @name ai营养师
 */

export const getAIAnswer = (messages: { role: string; content: string }[]) => {
  return userService.post<ResultData<string>>(`${PORT1}/deepseek/completion`, {
    json: JSON.stringify(messages),
  })
}
