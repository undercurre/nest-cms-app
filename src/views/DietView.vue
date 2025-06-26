<script setup lang="ts">
import { getUrlConcat } from '@/utils/index'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { AiCookbook, getAiCookbookList } from '@/api/modules/aiDiet'
import {
  getCategoryListByProductModel,
  searchDiet,
  type Category,
  type Diet,
} from '@/api/modules/diet'
import DietCard from '@/components/diet/DietCard.vue'
import { useCountryList } from '@/hooks/useCountryList'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { useUserInfoStore } from '@/stores/userInfo'
import { useI18n } from 'vue-i18n'

const productStore = useProductStore()
const appStore = useAppStore()
const { locale } = useI18n()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const keyword = ref<string | undefined>('')

const category = ref<Category[]>([])

const diet = ref<Diet[]>([])
const categoryId = ref<string | number | undefined>('')

const { getCurrentCountryCode } = useCountryList()
watch(
  () => keyword.value,
  async () => {
    if (cookbookType.value === 'ai-cookbook') {
      aiDietList.value = []
      category.value = []
      diet.value = []
      pageConfig.value = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      }
      isLoading.value = false
      hasMoreData.value = true
      loadAiDietData()
    } else {
      getDiet()
    }
  },
)

async function handleCategoryChange(key: string) {
  categoryId.value = key
  getDiet()
}
const getDiet = async () => {
  const countryId = await getCurrentCountryCode()
  diet.value = []
  const dietRes = await searchDiet({
    categoryId: categoryId.value || undefined,
    cookbookName: keyword.value || undefined,
    productModel: productStore.productModel,
    pageNo: 1,
    pageSize: 9999999,
    countryId,
  })
  diet.value = dietRes.data.cookbookList
  diet.value?.forEach((item) => {
    item.dietMultiLanguageObj = {}
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
}

const getCategory = async (item) => {
  const countryId = await getCurrentCountryCode()
  diet.value = []
  category.value = []
  return new Promise(async (resolve, reject) => {
    try {
      const dietRes = await searchDiet({
        categoryId: item.id,
        cookbookName: keyword.value || undefined,
        productModel: productStore.productModel,
        pageNo: 1,
        pageSize: 9999999,
        countryId,
      })
      const categoryListRes = await getCategoryListByProductModel({
        id: item.id,
        productModel: productStore.productModel,
      })
      category.value = categoryListRes.data.categoryList
      category.value?.forEach((item) => {
        item.categoryMultiLanguageObj = item?.categoryLanguageRelationList?.reduce((acc, curr) => {
          acc[curr.languageCode] = curr
          return acc
        }, {})
        if (!Object.keys(item.categoryMultiLanguageObj).length) {
          item.categoryMultiLanguageObj = {
            zh: {},
            en: {},
          }
        }
      })
      if (dietRes.data.total) {
        category.value.unshift(item)
        diet.value = dietRes.data.cookbookList
        diet.value?.forEach((item) => {
          item.dietMultiLanguageObj = {}
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
        category.value.sort((a, b) => Number(b.existCookbook) - Number(a.existCookbook))
        const index = category.value.findIndex((item) => item.existCookbook)
        if (index > -1) {
          categoryId.value = category.value?.[index]?.id
        } else {
          categoryId.value = category.value?.[0]?.id
        }
        resolve(false)
      } else {
        category.value.sort((a, b) => Number(b.existCookbook) - Number(a.existCookbook))
        const index = category.value.findIndex((item) => item.existCookbook)
        if (index > -1) {
          categoryId.value = category.value?.[index]?.id
        } else {
          categoryId.value = category.value?.[0]?.id
        }
        if (!categoryId.value) {
          diet.value = []
        }
        resolve(categoryId.value)
      }
    } catch (err) {
      reject(err)
    }
  })
}
const cookbookType = ref<string | undefined>('')
const aiDietList = ref<AiCookbook[]>([])
const userInfoStore = useUserInfoStore()
const pageConfig = ref({
  pageNo: 1,
  pageSize: 20,
  total: 0,
})
const listRef = ref(null)
const isLoading = ref(false)
const hasMoreData = ref(true)
// 处理滚动事件
const handleScroll = () => {
  if (!listRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = listRef.value
  // 当滚动到距离底部 100px 时加载更多数据
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadAiDietData()
  }
}
const loadAiDietData = async () => {
  if (isLoading.value || !hasMoreData.value) return
  isLoading.value = true
  const res = await getAiCookbookList({
    pageNo: pageConfig.value.pageNo,
    pageSize: pageConfig.value.pageSize,
    cookbookName: keyword.value || undefined,
    ingredient: keyword.value || undefined,
    likeOrder: 'DESC',
    commentOrder: 'DESC',
    userId: userInfoStore.id,
    clientType: 2,
  })
  aiDietList.value = [...aiDietList.value, ...(res.data.aiCookbookList || [])]
  pageConfig.value.total = res.data.total
  // 判断是否还有更多数据
  hasMoreData.value = pageConfig.value.total > aiDietList.value.length

  if (pageConfig.value.pageNo === 1) {
    document.querySelector('#ai-diet-list-box')?.removeEventListener('scroll', handleScroll)
    nextTick(() => {
      // 监听滚动
      document.querySelector('#ai-diet-list-box')?.addEventListener('scroll', handleScroll)
    })
  }
  if (hasMoreData.value) {
    pageConfig.value.pageNo++
  }

  isLoading.value = false
  aiDietList.value?.forEach((item) => {
    item.aiCookbookMultiLanguageObj = item?.aiCookbookLanguageList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
    if (!Object.keys(item.aiCookbookMultiLanguageObj).length) {
      item.aiCookbookMultiLanguageObj = {
        zh: {},
        en: {},
      }
    }
  })
}
const changeSide = async (item) => {
  if (item === 'ai-cookbook') {
    cookbookType.value = item
    category.value = []
    diet.value = []
    pageConfig.value = {
      pageNo: 1,
      pageSize: 20,
      total: 0,
    }
    isLoading.value = false
    hasMoreData.value = true
    loadAiDietData()
  } else {
    cookbookType.value = ''
    aiDietList.value = []
    const res = await getCategory(item)
    if (res) {
      getDiet()
    }
  }
}
onBeforeUnmount(() => {
  document.querySelector('#ai-diet-list-box')?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center">
    <van-search class="w-full" v-model="keyword" :placeholder="$t('searchForRecipes')" />
    <SideTabList @changeSide="changeSide">
      <div class="w-78vw">
        <TabList
          :list="category"
          :cur="categoryId"
          @change="handleCategoryChange"
          class="m-b-12px"
        ></TabList>
        <div v-if="diet?.length && !cookbookType" class="overflow-scroll diet-list-box">
          <div
            class="w-full grid grid-cols-2 grid-rows-[repeat(2,_minmax(100px,_180px))] gap-12px p-x-12px p-b-12px flex-1 box-border"
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
        </div>
        <div
          v-else-if="aiDietList?.length && cookbookType"
          class="overflow-scroll ai-diet-list-box"
          id="ai-diet-list-box"
        >
          <div
            class="w-full grid grid-cols-2 gap-12px p-x-12px p-b-12px flex-1 box-border"
            ref="listRef"
          >
            <AiDietCard
              v-for="item in aiDietList"
              :key="item.id"
              :id="item.id"
              :cookbookName="
                item.aiCookbookMultiLanguageObj[locale || 'en']?.cookbookName ??
                item.aiCookbookMultiLanguageObj['en']?.cookbookName
              "
              v-model:isLiked="item.isLiked"
              v-model:likeCount="item.likeCount"
              :isCommented="item.isCommented"
              :commentCount="item.commentCount"
            ></AiDietCard>
          </div>
          <!-- 加载中状态 -->
          <div class="loading-state py-8px text-center text-12px" v-show="isLoading">
            <p class="mt-2 text-gray-500">{{ $t('loadMore') }}</p>
          </div>
          <!-- 没有更多数据 -->
          <div
            class="no-more-data py-8px text-center text-gray-500 text-12px"
            v-show="!isLoading && hasMoreData === false"
          >
            <p>{{ $t('noMore') }}</p>
          </div>
        </div>
        <EmptyData v-else :description="cookbookType ? `${$t('noAiDietDataTips')}` : ''" />
      </div>
    </SideTabList>
  </div>
</template>

<style lang="less" scoped>
.diet-list-box {
  height: calc(100vh - 197px);
}
.ai-diet-list-box {
  height: calc(100vh - 175px);
}
</style>
