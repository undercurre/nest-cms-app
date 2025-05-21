import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGuideStore = defineStore(
  'guide',
  () => {
    const guide = ref({})

    return { guide }
  },
  {
    persist: true,
  },
)
