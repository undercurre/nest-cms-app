import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const tabbarActive = ref('product')

  return { tabbarActive }
})
