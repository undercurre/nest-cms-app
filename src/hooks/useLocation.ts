import { useCountryCodeByLocationOrIp } from '@/stores/countryCodeByLocationOrIp'
import countryIso from 'country-iso'
import getCountryISO2 from 'country-iso-3-to-2'
import { getCountryLanguages } from 'country-language'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from './useLanguage'
export const useLocation = () => {
  const { setLanguage } = useLanguage()
  const route = useRoute()
  const countryCodeByLocationOrIp = ref('')
  const ipStore = useCountryCodeByLocationOrIp()
  const getIp = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        const ip = data.ip
        try {
          if (ip == ipStore.ip) {
            countryCodeByLocationOrIp.value = ipStore.code
            resolve(countryCodeByLocationOrIp.value)
          } else {
            await getLocationByIp(ip)
            ipStore.ip = ip
            resolve(countryCodeByLocationOrIp.value)
          }
        } catch (error) {
          reject(false)
          console.error('获取失败', error)
        }
      } catch (error) {
        reject(false)
        console.error('获取IP地址失败', error)
      }
    })
  }
  const getLocationByIp = async (ip) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`)
        const data = await response.json()
        const location = {
          latitude: data.latitude,
          longitude: data.longitude,
        }
        countryCodeByLocationOrIp.value = getCountryISO2(
          countryIso.get(location.latitude, location.longitude),
        )
        resolve(countryCodeByLocationOrIp.value)
      } catch (error) {
        reject(false)
        console.error('获取位置信息失败', error)
      }
    })
  }
  // 使用示例
  const getCountryCodeByLocationOrIp = () => {
    return new Promise((resolve) => {
      if (route.query.lang) {
        countryCodeByLocationOrIp.value = (route.query.lang as string)?.split('-')?.[1]
        resolve(countryCodeByLocationOrIp.value)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            wgsLat: position.coords.latitude, // WGS84坐标系纬度
            wgsLng: position.coords.longitude, // WGS84坐标系经度
            accuracy: position.coords.accuracy, // 定位精度(米)
          }
          countryCodeByLocationOrIp.value = getCountryISO2(
            countryIso.get(coords.wgsLat, coords.wgsLng),
          )
          resolve(countryCodeByLocationOrIp.value)
        },
        async (error) => {
          console.log('error: ', error)
          await getIp()
          resolve(countryCodeByLocationOrIp.value)
        },
        {
          enableHighAccuracy: true, // 使用高精度模式
          timeout: 30000, // 30秒超时
          maximumAge: 60000, // 缓存有效期60秒
        },
      )
    })
  }
  const getLocation = async () => {
    if (route.query.lang) {
      language.value = route.query.lang as string
      return
    }
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
  const language = ref('')
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
  watch(
    () => language.value,
    (newVal) => {
      setTimeout(() => {
        setLanguage(newVal)
      })
    },
    {
      immediate: true,
      deep: true,
    },
  )
  return {
    language,
    setLocationLanguage,
    getLocation,
    getCountryCodeByLocationOrIp,
    countryCodeByLocationOrIp,
  }
}
