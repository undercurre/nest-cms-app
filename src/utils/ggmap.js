import { Loader } from "@googlemaps/js-api-loader"

const config = {
  apiKey: "你的Google地图API_KEY",
  libraries: ["places", "geocoding"]
}

let geocoder = null

/**
 * 初始化地理编码服务
 */
const initGeocoder = async () => {
    console.log(geocoder)
  if (geocoder) return geocoder
  
  try {
    const loader = new Loader(config)
    const google = await loader.load()
    geocoder = new google.maps.Geocoder()
    return geocoder
  } catch (error) {
    console.error('Google地图初始化失败:', error)
    throw new Error('Google地图服务初始化失败')
  }
}

/**
 * 根据经纬度获取ISO国家代码
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @returns {Promise<string>} ISO 3166-1 alpha-2国家代码
 */
export const getISOCountryCode = async (latitude, longitude) => {
    console.log(latitude, longitude)
  try {
    const geocoder = await initGeocoder()
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
            console.log(results)
          if (status === "OK") {
            if (results[0]) {
              // 查找地址组件中的国家信息
              const countryComponent = results[0].address_components.find(
                component => component.types.includes("country")
              )
              
              if (countryComponent) {
                resolve(countryComponent.short_name) // 返回ISO 3166-1 alpha-2代码
              } else {
                reject(new Error("未找到国家信息"))
              }
            } else {
              reject(new Error("未获取到地理编码结果"))
            }
          } else {
            reject(new Error(`地理编码失败: ${status}`))
          }
        }
      )
    })
  } catch (error) {
    console.error('获取国家代码失败:', error)
    throw error
  }
}

/**
 * 获取完整地址信息
 */
export const getFullAddress = async (latitude, longitude) => {
  const geocoder = await initGeocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0]
          const countryComponent = address.address_components.find(
            c => c.types.includes("country")
          )
          
          resolve({
            isoCountryCode: countryComponent?.short_name || null,
            country: countryComponent?.long_name || null,
            formattedAddress: address.formatted_address,
            addressComponents: address.address_components
          })
        } else {
          reject(new Error(status || "获取地址信息失败"))
        }
      }
    )
  })
}