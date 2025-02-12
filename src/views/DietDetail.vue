<template>
  <div class="flex flex-col">
    <img class="w-full" :src="diet?.image" />
    <div class="flex flex-col items-center justify-center mt-20px">
      <p class="text-center font-bold text-20px my-10px">{{ diet?.name }}</p>
      <span class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px">{{
        diet?.category
      }}</span>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">简介</span>
      <p class="text-14px my-10px px-10px">{{ diet?.description }}</p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">食材</span>
      <p v-for="item in ingredients" :key="item.id" class="text-14px my-10px px-10px">
        {{ item.name }}：{{ item.quantity }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">步骤</span>
      <p v-for="item in steps" :key="item.id" class="text-14px my-10px px-10px">
        {{ item.step_number }}、{{ item.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Ingredients, Steps } from '@/api/modules/diet'
import { getDietById, getIngredients, getSteps, type Diet } from '@/api/modules/diet'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const diet = ref<Diet>()
const ingredients = ref<Ingredients[]>()
const steps = ref<Steps[]>()

onBeforeMount(async () => {
  const dietRes = await getDietById({ id: Number(route.params.id as string) })
  diet.value = dietRes.data
  const ingredientsRes = await getIngredients(Number(route.params.id as string))
  ingredients.value = ingredientsRes.data
  const stepsRes = await getSteps(Number(route.params.id as string))
  steps.value = stepsRes.data
})
</script>
