<template>
  <div class="flex flex-col">
    <img class="w-full" :src="diet?.image" />
    <div class="flex flex-col items-center justify-center mt-20px">
      <p class="text-center font-bold text-20px my-10px">{{ getI18NDietName() }}</p>
      <span class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px">{{
        $t(`cookbook.${diet?.category}`)
      }}</span>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.introduction') }}</span>
      <p class="text-14px my-10px px-10px">{{ getI18NDescription() }}</p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.ingredients') }}</span>
      <p v-for="item in ingredients" :key="item.id" class="text-14px my-10px px-10px">
        {{ getI18NIngredientsName(item) }}：{{
          item.quantity === 'AppropriateAmount' ? $t(`cookbook.${item.quantity}`) : item.quantity
        }}{{ item.quantity === 'AppropriateAmount' ? '' : $t(`cookbook.${item.unit}`) }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.steps') }}</span>
      <p v-for="item in steps" :key="item.id" class="text-14px my-10px px-10px">
        {{ item.step_number }}、{{ getI18NStepDescription(item) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Ingredients, Steps } from '@/api/modules/diet'
import { getDietById, getIngredients, getSteps, type Diet } from '@/api/modules/diet'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()

const diet = ref<Diet>()
const ingredients = ref<Ingredients[]>()
const steps = ref<Steps[]>()

const { locale } = useI18n()

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
</script>
