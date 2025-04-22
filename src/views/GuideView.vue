<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import { getGuideList, type Guide } from '@/api/modules/guide'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const guides = ref<Guide[]>()
const videoUrl = ref(0)

onBeforeMount(async () => {
  const res = await getGuideList()
  guides.value = res.data
  videoUrl.value = res.data?.[0]?.video
})
// 切换视频
const playVideo = (e) => {
  videoUrl.value = guides.value?.[e]?.video
}
</script>

<template>
  <div class="flex flex-col justify-around items-center">
    <van-sticky>
      <VideoPlayerBox :url="videoUrl" v-if="videoUrl" />
    </van-sticky>
    <VideoList :list="guides" @play="playVideo" />
  </div>
</template>
