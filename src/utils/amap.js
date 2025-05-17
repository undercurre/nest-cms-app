import AMapLoader from '@amap/amap-jsapi-loader'

// 设置高德地图安全密钥 (2021年12月后必填)
window._AMapSecurityConfig = {
  securityJsCode: '70c21b56dbb176fc0f43c6ce24dac7a3'
}

let geocoder = null

/**
 * 初始化高德地图地理编码器
 */
export const initGeocoder = async () => {
  if (geocoder) return geocoder
  
  try {
    const AMap = await AMapLoader.load({
      key: 'b4bedad975bb17dbb5a22ef146f2a94a',
      version: '2.0',
      plugins: ['AMap.Geocoder']
    })
    
    geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    })
    
    return geocoder
  } catch (error) {
    console.error('高德地图加载失败:', error)
    throw error
  }
}

/**
 * 根据经纬度获取国家代码
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @returns {Promise<string>} 国家代码(ISO 3166-1 alpha-2)
 */
export const getCountryCode = async (latitude, longitude) => {
  try {
    const geocoder = await initGeocoder()
    
    return new Promise((resolve, reject) => {
      geocoder.getAddress([longitude, latitude], (status, result) => {
        console.log(result)
        if (status === 'complete' && result.info === 'OK') {
          const countryCode = result.regeocode.addressComponent.countryCode
          console.log(countryCode)
          resolve(countryCode)
        } else {
          reject(new Error(result.info || '获取地址信息失败'))
        }
      })
    })
  } catch (error) {
    console.error('获取国家代码失败:', error)
    throw error
  }
}