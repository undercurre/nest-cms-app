<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductInfo, type Product } from '@/api/modules/product'

import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string
console.log(route.name)

const curProduct = ref<Product>()

const downloadManual = () => {
  if (!curProduct.value) return
  const a = document.createElement('a')
  a.href = curProduct.value.manualOssUrl
  a.download = `${curProduct.value.model}-${curProduct.value.name}说明书.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  console.log(res)
  curProduct.value = res.data
})
</script>

<template>
  <div class="px-20px flex flex-col justify-around items-center">
    <img class="w-full my-10px rounded-8px" :src="curProduct?.imageUrl" />

    <p class="font-bold text-20px w-full leading-30px py-10px">
      <span class="mr-8px">{{ curProduct?.model }}</span>
      <span>{{ curProduct?.name }}</span>
    </p>

    <p class="text-#4B5563">{{ curProduct?.sellingPoints }}</p>

    <van-button class="w-full mt-20px mb-10px" icon="plus" color="#FF6B6B" type="danger"
      >添加到我的设备</van-button
    >
    <van-button class="w-full" color="#d3d3d3" type="default" @click="downloadManual">
      <template #icon>
        <div class="flex items-center">
          <img class="w-16px mr-2px" src="@/assets/images/app/download.png" />
          <span class="text-#000 text-14px">下载说明书</span>
        </div>
      </template>
    </van-button>
  </div>
</template>
