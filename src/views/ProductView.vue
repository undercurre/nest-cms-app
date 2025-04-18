<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductInfo, type Product } from '@/api/modules/product'

import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import router from '@/router'
import { collectProduct } from '@/api/modules/list'
import { showSuccessToast } from 'vant'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const token = typeof route.query.token === 'string' ? decodeURIComponent(route.query.token) : '' // 类型断言
if (token) {
  localStorage.setItem('token', token)
  appStore.token = token
}

const curProduct = ref<Product>()

const downloadManual = () => {
  if (!curProduct.value) return
  const a = document.createElement('a')
  a.href = getUrlConcat(curProduct.value.manualOssUrl)
  a.download = `${curProduct.value.productModel}-${curProduct.value.productName}说明书.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const add2my = async () => {
  const res = await collectProduct(Number(productId))
  console.log(res)
  showSuccessToast($t('product.successfullyAdded'))
  router.push('/list')
}
// url加http前缀
const getUrlConcat = (url: string) => {
  if (!url) {
    return ''
  }
  if (url.startsWith('http')) return url
  return `${window.location.protocol}//${url}`
}
onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  curProduct.value = res.data
})
</script>

<template>
  <div class="px-16px flex flex-col justify-around items-center">
    <img class="w-full my-10px rounded-8px" :src="getUrlConcat(curProduct?.imageOssUrl)" />

    <p class="font-bold text-20px pt-5px w-full leading-30px">
      <span>{{ curProduct?.productModel }} 系列</span>
    </p>
    <p class="text-#bbbcbb text-16px w-full">{{ curProduct?.productName }}</p>
    <p class="mt-18px text-#454d5c text-16px w-full flex items-center">
      <Icon icon="icon-park-solid:correct" class="text-#2296f3" width="16" height="16" />
      <span class="ml-12px">{{ curProduct?.description }}</span>
    </p>

    <!-- v-if="token" -->
    <div class="flex flex-row justify-between w-full items-center">
      <van-button class="w-48%" icon="like" color="#fe4080" type="danger" @click="add2my">{{
        $t('product.addToMyDevices')
      }}</van-button>

      <!-- :style="{ marginTop: token ? 0 : '20px' }" -->
      <van-button class="w-48%" color="#2196f3" type="default" @click="downloadManual">
        <template #icon>
          <div class="flex items-center">
            <Icon icon="icomoon-free:download2" class="mr-4px" width="16" height="16" />
            <span class="text-#fff text-14px">{{ $t('product.downloadInstructionManual') }}</span>
          </div>
        </template>
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
