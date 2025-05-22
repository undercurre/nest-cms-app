import { userService } from '..'

const PORT1 = 'device-api/mova-device/h5'

// 请求响应参数（不包含data）
export interface Result {
  code: string | number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = unknown> extends Result {
  data: T
}

export interface ProductMultiLanguage {
  languageId: number
  languageCode: string
  displayLanguage: string
  productName: string
  description: string
  manualOssUrl: string
}
export interface Product {
  createTime: string
  createUid: string
  id: number
  imageOssUrl: string
  productModel: string
  sku: string
  updateTime: string
  updateUid: string | null
  productLanguageRelationList?: ProductMultiLanguage[]
  productLanguageDtoList?: ProductMultiLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productMultiLanguageObj: any
}

/**
 * @name 查询产品列表
 */
export const getProductInfo = (id: number) => {
  return userService.get<ResultData<Product>>(PORT1 + `/products/${id}`)
}

export interface TabItem {
  label: string
  name: string
}
export interface LangItem {
  createTime?: string
  deleted?: string
  displayLanguage?: string
  id?: string
  languageCode?: string
  updateTime?: string
  text?: string
  value?: string
}
export interface LangRes {
  languageInfoList: LangItem[]
}
/**
 * @name 查询产品语言列表
 */
export const getProductLanguageList = () => {
  return userService.post<ResultData<LangRes>>(
    PORT1 + `/products/getLanguages`,
    {},
    { loading: true },
  )
}
