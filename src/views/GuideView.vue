<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductInfo, type Product } from '@/api/modules/innp'
import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import VideoCard from '@/components/guide/VideoCard.vue'

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
  <div class="px-20px flex flex-col justify-around items-center">
    <VideoCard
      url="https://raw.githubusercontent.com/undercurre/Video/refs/heads/main/kitchen-demo.mp4"
      title="基础使用教程"
      description="掌握智能厨房助手的基本操作要领"
    ></VideoCard>
    <VideoCard
      url="https://raw.githubusercontent.com/undercurre/Video/refs/heads/main/kitchen-demo.mp4"
      title="基础使用教程"
      description="掌握智能厨房助手的基本操作要领"
    ></VideoCard>
    <VideoCard
      url="https://raw.githubusercontent.com/undercurre/Video/refs/heads/main/kitchen-demo.mp4"
      title="基础使用教程"
      description="掌握智能厨房助手的基本操作要领"
    ></VideoCard>
    <VideoCard
      url="https://raw.githubusercontent.com/undercurre/Video/refs/heads/main/kitchen-demo.mp4"
      title="基础使用教程"
      description="掌握智能厨房助手的基本操作要领"
    ></VideoCard>
  </div>
</template>
