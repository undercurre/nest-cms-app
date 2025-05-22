<script setup lang="ts">
import { getUrlConcat } from '@/utils/index'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getCategoryList, searchDiet, type Diet } from '@/api/modules/diet'
import DietCard from '@/components/diet/DietCard.vue'
import TabList from '@/components/diet/TabList.vue'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { useI18n } from 'vue-i18n'

const productStore = useProductStore()
const appStore = useAppStore()
const { locale } = useI18n()

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
    const dietRes = await searchDiet({
      name: keyword.value,
      productModel: encodeURIComponent(productStore.productModel),
      pageNo: 1,
      pageSize: 9999999,
    })
    diet.value = dietRes.data.cookbookList
  },
)

async function handleCategoryChange(key: string) {
  if (key === 'all') {
    const dietRes = await searchDiet({
      productModel: encodeURIComponent(productStore.productModel),
      pageNo: 1,
      pageSize: 9999999,
    })
    diet.value = dietRes.data.cookbookList
    return
  }
  const dietRes = await searchDiet({
    category: key,
    productModel: encodeURIComponent(productStore.productModel),
    pageNo: 1,
    pageSize: 9999999,
  })
  diet.value = dietRes.data.cookbookList
}

onBeforeMount(async () => {
  const categoryListRes = await getCategoryList()
  category.value = categoryListRes.data.categoryList.map((item) => {
    return {
      label: item.typeEn,
      value: item.typeEn,
    }
  })
  const dietRes = await searchDiet({
    productModel: encodeURIComponent(productStore.productModel),
    pageNo: 1,
    pageSize: 9999999,
  })
  diet.value = dietRes.data.cookbookList
  diet.value?.forEach((item) => {
    item.dietMultiLanguageObj = {}
    item.cookbookMultiLanguageList?.forEach((row) => {
      if (row.languageCode === 'zh') {
        row.languageCode = 'zh-CN'
      }
    })
    item.dietMultiLanguageObj = item?.cookbookMultiLanguageList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
    if (!Object.keys(item.dietMultiLanguageObj).length) {
      item.dietMultiLanguageObj = {
        zh: {},
        en: {},
      }
    }
  })
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center">
    <van-search class="w-full" v-model="keyword" :placeholder="$t('diet.searchForRecipes')" />
    <TabList :list="category" @change="handleCategoryChange"></TabList>
    <div
      class="w-full grid grid-cols-2 grid-rows-[repeat(2,_minmax(100px,_209px))] gap-20px p-12px flex-1 box-border overflow-scroll"
    >
      <DietCard
        v-for="item in diet"
        :key="item.id"
        :id="item.id"
        :url="getUrlConcat(item.imageUrl)"
        :title="
          item.dietMultiLanguageObj[locale || 'en']?.cookbookName ??
          item.dietMultiLanguageObj['en']?.cookbookName
        "
        :time="item.cookingTime"
        :difficulty="item.difficultyLevel"
      ></DietCard>
    </div>
    <!-- <div class="mb-50px">
      <p class="text-#8B0000">下载APP查看更多菜谱 >>></p>
    </div> -->
  </div>
</template>
