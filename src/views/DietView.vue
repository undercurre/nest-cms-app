<script setup lang="ts">
import { getUrlConcat } from '@/utils/index'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

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
    getDiet()
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
const changeSide = async (item) => {
  const res = await getCategory(item)
  if (res) {
    getDiet()
  }
}
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
        <div v-if="diet?.length" class="overflow-scroll diet-list-box">
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
        <EmptyData v-else />
      </div>
    </SideTabList>
  </div>
</template>

<style lang="less" scoped>
.diet-list-box {
  height: calc(100vh - 197px);
}
</style>
