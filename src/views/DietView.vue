<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import TabList from '@/components/diet/TabList.vue'
import DietCard from '@/components/diet/DietCard.vue'
import { getCategoryList, searchDiet, type Diet } from '@/api/modules/diet'
import { getUrlConcat } from '@/utils'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const keyword = ref('')

const category = ref<{ label: string; value: string }[]>([])

const diet = ref<Diet[]>([])

watch(
  () => keyword.value,
  async () => {
    const dietRes = await searchDiet({ name: keyword.value })
    diet.value = dietRes.data
  },
)

async function handleCategoryChange(key: string) {
  if (key === 'all') {
    const dietRes = await searchDiet({})
    diet.value = dietRes.data
    return
  }
  const dietRes = await searchDiet({ category: key })
  diet.value = dietRes.data
}

onBeforeMount(async () => {
  const categoryListRes = await getCategoryList()
  category.value = categoryListRes.data.map((item) => {
    return { label: item, value: item }
  })
  const dietRes = await searchDiet({})
  diet.value = dietRes.data
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center">
    <van-search class="w-full" v-model="keyword" :placeholder="$t('diet.searchForRecipes')" />
    <TabList :list="category" @change="handleCategoryChange"></TabList>
    <div class="w-full grid grid-cols-2 gap-12px px-12px pb-12px box-border overflow-scroll">
      <DietCard
        v-for="item in diet"
        :key="item.id"
        :id="item.id"
        :url="getUrlConcat(item.image)"
        :title="item.name"
        :time="item.time"
        :difficulty="item.difficulty"
      ></DietCard>
    </div>
    <!-- <div class="mb-50px">
      <p class="text-#8B0000">下载APP查看更多菜谱 >>></p>
    </div> -->
  </div>
</template>
