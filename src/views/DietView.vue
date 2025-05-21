<script setup lang="ts">
import { getUrlConcat } from '@/utils/index'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { searchDiet, type Diet } from '@/api/modules/diet'
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
  // const categoryListRes = await getCategoryList()
  const categoryListRes = {
    data: {
      categoryList: [
        {
          type_en: 'MainDishes',
          type_zh: '主食',
        },
        {
          type_en: 'Soups',
          type_zh: '汤',
        },
        {
          type_en: 'Salads',
          type_zh: '沙拉',
        },
        {
          type_en: 'BakedGoods',
          type_zh: '烘焙',
        },
        {
          type_en: 'Appetizers/Snacks',
          type_zh: '开胃/小吃',
        },
        {
          type_en: 'VegetarianDishes',
          type_zh: '素食',
        },
        {
          type_en: 'Seafood',
          type_zh: '海鲜',
        },
        {
          type_en: 'MeatDishes',
          type_zh: '肉类',
        },
        {
          type_en: 'Breakfast',
          type_zh: '早餐',
        },
        {
          type_en: 'Noodles/Pasta',
          type_zh: '面条/意大利面',
        },
        {
          type_en: 'RiceDishes',
          type_zh: '米饭',
        },
        {
          type_en: 'HotPot',
          type_zh: '火锅',
        },
        {
          type_en: 'Desserts',
          type_zh: '甜点',
        },
        {
          type_en: 'Beverages',
          type_zh: '饮料',
        },
        {
          type_en: 'Sauces/Dips',
          type_zh: '酱汁/蘸料',
        },
        {
          type_en: 'FastFood/QuickMeals',
          type_zh: '快餐/快速餐',
        },
      ],
    },
  }
  category.value = categoryListRes.data.categoryList.map((item) => {
    return {
      label: item.type_en,
      value: item.type_en,
    }
  })
  const dietRes = await searchDiet({
    productModel: encodeURIComponent(productStore.productModel),
    pageNo: 1,
    pageSize: 9999999,
  })
  // TODO: 去掉
  // const dietRes = {
  //   code: 200,
  //   msg: 'Success',
  //   data: {
  //     cookbookList: [
  //       {
  //         id: 5,
  //         cookingTime: 60,
  //         difficultyLevel: 1,
  //         taste: 'Spicy',
  //         category: 'MainDishes',
  //         image_url:
  //           'http://mova-cook.oss-cn-shanghai.aliyuncs.com/third-party-server/avatar/auto_upload/20250429103044945.jpeg',
  //         productModelIdList: [
  //           {
  //             productId: 1,
  //             productModel: 'WT-2023',
  //           },
  //           {
  //             productId: 2,
  //             productModel: 'DS-5G',
  //           },
  //         ],
  //         cookbookNutritionList: [
  //           {
  //             category: 'calorie',
  //             quantity: '150kcal',
  //           },
  //           {
  //             category: 'fat',
  //             quantity: '1g',
  //           },
  //         ],
  //         cookbookMultiLanguageList: [
  //           {
  //             languageId: 9,
  //             languageCode: 'zh',
  //             displayLanguage: '中文',
  //             cookbookName: '清蒸鲈鱼',
  //             description: '清蒸鲈鱼是一道非常经典的粤菜，鱼肉鲜嫩，口感清爽，适合各类人群。',
  //             cookbookIngredientList: [
  //               {
  //                 id: 4,
  //                 ingredientName: '鲈鱼',
  //                 quantity: '1',
  //                 unit: 'strip',
  //               },
  //               {
  //                 id: 8,
  //                 ingredientName: '姜',
  //                 quantity: '3',
  //                 unit: 'piece',
  //               },
  //               {
  //                 id: 9,
  //                 ingredientName: '葱',
  //                 quantity: '2',
  //                 unit: 'root',
  //               },
  //               {
  //                 id: 10,
  //                 ingredientName: '蒸鱼豉油',
  //                 quantity: 'AppropriateAmount',
  //                 unit: null,
  //               },
  //               {
  //                 id: 11,
  //                 ingredientName: '料酒',
  //                 quantity: 'AppropriateAmount',
  //                 unit: null,
  //               },
  //               {
  //                 id: 12,
  //                 ingredientName: '食盐',
  //                 quantity: 'AppropriateAmount',
  //                 unit: null,
  //               },
  //               {
  //                 id: 18,
  //                 ingredientName: '测试',
  //                 quantity: 'AppropriateAmount',
  //                 unit: '',
  //               },
  //             ],
  //             cookbookStepList: [
  //               {
  //                 id: 23,
  //                 stepNum: 1,
  //                 description: '将鲈鱼清洗干净，去鳞去内脏，用刀在鱼身两侧划上几刀。',
  //               },
  //               {
  //                 id: 24,
  //                 stepNum: 2,
  //                 description: '姜切成薄片，葱切段。',
  //               },
  //               {
  //                 id: 25,
  //                 stepNum: 3,
  //                 description: '在鱼肚子里放入姜片和葱段，淋上适量料酒，腌制10分钟。',
  //               },
  //               {
  //                 id: 26,
  //                 stepNum: 4,
  //                 description: '将腌制好的鲈鱼放入蒸锅中，蒸15分钟。',
  //               },
  //               {
  //                 id: 27,
  //                 stepNum: 5,
  //                 description: '蒸好后取出，去掉鱼肚里的姜葱，淋上蒸鱼豉油。',
  //               },
  //               {
  //                 id: 28,
  //                 stepNum: 6,
  //                 description: '用葱花和姜丝装饰，热锅中倒入适量油，烧热后浇在鱼身上。',
  //               },
  //             ],
  //           },
  //           {
  //             languageId: 8,
  //             languageCode: 'en',
  //             displayLanguage: '英文',
  //             cookbookName: 'Steamed sea bass',
  //             description:
  //               'Steamed sea bass is a very classic Cantonese dish. The fish is tender and has a refreshing taste, suitable for all kinds of people.',
  //             cookbookIngredientList: [
  //               {
  //                 id: 4,
  //                 ingredientName: 'sea ​​bass',
  //                 quantity: '1',
  //                 unit: 'strip',
  //               },
  //               {
  //                 id: 8,
  //                 ingredientName: 'ginger',
  //                 quantity: '3',
  //                 unit: 'piece',
  //               },
  //               {
  //                 id: 9,
  //                 ingredientName: 'onion',
  //                 quantity: '2',
  //                 unit: 'root',
  //               },
  //               {
  //                 id: 10,
  //                 ingredientName: 'Steamed fish soy sauce',
  //                 quantity: 'AppropriateAmount',
  //                 unit: null,
  //               },
  //               {
  //                 id: 11,
  //                 ingredientName: 'cooking wine',
  //                 quantity: 'AppropriateAmount',
  //                 unit: null,
  //               },
  //               {
  //                 id: 12,
  //                 ingredientName: 'salt',
  //                 quantity: 'AppropriateAmount',
  //                 unit: null,
  //               },
  //               {
  //                 id: 18,
  //                 ingredientName: 'test',
  //                 quantity: 'AppropriateAmount',
  //                 unit: '',
  //               },
  //             ],
  //             cookbookStepList: [
  //               {
  //                 id: 23,
  //                 stepNum: 1,
  //                 description:
  //                   'Clean the sea bass, remove the scales and internal organs, and use a knife to make a few cuts on both sides of the fish.',
  //               },
  //               {
  //                 id: 24,
  //                 stepNum: 2,
  //                 description: 'Slice ginger and cut green onion into sections.',
  //               },
  //               {
  //                 id: 25,
  //                 stepNum: 3,
  //                 description:
  //                   'Put ginger slices and scallion segments into the fish belly, drizzle with appropriate amount of cooking wine, and marinate for 10 minutes.',
  //               },
  //               {
  //                 id: 26,
  //                 stepNum: 4,
  //                 description:
  //                   'Put the marinated sea bass into the steamer and steam for 15 minutes.',
  //               },
  //               {
  //                 id: 27,
  //                 stepNum: 5,
  //                 description:
  //                   'After steaming, take out the fish, remove the ginger and scallions from the fish belly, and drizzle with steamed fish soy sauce.',
  //               },
  //               {
  //                 id: 28,
  //                 stepNum: 6,
  //                 description:
  //                   'Garnish with chopped green onion and shredded ginger. Pour a proper amount of oil into a hot pan, heat it and pour it over the fish.',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //     total: 3,
  //   },
  // }
  diet.value = dietRes.data.cookbookList
  diet.value?.forEach((item) => {
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
        :url="getUrlConcat(item.image_url)"
        :title="
          item.dietMultiLanguageObj[locale || 'zh']?.cookbookName ??
          item.dietMultiLanguageObj['zh']?.cookbookName
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
