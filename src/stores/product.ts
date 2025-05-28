import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const id = ref(1)
    const productModel = ref('')
    const posterImageUrls = ref<string[]>([])

    return { id, productModel, posterImageUrls }
  },
  {
    persist: true,
  },
)
