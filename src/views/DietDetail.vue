<template>
  <div class="flex flex-col">
    <img class="w-full" :src="diet?.imageUrl" />
    <div class="flex flex-col items-center justify-center mt-20px">
      <p class="text-center font-bold text-20px my-10px">{{ getI18NDietName() }}</p>
      <span
        v-if="diet?.category"
        class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px text-[--vt-c-text-light-2]"
        >{{ $t(`cookbook.${diet?.category}`) }}</span
      >
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.introduction') }}</span>
      <p class="text-14px my-10px px-10px pre-line-content">{{ getI18NDescription() }}</p>
    </div>
    <div class="flex flex-col mt-20px">
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
          item.quantity === 'AppropriateAmount' ? '' : item.unit ? $t(`cookbook.${item.unit}`) : ''
        }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.steps') }}</span>
      <p
        v-for="item in diet?.dietMultiLanguageObj[locale || 'en']?.cookbookStepList ??
        diet?.dietMultiLanguageObj['en']?.cookbookStepList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ item.stepNum }}、{{ item.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getDietById, type Diet } from '@/api/modules/diet'
import { useAppStore } from '@/stores/app'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('route: ', route)

const diet = ref<Diet>()

const { locale } = useI18n()
const appStore = useAppStore()
appStore.tabbarActive = 'diet'

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
    diet.value.cookbookMultiLanguageList?.forEach((item) => {
      if (item.languageCode === 'zh') {
        item.languageCode = 'zh-CN'
      }
    })
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
})
</script>
