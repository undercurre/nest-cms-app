<script setup lang="ts">
import { getGuideList, type Guide } from '@/api/modules/guide'
import VideoCard from '@/components/guide/VideoCard.vue'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const guides = ref<Guide[]>()

onBeforeMount(async () => {
  const res = await getGuideList({ id: productStore.id })
  guides.value = res.data
})
</script>

<template>
  <div class="px-20px flex flex-col justify-around items-center">
    <VideoCard v-for="item in guides" :key="item.id" :resource="item"></VideoCard>
  </div>
</template>
