import { cmsService } from '..'

const PORT1 = '/mova-cms/guide'

// 请求响应参数（不包含data）
export interface Result {
  code: string | number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = unknown> extends Result {
  data: T
}

export interface Guide {
  id: number
  video: string
  title: string
  title_en: string
  description: string
  description_en: string
  createdAt: string
  duration?: string
}

/**
 * @name 获取列表
 */
export const getGuideList = () => {
  return cmsService.get<ResultData<Guide[]>>(PORT1)
}

/**
 * @name 获取id的guide
 */
export const getGuideById = (params: { id: number }) => {
  return cmsService.get<ResultData<Guide>>(`${PORT1}/${params.id}`)
}
