import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInfoStore = defineStore(
  'userInfo',
  () => {
    const id = ref('')
    const name = ref('')

    return { id, name }
  },
  {
    persist: true,
  },
)
