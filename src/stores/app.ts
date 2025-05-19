import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const tabbarActive = ref('product')
  const token = ref('')

  return { tabbarActive, token }
})
