import { type CountryEntity, getCountries } from '@/api/modules/diet'
import { appLang } from '@/lang/app-lang'
import { showToast } from 'vant'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCountryCodeByLocationOrIp } from '../stores/countryCodeByLocationOrIp'
import { useLanguageList } from './useLanguageList'

export function useCountryList() {
  const countryInfoList = ref<CountryEntity[]>([])
  const { locale } = useI18n()
  const { getLanguageList, languageList } = useLanguageList()
  const getCountryList = async () => {
    return new Promise(async (resolve, reject) => {
      if (!localStorage.getItem('countryInfoList')) {
        try {
          const res = await getCountries()
          localStorage.setItem('countryInfoList', JSON.stringify(res?.data?.countryInfoList ?? ''))
        } catch (error) {
          console.log('error: ', error)
          reject(error)
        }
      }
      countryInfoList.value = JSON.parse(localStorage.getItem('countryInfoList') ?? '')
      resolve(countryInfoList.value)
    })
  }
  const countryCode = useCountryCodeByLocationOrIp()
  // 匹配当前语言的国家id
  // 定位的地区 > ip地区 > 默认语言
  const getCurrentCountryCode = async () => {
    await getCountryList()
    if (countryCode.code) {
      const country = countryInfoList.value.find((item) => item.countryCode === countryCode.code)
      const countryId = country?.id
      if (!localStorage.getItem('displayCountry')) {
        localStorage.setItem('displayCountry', country?.displayCountry || '')
        showToast(`定位到您的位置为:${country?.displayCountry}`)
      }
      return countryId
    }
    await getLanguageList()
    const languageId = languageList.value.find(
      (item) => item.languageCode === (appLang[locale.value] ?? locale.value ?? 'en'),
    )?.id
    const country = countryInfoList.value.find((item) => item.languageId === languageId)
    const countryId = country?.id
    if (!localStorage.getItem('displayCountry')) {
      localStorage.setItem('displayCountry', country?.displayCountry || '')
      showToast(`定位到您的位置为:${country?.displayCountry}`)
    }
    return countryId
  }
  return {
    getCountryList,
    countryInfoList,
    getCurrentCountryCode,
  }
}
