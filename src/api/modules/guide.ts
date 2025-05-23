import { userService } from '..'

const PORT1 = '/kitchen-app-api/kitchen-app-server'

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

export interface GuideMultiLanguage extends MultiLanguage {
  title: string
  description: string
  videoUrl: string
}

export interface Guide {
  id: number
  createdAt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productModelIdList?: any
  guideLanguageDtoList?: GuideMultiLanguage[]
  guideLanguageRelationList?: GuideMultiLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guideMultiLanguageObj?: any
}

/**
 * @name 获取列表
 */
export const getGuideList = (params: {
  productModel: string
  pageNo: number
  pageSize: number
}) => {
  return userService.post<
    ResultData<{
      guideList: Guide[]
      total: number
    }>
  >(`${PORT1}/web/guide/list`, params)
}

/**
 * @name 获取id的guide
 */
export const getGuideById = (params: { id: number }) => {
  return userService.get<ResultData<Guide>>(`${PORT1}/web/guide/${params.id}`)
}
