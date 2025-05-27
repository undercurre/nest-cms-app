import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const id = ref(1)
    const productModel = ref('')
    const posters = ref<string[]>([])

    return { id, productModel, posters }
  },
  {
    persist: true,
  },
)
