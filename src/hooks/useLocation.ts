import axios from 'axios'
import { countries } from 'iso-3166-1-alpha-2'
import { onMounted, ref } from 'vue'
console.log('countries: ', countries)

// import { useI18n } from 'vue-i18n'

export const useLocation = () => {
  // const { t, locale } = useI18n()
  const location = ref()

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          wgsLat: position.coords.latitude, // WGS84坐标系纬度
          wgsLng: position.coords.longitude, // WGS84坐标系经度
          accuracy: position.coords.accuracy, // 定位精度(米)
        }
        reverseGeocode(coords.wgsLat, coords.wgsLng)
        // 北京
        reverseGeocode(39.9, 116.4)
        reverseGeocode(coords.wgsLat, coords.wgsLng)
      },
      (error) => {
        console.error(`定位失败：${error.code}-${error.message}`)
        // this.fallbackIPLocation(); // 降级使用IP定位
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }
  const countryCode = ref('')
  // 反向地理编码，将坐标转换为地址信息
  function reverseGeocode(lat, lng) {
    // 使用Nominatim OpenStreetMap的API
    axios
      .get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => {
        const address = response.data.address
        console.log('address: ', address)
        countryCode.value = response.data.address.country_code.toUpperCase()
      })
      .catch((error) => {
        console.log('error: ', error)
        countryCode.value = 'US'
        // 反向地理编码失败，降级使用IP定位
        // getLocationByIP()
      })
  }

  // // 通过IP地址获取位置
  // function getLocationByIP() {
  //   // 使用ip-api.com的免费API
  //   axios
  //     .get('http://ip-api.com/json/?fields=status,message,country,countryCode')
  //     .then((response) => {
  //       if (response.data.status === 'success') {
  //         countryCode.value = response.data.countryCode.toUpperCase()
  //       } else {
  //         // resultDiv.innerHTML += `<br>IP定位失败: ${response.data.message}`;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('error: ', error)
  //       // resultDiv.innerHTML += `<br>IP定位请求失败: ${error.message}`;
  //     })
  // }

  const setLocation = (newLocation) => {
    location.value = newLocation
  }
  const language = ref('en')
  const setLanguage = (newLanguage) => {
    language.value = newLanguage
  }
  onMounted(() => {
    getLocation()
  })
  return {
    location,
    setLocation,
    language,
    setLanguage,
  }
}
