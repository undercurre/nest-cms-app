/* eslint-disable @typescript-eslint/no-explicit-any */
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
export interface MultiLanguage {
  languageId: number
  languageCode: string
  displayLanguage: string
}

export interface ProductModel {
  productId: number
  productModel: string
}

export interface QAResPage<T> {
  qaList: T[]
  total: number
}

export interface Entity {
  qaId: string
  languageCode: string
  question: string
  answer: string
}

export interface QAMultiLanguage extends MultiLanguage {
  answer: string
  question: string
}
export interface CreateParams {
  productModelIdList?: number[]
  productModelList?: ProductModel[]
  qaLanguageRelationList?: QAMultiLanguage[]
  qaMultiLanguageObj?: any
  result?: boolean
  qaSn?: string
  errorMsg?: string
}
export interface UpdateParams extends Partial<CreateParams> {
  id: number
}

export interface DelParams {
  id: number
}

export interface BatchCreateParams {
  qaList: CreateParams[]
}

/**
 * @name 获取列表
 */
export const getQAList = (params: {
  productModel: string
  pageIndex: number
  pageSize: number
  keyword?: string
  question?: string
  answer?: string
  languageCodes?: string[]
}) => {
  return userService.post<ResultData<Entity[]>>(`${PORT1}/web/qa/page`, params)
}
