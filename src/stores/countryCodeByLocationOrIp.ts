import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCountryCodeByLocationOrIp = defineStore(
  'countryCode',
  () => {
    const code = ref('')
    const ip = ref('')
    return { code, ip }
  },
  {
    persist: true,
  },
)
