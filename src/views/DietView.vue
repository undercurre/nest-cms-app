<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductInfo, type Product } from '@/api/modules/innp'

import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const curProduct = ref<Product>()

onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  console.log(res)
  curProduct.value = res.data
})
</script>

<template>
  <div class="px-20px flex flex-col justify-around items-center">食谱</div>
</template>
