<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductInfo, type Product } from '@/api/modules/innp'

const route = useRoute()
const productId = route.params.id // 获取路径参数

console.log('产品Id', productId)

const curProduct = ref<Product>()

onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  console.log(res)
  curProduct.value = res.data
})
</script>

<template>
  <div class="w-full min-h-vh p-20px flex flex-col justify-around items-center">
    <p class="text-20px text-center">{{ curProduct?.model }}</p>

    <img class="w-full my-20px" :src="curProduct?.imageUrl" />

    <p class="text-14px my-20px">{{ curProduct?.sellingPoints }}</p>

    <div class="bg-#F2D09D rounded-full w-60% h-50px text-#fff text-center leading-50px my-20px">
      <a class="text-#fff" :href="curProduct?.manualOssUrl">下载说明书</a>
    </div>
  </div>
</template>
