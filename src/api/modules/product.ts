import request from '..'

const PORT1 = '/mova-cms'

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
  id: number
  model: string
  name: string
  sellingPoints: string
  imageUrl: string
  manualOssUrl: string
}

/**
 * @name 查询产品列表
 */
export const getProductInfo = (id: number) => {
  return request.get<ResultData<Product>>(PORT1 + `/products/${id}`)
}
