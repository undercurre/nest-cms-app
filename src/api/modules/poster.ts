import { userService } from '..'
import { PORT1 } from '../config/servicePort'
import { ResultData } from './product'
export interface PosterProductLanguageId {
  productId: number
  languageId: number
}
export interface PosterProductLanguage extends PosterProductLanguageId {
  id: number
  productModel: string
  languageCode: string
  displayLanguage: string
}
export interface Entity {
  id: number
  title: string
  markdownSource: string
  posterProductLanguageList: PosterProductLanguage[]
  updateUserName: string
  updateTime: string
}
export interface CreateParams {
  title: string
  markdownSource: string
  posterProductLanguageList: PosterProductLanguageId[]
}
export interface UpdateParams extends Partial<CreateParams> {
  id: number
}
export interface PosterResPage<T> {
  posterList: T[]
  total: number
}
export interface DelParams {
  id: number
}
export interface PosterProductLanguageList {
  posterProductLanguageList: PosterProductLanguage[]
}

/**
 * @name 查询海报配置列表
 */
export const getPosterList = (params) => {
  return userService.post<ResultData<PosterResPage<Entity>>>(PORT1 + `/web/poster/list`, params, {
    loading: true,
  })
}

/**
 * @name 查询海报详情
 */
export const getPosterDetail = (params) => {
  return userService.get<ResultData<Entity>>(PORT1 + `/web/poster/${params.id}`)
}
