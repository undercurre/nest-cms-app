<template>
  <div class="flex flex-col">
    <img class="w-full" :src="diet?.image_url" />
    <div class="flex flex-col items-center justify-center mt-20px">
      <p class="text-center font-bold text-20px my-10px">{{ getI18NDietName() }}</p>
      <span
        class="text-12px bg-#ddd leading-12px rounded-20px font-bold p-10px text-[--vt-c-text-light-2]"
        >{{ $t(`cookbook.${diet?.category}`) }}</span
      >
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.introduction') }}</span>
      <p class="text-14px my-10px px-10px">{{ getI18NDescription() }}</p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('cookbook.nutrition') }}</span>
      <p
        v-for="item in diet?.cookbookNutritionList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ $t(`cookbook.${item.category}`) }}：{{ item.quantity }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.ingredients') }}</span>
      <p
        v-for="item in diet?.dietMultiLanguageObj[locale || 'zh']?.cookbookIngredientList ??
        diet?.dietMultiLanguageObj['zh']?.cookbookIngredientList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ item.ingredientName }}：{{
          item.quantity === 'AppropriateAmount' ? $t(`cookbook.${item.quantity}`) : item.quantity
        }}{{ item.quantity === 'AppropriateAmount' ? '' : $t(`cookbook.${item.unit}`) }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('diet.steps') }}</span>
      <p
        v-for="item in diet?.dietMultiLanguageObj[locale || 'zh']?.cookbookStepList ??
        diet?.dietMultiLanguageObj['zh']?.cookbookStepList"
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
    diet.value?.dietMultiLanguageObj[locale.value || 'zh']?.cookbookName ??
    diet.value?.dietMultiLanguageObj['zh']?.cookbookName
  )
}

const getI18NDescription = () => {
  return (
    diet.value?.dietMultiLanguageObj[locale.value || 'zh']?.description ??
    diet.value?.dietMultiLanguageObj['zh']?.description
  )
}

onBeforeMount(async () => {
  const dietRes = await getDietById({ id: Number(route.params.id as string) })
  // TODO: 去掉
  // const dietRes = {
  //   data: {
  //     id: 5,
  //     cookingTime: 60,
  //     difficultyLevel: 1,
  //     taste: 'Spicy',
  //     category: 'MainDishes',
  //     image_url:
  //       'http://mova-cook.oss-cn-shanghai.aliyuncs.com/third-party-server/avatar/auto_upload/20250429103044945.jpeg',
  //     productModelIdList: [
  //       {
  //         productId: 1,
  //         productModel: 'WT-2023',
  //       },
  //       {
  //         productId: 2,
  //         productModel: 'DS-5G',
  //       },
  //     ],
  //     cookbookNutritionList: [
  //       {
  //         category: 'calorie',
  //         quantity: '150kcal',
  //       },
  //       {
  //         category: 'fat',
  //         quantity: '1g',
  //       },
  //     ],
  //     cookbookMultiLanguageList: [
  //       {
  //         languageId: 9,
  //         languageCode: 'zh',
  //         displayLanguage: '中文',
  //         cookbookName: '清蒸鲈鱼',
  //         description: '清蒸鲈鱼是一道非常经典的粤菜，鱼肉鲜嫩，口感清爽，适合各类人群。',
  //         cookbookIngredientList: [
  //           {
  //             id: 4,
  //             ingredientName: '鲈鱼',
  //             quantity: '1',
  //             unit: 'strip',
  //           },
  //           {
  //             id: 8,
  //             ingredientName: '姜',
  //             quantity: '3',
  //             unit: 'piece',
  //           },
  //           {
  //             id: 9,
  //             ingredientName: '葱',
  //             quantity: '2',
  //             unit: 'root',
  //           },
  //           {
  //             id: 10,
  //             ingredientName: '蒸鱼豉油',
  //             quantity: 'AppropriateAmount',
  //             unit: null,
  //           },
  //           {
  //             id: 11,
  //             ingredientName: '料酒',
  //             quantity: 'AppropriateAmount',
  //             unit: null,
  //           },
  //           {
  //             id: 12,
  //             ingredientName: '食盐',
  //             quantity: 'AppropriateAmount',
  //             unit: null,
  //           },
  //           {
  //             id: 18,
  //             ingredientName: '测试',
  //             quantity: 'AppropriateAmount',
  //             unit: '',
  //           },
  //         ],
  //         cookbookStepList: [
  //           {
  //             id: 23,
  //             stepNum: 1,
  //             description: '将鲈鱼清洗干净，去鳞去内脏，用刀在鱼身两侧划上几刀。',
  //           },
  //           {
  //             id: 24,
  //             stepNum: 2,
  //             description: '姜切成薄片，葱切段。',
  //           },
  //           {
  //             id: 25,
  //             stepNum: 3,
  //             description: '在鱼肚子里放入姜片和葱段，淋上适量料酒，腌制10分钟。',
  //           },
  //           {
  //             id: 26,
  //             stepNum: 4,
  //             description: '将腌制好的鲈鱼放入蒸锅中，蒸15分钟。',
  //           },
  //           {
  //             id: 27,
  //             stepNum: 5,
  //             description: '蒸好后取出，去掉鱼肚里的姜葱，淋上蒸鱼豉油。',
  //           },
  //           {
  //             id: 28,
  //             stepNum: 6,
  //             description: '用葱花和姜丝装饰，热锅中倒入适量油，烧热后浇在鱼身上。',
  //           },
  //         ],
  //       },
  //       {
  //         languageId: 8,
  //         languageCode: 'en',
  //         displayLanguage: '英文',
  //         cookbookName: 'Steamed sea bass',
  //         description:
  //           'Steamed sea bass is a very classic Cantonese dish. The fish is tender and has a refreshing taste, suitable for all kinds of people.',
  //         cookbookIngredientList: [
  //           {
  //             id: 4,
  //             ingredientName: 'sea ​​bass',
  //             quantity: '1',
  //             unit: 'strip',
  //           },
  //           {
  //             id: 8,
  //             ingredientName: 'ginger',
  //             quantity: '3',
  //             unit: 'piece',
  //           },
  //           {
  //             id: 9,
  //             ingredientName: 'onion',
  //             quantity: '2',
  //             unit: 'root',
  //           },
  //           {
  //             id: 10,
  //             ingredientName: 'Steamed fish soy sauce',
  //             quantity: 'AppropriateAmount',
  //             unit: null,
  //           },
  //           {
  //             id: 11,
  //             ingredientName: 'cooking wine',
  //             quantity: 'AppropriateAmount',
  //             unit: null,
  //           },
  //           {
  //             id: 12,
  //             ingredientName: 'salt',
  //             quantity: 'AppropriateAmount',
  //             unit: null,
  //           },
  //           {
  //             id: 18,
  //             ingredientName: 'test',
  //             quantity: 'AppropriateAmount',
  //             unit: '',
  //           },
  //         ],
  //         cookbookStepList: [
  //           {
  //             id: 23,
  //             stepNum: 1,
  //             description:
  //               'Clean the sea bass, remove the scales and internal organs, and use a knife to make a few cuts on both sides of the fish.',
  //           },
  //           {
  //             id: 24,
  //             stepNum: 2,
  //             description: 'Slice ginger and cut green onion into sections.',
  //           },
  //           {
  //             id: 25,
  //             stepNum: 3,
  //             description:
  //               'Put ginger slices and scallion segments into the fish belly, drizzle with appropriate amount of cooking wine, and marinate for 10 minutes.',
  //           },
  //           {
  //             id: 26,
  //             stepNum: 4,
  //             description: 'Put the marinated sea bass into the steamer and steam for 15 minutes.',
  //           },
  //           {
  //             id: 27,
  //             stepNum: 5,
  //             description:
  //               'After steaming, take out the fish, remove the ginger and scallions from the fish belly, and drizzle with steamed fish soy sauce.',
  //           },
  //           {
  //             id: 28,
  //             stepNum: 6,
  //             description:
  //               'Garnish with chopped green onion and shredded ginger. Pour a proper amount of oil into a hot pan, heat it and pour it over the fish.',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // }
  diet.value = dietRes.data
  if (diet.value) {
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
