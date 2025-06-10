<script setup lang="ts">
import { getGuideList, type Guide } from '@/api/modules/guide'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { getUrlConcat } from '@/utils'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const guides = ref<Guide[]>()
const videoUrl = ref<string>('')
const { locale } = useI18n()

onBeforeMount(async () => {
  const res = await getGuideList({
    productModel: productStore.productModel,
    pageNo: 1,
    pageSize: 9999999,
  })
  guides.value = res.data.guideList
  guides.value.forEach((item) => {
    item.guideMultiLanguageObj = {}
    item.guideMultiLanguageObj = item?.guideLanguageRelationList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
  })
  videoUrl.value = getUrlConcat(
    guides.value?.[0]?.guideMultiLanguageObj?.[locale.value]?.videoUrl ??
      guides.value?.[0]?.guideMultiLanguageObj?.['en']?.videoUrl,
  )
})
// 切换视频
const playVideo = (e: number) => {
  videoUrl.value = getUrlConcat(
    guides.value?.[e]?.guideMultiLanguageObj?.[locale.value]?.videoUrl ??
      guides.value?.[e]?.guideMultiLanguageObj?.['en']?.videoUrl,
  )
}
</script>

<template>
  <div class="flex flex-col justify-around items-center">
    <van-sticky v-show="guides?.length">
      <VideoPlayerBox :url="videoUrl" />
    </van-sticky>
    <VideoList :list="guides" @play="playVideo" />
    <EmptyData v-if="!guides?.length" />
  </div>
</template>
