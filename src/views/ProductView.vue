<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductInfo, type Product } from '@/api/modules/product'
import { getUrlConcat } from '@/utils'

import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import router from '@/router'
import { collectProduct } from '@/api/modules/list'
import { showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

let token = typeof route.query.token === 'string' ? decodeURIComponent(route.query.token) : '' // 类型断言
if (token) {
  localStorage.setItem('token', token)
  appStore.token = token
} else {
  const localToken = localStorage.getItem('token')
  if (localToken) {
    appStore.token = localToken
    token = localToken
  }
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

const { t } = useI18n()
const add2my = async () => {
  const res = await collectProduct(Number(productId))
  console.log(res)
  showSuccessToast(t('product.successfullyAdded'))
  router.push('/list')
}

const { locale } = useI18n()

const getI18NProductName = () => {
  if (curProduct.value) {
    if (locale.value === 'zh-CN') {
      return curProduct.value.productName
    } else {
      return curProduct.value.productName_en
    }
  }
}

const getI18NDescription = () => {
  if (curProduct.value) {
    if (locale.value === 'zh-CN') {
      return curProduct.value.description
    } else {
      return curProduct.value.description_en
    }
  }
}

onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  curProduct.value = res.data
})
</script>

<template>
  <div class="px-12px flex flex-col justify-around items-center">
    <img class="w-full my-10px rounded-8px" :src="getUrlConcat(curProduct?.imageOssUrl ?? '')" />

    <p class="font-bold text-20px pt-5px w-full leading-30px">
      <span>{{ curProduct?.productModel }} {{ curProduct?.productModel ? '系列' : '' }}</span>
    </p>
    <p class="text-#bbbcbb text-16px w-full">{{ getI18NProductName() }}</p>
    <p class="mt-18px text-#454d5c text-16px w-full flex items-center">
      <Icon
        icon="icon-park-solid:correct"
        class="text-#2296f3"
        width="16"
        height="16"
        v-if="curProduct?.description"
      />
      <span class="ml-12px">{{ getI18NDescription() }}</span>
    </p>

    <div class="flex flex-row justify-between w-full items-center button-bar">
      <van-button
        class="w-48%"
        icon="like"
        color="#fe4080"
        type="danger"
        @click="add2my"
        v-if="token && curProduct"
        >{{ $t('product.addToMyDevices') }}</van-button
      >
      <van-button
        :class="[token ? 'w-48%' : 'w-full']"
        color="#2196f3"
        type="default"
        @click="downloadManual"
        v-if="curProduct"
      >
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

<style lang="less" scoped>
.button-bar {
  position: fixed;
  width: 100%;
  bottom: 64px;
  padding: 0 16px;
}
</style>
