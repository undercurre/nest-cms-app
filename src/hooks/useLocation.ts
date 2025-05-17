import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { getCountryLanguages } from 'country-language';
import reverse from 'reverse-geocode'
// import { getCountryCode } from '@/utils/amap'
import { getISOCountryCode } from '@/utils/ggmap'


export const useLocation = () => {
  console.log(reverse.lookup(39.9, 116.4, 'CN'))

  const getLocation = async () => {
    // getCountryCode(40.7128, -74.0060)
    console.log(await getISOCountryCode(40.7128, -74.0060))
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
        countryCode.value = ''
        // getLocationByIP()
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }
  const countryCode = ref('CN')
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
        countryCode.value = ''
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
  watch(() => countryCode.value, (newVal) => {
    const locationLanguages = getCountryLanguages(newVal);
    setLocationLanguage(locationLanguages?.[0]?.iso639_1 ?? '')
  })
  const language = ref('en')
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
