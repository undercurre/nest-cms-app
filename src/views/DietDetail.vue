<template>
  <div class="flex flex-col color-#000 mb-12px">
    <div class="relative">
      <img class="w-full" :src="getUrlConcat(diet?.image)" @error="imgError" />
      <div
        class="absolute bottom-4px left-0 w-full flex px-10px py-14px text-12px mt-4px shadow-box"
      >
        <div class="flex items-center mr-8px text-#fff">
          <Icon icon="weui:time-outlined" width="16" height="16" />
          <span class="ml-4px">{{ diet?.time }}{{ $t('diet.minute') }}</span>
        </div>
        <div class="flex items-center mr-8px text-#fff ml-6px">
          <Icon icon="material-symbols:groups-rounded" width="16" height="16" />
          <span class="text-12px ml-4px">{{ $t('diet.serves', { num: 2 }) }}</span>
        </div>
        <div class="flex items-center mr-8px text-#fff ml-6px">
          <Icon icon="carbon:skill-level-advanced" width="16" height="16" />
          <span class="text-12px ml-4px">{{ formatDifficulty(diet?.difficulty) }}</span>
        </div>
        <div class="flex items-center mr-8px text-#fff ml-6px">
          <Icon icon="fluent-color:star-16" width="16" height="16" />
          <span class="text-12px ml-4px">4.5</span>
        </div>
      </div>
      <van-button
        class="rounded-16px absolute bottom--11px right-12px bg-#ff4181 border-0 p-4px color-#fff w-32px h-32px"
      >
        <Icon icon="lsicon:label-outline" width="16" height="16" class="mt-5px" />
        <!-- <Icon icon="lsicon:label-filled" width="16" height="16" class="mt-5px" /> -->
      </van-button>
    </div>
    <div class="flex flex-col items-center justify-center mt-20px">
      <p class="text-center font-bold text-20px my-10px">{{ getI18NDietName() }}</p>
      <span class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px">{{
        $t(`cookbook.${diet?.category}`)
      }}</span>
    </div>
    <div class="flex flex-col mt-20px px-12px">
      <span class="font-bold text-18px mb-10px">{{ $t('diet.introduction') }}</span>
      <p class="text-14px my-10px">{{ getI18NDescription() }}</p>
    </div>
    <div class="flex flex-col mt-20px px-12px">
      <span class="font-bold text-18px mb-10px">{{ $t('diet.ingredients') }}</span>
      <p
        v-for="item in ingredients"
        :key="item.id"
        class="bg-#f9fafc p-10px text-14px my-5px rounded-8px"
      >
        {{
          item.quantity.toUpperCase() === 'APPROPRIATE AMOUNT'
            ? $t(`cookbook.AppropriateAmount`)
            : item.quantity
        }}{{ locale === 'zh-CN' ? '' : ' '
        }}{{
          item.quantity.toUpperCase() === 'APPROPRIATE AMOUNT' ? '' : $t(`cookbook.${item.unit}`)
        }}{{ locale === 'zh-CN' ? '' : ' ' }}{{ getI18NIngredientsName(item) }}
      </p>
    </div>
    <div class="flex flex-col mt-20px px-12px">
      <span class="font-bold text-18px mb-10px">{{ $t('diet.steps') }}</span>
      <div
        v-for="item in steps"
        :key="item.id"
        class="flex items-start bg-#f9fafc p-10px text-14px my-5px rounded-8px"
      >
        <div class="step-circle">{{ item.step_number }}</div>
        <div class="flex-1">{{ getI18NStepDescription(item) }}</div>
      </div>
    </div>

    <div class="flex flex-col mt-20px px-12px">
      <span class="font-bold text-18px mb-10px">{{ $t('diet.nutritionFacts') }}</span>
      <div class="bg-#f9fafc rounded-8px p-10px">
        <div
          class="w-full flex items-center justify-between my-5px"
          v-for="(item, index) in diet?.nutrition_info"
          :key="index"
        >
          <p>{{ $t('diet.' + index) }}</p>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { Ingredients, Steps } from '@/api/modules/diet'
import { getDietById, getIngredients, getSteps, type Diet } from '@/api/modules/diet'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUrlConcat } from '@/utils'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import defaultImg from '@/assets/images/app/default-food.png'

const route = useRoute()

const appStore = useAppStore()
appStore.tabbarActive = 'diet'
const diet = ref<Diet>()
const ingredients = ref<Ingredients[]>()
const steps = ref<Steps[]>()

const { locale, t } = useI18n()

const getI18NDietName = () => {
  if (diet.value) {
    if (locale.value === 'zh-CN') {
      return diet.value.name
    } else {
      return diet.value.name_en
    }
  }
}

const getI18NDescription = () => {
  if (diet.value) {
    if (locale.value === 'zh-CN') {
      return diet.value.description
    } else {
      return diet.value.description_en
    }
  }
}

const getI18NIngredientsName = (ingredient: Ingredients) => {
  if (ingredient) {
    if (locale.value === 'zh-CN') {
      return ingredient.name
    } else {
      return ingredient.name_en
    }
  }
}

const getI18NStepDescription = (step: Steps) => {
  if (step) {
    if (locale.value === 'zh-CN') {
      return step.description
    } else {
      return step.description_en
    }
  }
}

onBeforeMount(async () => {
  const dietRes = await getDietById({ id: Number(route.params.id as string) })
  diet.value = dietRes.data
  const ingredientsRes = await getIngredients(Number(route.params.id as string))
  ingredients.value = ingredientsRes.data
  const stepsRes = await getSteps(Number(route.params.id as string))
  steps.value = stepsRes.data
})
function formatDifficulty(level: number) {
  const map: Record<number, string> = {
    1: t('diet.easy'),
    2: t('diet.normal'),
    3: t('diet.hard'),
  }

  return map[level]
}
function imgError(event) {
  const img = event.srcElement
  img.src = defaultImg
  img.onerror = null // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
}
</script>

<style scoped lang="less">
.step-circle {
  background: #2196f3;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  color: #ffffff;
  text-align: center;
  padding: 2px 0;
  margin-right: 10px;
}
.shadow-box {
  background: linear-gradient(rgba(47, 61, 62, 0), rgba(47, 61, 62, 0.5));
}
</style>
