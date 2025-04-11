import { userService } from '..'
import type { Product } from './product'

const PORT1 = 'device-api/h5/products'

// 请求响应参数（不包含data）
export interface Result {
  code: string | number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = unknown> extends Result {
  data: T
}

export interface Device {
  id: number
}

/**
 * @name 查询我的设备列表
 */
export const getDeviceListByUid = () => {
  return userService.get<ResultData<Array<Product>>>(PORT1 + '/my')
}

/**
 * @name 收藏设备
 */
export const collectProduct = (productId: number) => {
  return userService.post<ResultData<Array<Device>>>(PORT1 + '/collect', {
    productId,
  })
}
