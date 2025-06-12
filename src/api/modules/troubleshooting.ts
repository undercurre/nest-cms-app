/* eslint-disable @typescript-eslint/no-explicit-any */
import { userService } from '..'
import { PORT1 } from '../config/servicePort'
import { ResultData } from './guide'

// 请求响应参数（不包含data）
export interface TroubleshootingResPage<T> {
  troubleshootingList: T[]
  total: number
}
export interface TroubleshootingEntity {
  id: number
  createdAt?: string
  troubleshootingLanguageList?: TroubleshootingMultiLanguage[]
  troubleshootingMultiLanguageObj?: any
}

export interface MultiLanguage {
  languageId: number
  languageCode: string
  displayLanguage: string
}

export interface TroubleshootingMultiLanguage extends MultiLanguage {
  phenomenon: string
  solution: string
}
export interface CreateParams {
  troubleshootingLanguageList?: TroubleshootingMultiLanguage[]
  troubleshootingMultiLanguageObj?: any
  result?: boolean
  troubleshootingSn?: string
  errorMsg?: string
}

export interface UpdateParams extends Partial<CreateParams> {
  id: number
}

export interface DelParams {
  id: number
}

export interface BatchCreateParams {
  troubleshootingList: CreateParams[]
}
/**
 * @name 获取列表
 */
export const getTroubleshootingList = (params: {
  productModel: string
  pageNo: number
  pageSize: number
  phenomenon?: string
  solution?: string
}) => {
  return userService.post<ResultData<TroubleshootingResPage<TroubleshootingEntity>>>(
    `${PORT1}/web/troubleshooting/list`,
    params,
  )
}
