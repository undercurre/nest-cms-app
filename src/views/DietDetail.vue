<template>
  <div class="flex flex-col">
    <img class="w-full" :src="diet?.imageUrl" />
    <div class="flex flex-col items-center justify-center mt-20px">
      <p class="text-center font-bold text-20px my-10px">{{ getI18NDietName() }}</p>
      <div class="flex gap-10px">
        <span
          v-if="diet?.categoryId && categoryName"
          class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px text-[--vt-c-text-light-2]"
          >{{ categoryName }}</span
        >
        <span
          v-if="diet?.taste"
          class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px text-[--vt-c-text-light-2]"
          >{{ tasteName }}</span
        >
      </div>
    </div>
    <div class="flex flex-col mt-20px" v-if="getI18NDescription()">
      <span class="font-bold text-18px px-10px">{{ $t('diet.introduction') }}</span>
      <p class="text-14px my-10px px-10px pre-line-content">{{ getI18NDescription() }}</p>
    </div>
    <div class="flex flex-col mt-20px" v-if="diet?.cookbookNutritionList.length">
      <span class="font-bold text-18px px-10px">{{ $t('cookbook.nutrition') }}</span>
      <p
        v-for="item in diet?.cookbookNutritionList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ $t(`cookbook.${item.category}`) }}{{ item.quantity ? '：' : '' }}{{ item.quantity }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.ingredients') }}</span>
      <p
        v-for="item in diet?.dietMultiLanguageObj[locale || 'en']?.cookbookIngredientList ??
        diet?.dietMultiLanguageObj['en']?.cookbookIngredientList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ item.ingredientName }}{{ item.quantity || item.unit ? '：' : ''
        }}{{
          item.quantity === 'AppropriateAmount' ? $t(`cookbook.${item.quantity}`) : item.quantity
        }}{{
          item.quantity === 'AppropriateAmount'
            ? ''
            : item.unit
              ? $t(`cookbook.units.${item.unit}`)
              : ''
        }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.steps') }}</span>
      <div
        v-for="item in diet?.dietMultiLanguageObj[locale || 'en']?.cookbookStepList ??
        diet?.dietMultiLanguageObj['en']?.cookbookStepList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ item.stepNum }}、{{ item.description }}
        <img v-if="item.imageUrl" class="w-full mt-10px" :src="item.imageUrl" />
      </div>
    </div>
    <div
      class="flex flex-col mt-20px"
      v-if="
        diet?.dietMultiLanguageObj?.[locale || 'en']?.cookbookUtensilList?.length ||
        diet?.dietMultiLanguageObj?.['en']?.cookbookUtensilList?.length
      "
    >
      <span class="font-bold text-18px px-10px">{{ $t('cookbook.accessory') }}</span>
      <div class="text-14px my-10px px-10px">
        {{
          Array.from(
            diet?.dietMultiLanguageObj?.[locale || 'en']?.cookbookUtensilList ??
              diet?.dietMultiLanguageObj?.['en']?.cookbookUtensilList,
            ({ utensilName }) => utensilName,
          ).join('、')
        }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Category, getCategoryList, getDietById, type Diet } from '@/api/modules/diet'
import { appLang } from '@/lang/app-lang'
import { useAppStore } from '@/stores/app'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('route: ', route)

const diet = ref<Diet>()

const { locale, t } = useI18n()
const appStore = useAppStore()
appStore.tabbarActive = 'diet'
const category = ref<Category[]>([])
const getCategory = async () => {
  const categoryListRes = await getCategoryList({
    categoryLevel: 1,
  })
  const categoryListRes1 = await getCategoryList({
    categoryLevel: 2,
  })
  category.value = [...categoryListRes.data.categoryList, ...categoryListRes1.data.categoryList]
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
}

const tasteName = computed(() => {
  return diet.value?.taste ? t(`cookbook.${diet.value?.taste}`) : ''
})

const categoryName = computed(() => {
  return (
    category.value.find((item) => item.id === diet.value?.categoryId)?.categoryMultiLanguageObj[
      (appLang[locale.value] ?? locale.value) || 'en'
    ]?.categoryName ??
    category.value.find((item) => item.id === diet.value?.categoryId)?.categoryMultiLanguageObj[
      'en'
    ]?.categoryName
  )
})
const getI18NDietName = () => {
  return (
    diet.value?.dietMultiLanguageObj[locale.value || 'en']?.cookbookName ??
    diet.value?.dietMultiLanguageObj['en']?.cookbookName
  )
}

const getI18NDescription = () => {
  return (
    diet.value?.dietMultiLanguageObj[locale.value || 'en']?.description ??
    diet.value?.dietMultiLanguageObj['en']?.description
  )
}

onBeforeMount(async () => {
  const dietRes = await getDietById({ id: Number(route.params.id as string) })
  diet.value = dietRes.data
  if (diet.value) {
    diet.value.dietMultiLanguageObj = {}
    diet.value.dietMultiLanguageObj = diet.value?.cookbookMultiLanguageList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
    if (!Object.keys(diet.value?.dietMultiLanguageObj).length) {
      diet.value.dietMultiLanguageObj = {
        zh: {},
        en: {},
      }
    }
  }
  getCategory()
})
</script>
