import { cmsService } from '..'

const PORT1 = 'web/cms/device-api/h5'

// 请求响应参数（不包含data）
export interface Result {
  code: string | number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = unknown> extends Result {
  data: T
}

export interface Product {
  createTime: string
  createUid: string
  description: string
  descriptionEn: string
  id: number
  imageOssUrl: string
  manualOssUrl: string
  productModel: string
  productName: string
  productNameEn: string
  sku: string
  updateTime: string
  updateUid: string | null
}

/**
 * @name 查询产品列表
 */
export const getProductInfo = (id: number) => {
  return cmsService.get<ResultData<Product>>(PORT1 + `/products/${id}`)
}
