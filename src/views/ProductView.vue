<script setup lang="ts">
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
    return "";
  }
  if (url.startsWith("http")) return url;
  return `${window.location.protocol}//${url}`;
};
onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  curProduct.value = res.data
})
</script>

<template>
  <div class="px-20px flex flex-col justify-around items-center">
    <img class="w-full my-10px rounded-8px" :src="getUrlConcat(curProduct?.imageOssUrl)" />

    <p class="font-bold text-20px w-full leading-30px py-10px">
      <span class="mr-8px">{{ curProduct?.productModel }}</span>
      <span>{{ curProduct?.productName }}</span>
    </p>

    <p class="text-#4B5563">{{ curProduct?.description }}</p>

    <van-button
      v-if="token"
      class="w-full mt-20px mb-10px"
      icon="plus"
      color="#FF6B6B"
      type="danger"
      @click="add2my"
      >{{$t("product.addToMyDevices")}}</van-button
    >
    <van-button
      class="w-full"
      :style="{ marginTop: token ? 0 : '20px' }"
      color="#d3d3d3"
      type="default"
      @click="downloadManual"
    >
      <template #icon>
        <div class="flex items-center">
          <img class="w-16px mr-2px" src="@/assets/images/app/download.png" />
          <span class="text-#000 text-14px">{{ $t("product.downloadInstructionManual") }}</span>
        </div>
      </template>
    </van-button>
  </div>
</template>
