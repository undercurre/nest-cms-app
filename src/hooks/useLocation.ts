import countryIso from 'country-iso'
import getCountryISO2 from 'country-iso-3-to-2'
import { getCountryLanguages } from 'country-language'
import { onMounted, ref, watch } from 'vue'

export const useLocation = () => {
  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          wgsLat: position.coords.latitude, // WGS84坐标系纬度
          wgsLng: position.coords.longitude, // WGS84坐标系经度
          accuracy: position.coords.accuracy, // 定位精度(米)
        }
        countryCode.value = getCountryISO2(countryIso.get(coords.wgsLat, coords.wgsLng))
      },
      (error) => {
        console.error(`定位失败：${error.code}-${error.message}`)
        countryCode.value = ''
      },
      {
        enableHighAccuracy: true, // 使用高精度模式
        timeout: 30000, // 30秒超时
        maximumAge: 60000, // 缓存有效期60秒
      },
    )
  }
  const countryCode = ref('US')
  const language = ref('en')
  watch(
    () => countryCode.value,
    (newVal) => {
      const locationLanguages = getCountryLanguages(newVal)
      setLocationLanguage(locationLanguages?.[0]?.iso639_1 ?? '')
    },
  )
  const setLocationLanguage = (newLanguage) => {
    language.value = newLanguage
  }
  onMounted(() => {
    getLocation()
  })
  return {
    language,
    setLocationLanguage,
  }
}
