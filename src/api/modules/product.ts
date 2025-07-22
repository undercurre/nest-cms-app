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

export interface MultiLanguage {
  languageId: number
  languageCode: string
  displayLanguage: string
}
export interface ProductMultiLanguage extends MultiLanguage {
  productName: string
  description: string
  disclaimer: string
  manualOssUrl: string
  posterId?: string
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
  return userService.get<ResultData<Product>>(PORT2 + `/h5/products/${id}`)
}

export interface TabItem {
  label: string
  name: string
}
export interface LangItem {
  createTime?: string
  deleted?: string
  displayLanguage?: string
  id?: number
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
    PORT2 + `/h5/products/getLanguages`,
    {},
    { loading: true },
  )
}

// 页面配置
export interface PageConfigMultiLanguage extends MultiLanguage {
  title: string
}
export interface PageConfigEntity {
  id: number
  productIdList: number[]
  menuIdList: string[]
  pageLanguageRelationList: PageConfigMultiLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageConfigMultiLanguageObj?: any
}
/**
 * @name 查询产品的页面配置
 */
export const getPageInfoByProductId = (id: number) => {
  return userService.post<ResultData<PageConfigEntity>>(
    PORT1 + `/web/page/selectPageByProductId?productId=${id}`,
    {},
    { loading: true },
  )
}
export interface TabMultiLanguage extends MultiLanguage {
  menuName: string
}
export interface TabItem {
  menuLanguageRelationList: TabMultiLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuMultiLanguageObj?: any
  source: string
  path: string
  sort?: number
  id: string
}
export const getMenuList = (params) => {
  return userService.post<
    ResultData<{
      menuList: TabItem[]
      total: number
    }>
  >(PORT1 + `/web/menu/list`, params, { loading: true })
}
