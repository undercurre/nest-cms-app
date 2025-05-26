<script setup lang="ts">
import { getProductInfo, type Product } from '@/api/modules/product'
import { getUrlConcat } from '@/utils/index'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { collectProduct, getDeviceListByUid } from '@/api/modules/list'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

let token = typeof route.query.token === 'string' ? route.query.token : '' // 类型断言
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
  if (window.flutter_inappwebview) {
    const dataStr = JSON.stringify({
      title: curProduct.value.productModel,
      pdfUrl: curProduct.value?.productMultiLanguageObj?.[locale.value]?.manualOssUrl,
    })
    window.flutter_inappwebview.callHandler('jsHandler', dataStr)
    return
  }
  const a = document.createElement('a')
  a.href = getUrlConcat(curProduct.value?.productMultiLanguageObj?.[locale.value]?.manualOssUrl)
  a.download = `${curProduct.value.productModel}-${curProduct.value?.productMultiLanguageObj?.[locale.value]?.productName}说明书.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const { t, locale } = useI18n()
const add2my = async () => {
  if (!isCollected.value) {
    await collectProduct(Number(productId))
    showSuccessToast(t('product.successfullyAdded'))
  }
  router.push('/list')
}

const getI18NProductName = () => {
  return curProduct.value?.productMultiLanguageObj?.[locale.value]
    ? curProduct.value?.productMultiLanguageObj?.[locale.value]?.productName
    : curProduct.value?.productMultiLanguageObj?.['en']?.productName
}

const getI18NDescription = () => {
  return curProduct.value?.productMultiLanguageObj?.[locale.value]
    ? curProduct.value?.productMultiLanguageObj?.[locale.value]?.description
    : curProduct.value?.productMultiLanguageObj?.['en']?.description
}
const deviceList = ref<Product[]>([])
const isCollected = computed(() => {
  return deviceList.value.some((item) => item.id === Number(productId))
})
onBeforeMount(async () => {
  const res = await getProductInfo(Number(productId))
  curProduct.value = { ...res.data, productMultiLanguageObj: {} }
  productStore.productModel = res.data?.productModel
  curProduct.value.productLanguageDtoList?.forEach((item) => {
    if (item.languageCode === 'zh') {
      item.languageCode = 'zh-CN'
    }
  })
  curProduct.value.productMultiLanguageObj = curProduct.value?.productLanguageDtoList?.reduce(
    (acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    },
    {},
  )
  const deviceListRes = await getDeviceListByUid()
  deviceList.value = deviceListRes.data
})
</script>

<template>
  <div class="px-20px flex flex-col justify-around items-center pb-10px">
    <img class="w-full my-10px rounded-8px" :src="getUrlConcat(curProduct?.imageOssUrl ?? '')" />
    <LanguageSwitcher />
    <p class="font-bold text-20px w-full leading-30px py-10px">
      <span class="mr-8px">{{ curProduct?.productModel }}</span>
      <span>{{ getI18NProductName() }}</span>
    </p>

    <p class="text-#4B5563 pre-line-content">{{ getI18NDescription() }}</p>

    <van-button
      v-if="token"
      class="w-full mt-20px! mb-10px"
      :icon="isCollected ? 'like' : 'plus'"
      color="#FF6B6B"
      type="danger"
      @click="add2my"
      >{{ isCollected ? $t('list.myCollection') : $t('product.addToMyDevices') }}</van-button
    >
    <van-button
      :class="['w-full', 'mt-20px!']"
      color="#d3d3d3"
      type="default"
      @click="downloadManual"
    >
      <template #icon>
        <div class="flex items-center">
          <img class="w-16px mr-2px" src="@/assets/images/app/download.png" />
          <span class="text-#000 text-14px">{{ $t('product.downloadInstructionManual') }}</span>
        </div>
      </template>
    </van-button>
  </div>
</template>
