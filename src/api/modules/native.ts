// 返回原生页面

import { callNative } from '../native'

export const goBack2Native = async () => {
  callNative('jsHandler', 'goBack')
}
