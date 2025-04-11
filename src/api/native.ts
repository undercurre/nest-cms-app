declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler<T = unknown>(methodName: string, ...args: unknown[]): Promise<T>
    }
  }
}

/**
 * 调用原生功能的 Promise 封装
 * @param {string} methodName 方法名
 * @param {...any} args 参数
 * @returns {Promise<any>}
 */
export function callNative<T = unknown>(methodName: string, ...args: unknown[]) {
  return new Promise((resolve, reject) => {
    const callId = Math.random().toString(36).substring(2, 9) // 生成唯一调用ID
    const startTime = performance.now()
    if (!window.flutter_inappwebview) {
      console.log('Native bridge not available')
      reject(new Error('Native bridge not available'))
      return
    }
    console.log('callNative', methodName, ...args)
    window.flutter_inappwebview
      .callHandler<T>(methodName, ...args)
      .then((result) => {
        const duration = (performance.now() - startTime).toFixed(2)
        console.debug(`[${callId}] 调用成功 (${duration}ms): ${methodName}`, result)
        resolve(result)
      })
      .catch((error) => {
        const duration = (performance.now() - startTime).toFixed(2)
        console.error(`[${callId}] 调用失败 (${duration}ms): ${methodName}`, error, `\n参数:`, args)
        reject(enhanceError(error, methodName, args))
      })
  })
}

const enhanceError = (error: unknown, methodName: string, args: unknown[]) => {
  console.log(error, methodName, args)
}

// 使用示例
// callNative("getUserInfo", { userId: 123 })
//   .then(data => console.log("User data:", data))
//   .catch(err => console.error("Error:", err));
