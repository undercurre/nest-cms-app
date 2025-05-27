import { userService } from '..'
import { PORT2 } from '../config/servicePort'
import type { Product } from './product'

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
  return userService.get<ResultData<Array<Product>>>(PORT2 + '/h5/products/my')
}

/**
 * @name 收藏设备
 */
export const collectProduct = (productId: number) => {
  return userService.post<ResultData<Array<Device>>>(PORT2 + '/h5/products/collect', {
    productId,
  })
}
