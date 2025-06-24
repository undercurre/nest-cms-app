/**
 * AI菜谱
 */

import { userService } from '..'
import { PORT1 } from '../config/servicePort'
import { MultiLanguage, ResultData } from './product'

// AiCookbookStep 对象
export interface AiCookbookStep {
  id: number // 步骤主键ID
  stepNum: number // 步骤序号
  description: string // 步骤描述
}

// AiCookbookNote 对象
export interface AiCookbookNote {
  id: number // 注意事项主键ID
  noteNum: number // 注意事项序号
  description: string // 注意事项描述
}

// AiCookbookProduct 对象
export interface AiCookbookProduct {
  id: number // 产品主键ID
  productName: string // 产品名称
}

// AiCookbookIngredient 对象
export interface AiCookbookIngredient {
  id: number // 食材主键ID
  ingredient: string // 食材
}

// AiCookbookLanguage 对象
export interface AiCookbookLanguage extends MultiLanguage {
  id: number // 多语言主键ID
  cookbookName: string // AI食谱名
  description: string // 描述/简介
  aiCookbookIngredientList: AiCookbookIngredient[] // 食材列表
  aiCookbookStepList: AiCookbookStep[] // 步骤列表
  aiCookbookNoteList: AiCookbookNote[] // 注意事项列表
  aiCookbookProductList: AiCookbookProduct[] // 推荐产品列表
}

// AiCookbook 对象
export interface AiCookbook {
  id: number // AI食谱主键ID
  likeCount: number // 点赞总数
  commentCount: number // 评论总数
  isLiked: boolean // 是否点赞
  isCommented: boolean // 是否评论
  aiCookbookLanguageList: AiCookbookLanguage[] // AI食谱多语言列表
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aiCookbookMultiLanguageObj?: any // 多语言对象
}

// 响应参数
export interface AiCookbookResponse {
  aiCookbookList: AiCookbook[] // AI食谱列表
  total: number // 总数
}
// Ranking 对象类型定义
export interface Ranking {
  // 国家，类型为字符串，必填
  displayCountry: string
  // 点赞总数，类型为长整型，必填
  total: number
}

// 响应参数类型定义
export interface RankingResponse {
  // 排行榜列表，类型为 Ranking 对象数组，必填
  rankingList: Ranking[]
}

// AiCookbookComment 对象类型
export interface AiCookbookComment {
  id: number // 评论主键ID
  userId: string // 用户ID
  userName: string // 用户名
  comment: string // 评论内容
  countryCode: string // 国家码
  createTime: string // 创建时间（LocalDateTime 类型在 TS 中一般用 string 或 Date 表示，根据实际情况调整）
}

// 响应参数类型
export interface AiCookbookCommentResponse {
  aiCookbookCommentList: AiCookbookComment[] // 评论列表
  total: number // 总数
}
/**
 * AI菜谱
 */

/**
 * @name 查询AI菜谱列表
 */
export const getAiCookbookList = (params) => {
  return userService.post<ResultData<AiCookbookResponse>>(PORT1 + `/web/aiCookbook/list`, params)
}

/**
 * 创建点赞接口
 */
export const createAiCookbookLike = (params) => {
  return userService.post(PORT1 + `/web/aiCookbook/like/create`, params)
}

/**
 * @name 获取AI菜谱详情
 */
export const getAiCookbookDetail = (params) => {
  return userService.post<ResultData<AiCookbook>>(`${PORT1}/web/aiCookbook/getAiCookbook`, params)
}

/**
 * @name 分页查询评论接口
 */
export const getAiCookbookCommentList = (params) => {
  return userService.post<ResultData<AiCookbookCommentResponse>>(
    `${PORT1}/web/aiCookbook/comment/list`,
    params,
  )
}

/**
 * @name 创建评论接口
 */
export const createAiCookbookComment = (params) => {
  return userService.post<ResultData<AiCookbookCommentResponse>>(
    `${PORT1}/web/aiCookbook/comment/create`,
    params,
  )
}
