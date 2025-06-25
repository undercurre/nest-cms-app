/* eslint-disable @typescript-eslint/no-explicit-any */
export const useUserInfo2 = () => {
  function getGPUInfo() {
    try {
      const canvas = document.createElement('canvas')
      const gl: any = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

      if (!gl) {
        return {
          error: 'WebGL not supported',
          features: [],
        }
      }

      // 基础信息
      const baseInfo: any = {
        vendor: gl.getParameter(gl.VENDOR) || '',
        renderer: gl.getParameter(gl.RENDERER) || '',
        shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || '',
        unmaskedInfo: {},
      }

      // 尝试获取详细特征值
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        baseInfo.unmaskedInfo = {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        }
      }

      // 获取支持的扩展列表
      const extensions = gl.getSupportedExtensions() || []
      baseInfo.extensions = extensions

      // 获取更多特征参数
      const features = {}
      ;[
        'MAX_TEXTURE_SIZE',
        'MAX_RENDERBUFFER_SIZE',
        'MAX_VERTEX_ATTRIBS',
        'MAX_VERTEX_UNIFORM_VECTORS',
        'MAX_FRAGMENT_UNIFORM_VECTORS',
        'ALIASED_LINE_WIDTH_RANGE',
      ].forEach((param) => {
        try {
          features[param] = gl.getParameter(gl[param])
        } catch (e: any) {
          console.log('e: ', e)
          features[param] = null
        }
      })
      return {
        ...baseInfo,
        features,
      }
    } catch (error: any) {
      return {
        error: error.message,
        features: [],
      }
    }
  }
  async function generateGPUFingerprint() {
    const gpuInfo: any = getGPUInfo()
    // 使用关键特征生成哈希
    const fingerprintData = [
      gpuInfo.unmaskedInfo.renderer || gpuInfo.renderer,
      gpuInfo.features.MAX_TEXTURE_SIZE,
      gpuInfo.features.ALIASED_LINE_WIDTH_RANGE.join(','),
      gpuInfo.extensions.length,
    ].join('|')

    // 计算SHA-256哈希
    const encoder = new TextEncoder()
    const data = encoder.encode(fingerprintData)
    alert(crypto.subtle)
    console.log('crypto: ', crypto)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  return { generateGPUFingerprint }
}
