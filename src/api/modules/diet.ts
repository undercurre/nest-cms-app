/* eslint-disable @typescript-eslint/no-explicit-any */
import { userService } from '..'
import { PORT1, PORT2 } from '../config/servicePort'

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
  categoryId: number
  imageUrl: string
  productModelIdList?: ProductModel[]
  cookbookNutritionList: CookbookNutrition[]
  cookbookMultiLanguageList: CookBookMultiLanguage[]

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
  cookbookUtensilList: Accessories[]
  cookbookAiCookingList: AICooking[]
  aiCookingData: any[]
}

export interface Accessories {
  utensilName: string
}
export interface AICooking {
  quantity: string
  ingredientStatus: string
  cookingTime: string
}

export interface CategoryMultiLanguage extends MultiLanguage {
  id?: string
  categoryId?: string
  categoryName?: string
}
export interface Category {
  id: number
  categoryLanguageRelationList: CategoryMultiLanguage[]

  categoryMultiLanguageObj?: any
  existCookbook: boolean
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
  imageUrl?: string
}

/**
 * @name 条件查询列表
 */
export const searchDiet = (params: {
  time?: number
  difficulty?: number
  cookbookName?: string
  categoryId?: string | number
  pageNo: number
  pageSize: number
  productModel?: string
  countryId?: number
}) => {
  return userService.post<ResultData<{ cookbookList: Diet[]; total: number }>>(
    PORT1 + '/web/cookbook/list',
    params,
  )
}

/**
 * @name 查询品类列表
 */
export const getCategoryList = (params) => {
  return userService.post<ResultData<{ categoryList: Category[] }>>(
    PORT1 + '/web/cookbook/category/list',
    params,
  )
}

/**
 * @name 通过产品型号查询品类列表
 */
export const getCategoryListByProductModel = (params) => {
  return userService.post<ResultData<{ categoryList: Category[] }>>(
    PORT1 + '/web/cookbook/category/getCategoryByProductModel',
    params,
  )
}

export interface CountryRes<T> {
  countryInfoList: T[]
}
export interface CountryEntity {
  id: number
  countryCode: string
  displayCountry: string
  languageId: number
}

/**
 * @name 查询国家列表
 */
export const getCountries = () => {
  return userService.post<ResultData<CountryRes<CountryEntity>>>(
    PORT2 + '/h5/products/getCountries',
    {},
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
