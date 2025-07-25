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
      <span class="font-bold text-18px px-10px">{{ $t('introduction') }}</span>
      <p class="text-14px my-10px px-10px pre-line-content">{{ getI18NDescription() }}</p>
    </div>
    <div class="flex flex-col mt-20px" v-if="diet?.cookbookNutritionList.length">
      <span class="font-bold text-18px px-10px">{{ $t('nutrition') }}</span>
      <p
        v-for="item in diet?.cookbookNutritionList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ $t(`${item.category}`) }}{{ item.quantity ? '：' : '' }}{{ item.quantity }}
      </p>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('ingredients') }}</span>
      <div
        v-for="item in diet?.dietMultiLanguageObj[locale || 'en']?.cookbookIngredientList?.length
          ? diet?.dietMultiLanguageObj[locale || 'en']?.cookbookIngredientList
          : diet?.dietMultiLanguageObj['en']?.cookbookIngredientList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        <p>
          {{ item.ingredientName }}{{ item.quantity || item.unit ? '：' : ''
          }}{{ item.quantity === 'AppropriateAmount' ? $t(`${item.quantity}`) : item.quantity
          }}{{ item.quantity === 'AppropriateAmount' ? '' : item.unit ? $t(`${item.unit}`) : '' }}
        </p>
        <img v-if="item.ingredientImageUrl" class="w-full mt-10px" :src="item.ingredientImageUrl" />
      </div>
    </div>
    <div
      class="flex flex-col mt-20px"
      v-if="
        diet?.dietMultiLanguageObj?.[locale || 'en']?.aiCookingData?.length ||
        diet?.dietMultiLanguageObj?.['en']?.aiCookingData?.length
      "
    >
      <span class="font-bold text-18px px-10px">
        <span class="colorful-text">AI COOKING</span>
      </span>
      <VantTable
        class="text-14px my-10px px-10px"
        :columns="
          diet?.dietMultiLanguageObj?.[locale || 'en']?.aiCookingData?.length
            ? diet?.dietMultiLanguageObj[locale || 'en']?.columns
            : diet?.dietMultiLanguageObj['en']?.columns
        "
        :data="
          diet?.dietMultiLanguageObj?.[locale || 'en']?.aiCookingData?.length
            ? diet?.dietMultiLanguageObj[locale || 'en']?.aiCookingData
            : diet?.dietMultiLanguageObj['en']?.aiCookingData
        "
        :height="350"
      ></VantTable>
    </div>
    <div
      class="flex flex-col mt-20px"
      v-if="
        diet?.dietMultiLanguageObj?.[locale || 'en']?.cookbookUtensilList?.length ||
        diet?.dietMultiLanguageObj?.['en']?.cookbookUtensilList?.length
      "
    >
      <span class="font-bold text-18px px-10px">{{ $t('accessory') }}</span>
      <div class="text-14px my-10px px-10px">
        {{
          Array.from(
            diet?.dietMultiLanguageObj?.[locale || 'en']?.cookbookUtensilList?.length
              ? diet?.dietMultiLanguageObj?.[locale || 'en']?.cookbookUtensilList
              : diet?.dietMultiLanguageObj?.['en']?.cookbookUtensilList,
            ({ utensilName }) => utensilName,
          ).join('、')
        }}
      </div>
    </div>
    <div class="flex flex-col mt-20px">
      <span class="font-bold text-18px px-10px">{{ $t('steps') }}</span>
      <div
        v-for="item in diet?.dietMultiLanguageObj[locale || 'en']?.cookbookStepList?.length
          ? diet?.dietMultiLanguageObj[locale || 'en']?.cookbookStepList
          : diet?.dietMultiLanguageObj['en']?.cookbookStepList"
        :key="item.id"
        class="text-14px my-10px px-10px"
      >
        {{ item.stepNum }}、{{ item.description }}
        <img v-if="item.imageUrl" class="w-full mt-10px" :src="item.imageUrl" />
      </div>
    </div>
    <div class="flex flex-col mt-20px" v-if="getI18NDisclaimer()">
      <span class="font-bold text-18px px-10px">{{ $t('disclaimer') }}</span>
      <div class="text-14px my-10px px-10px whitespace-pre-wrap">
        <span>{{ getI18NDisclaimer() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Category, getCategoryList, getDietById, type Diet } from '@/api/modules/diet'
import { appLang } from '@/lang/app-lang'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import VantTable from 'vant-table'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()

const diet = ref<Diet>()

const { locale, t } = useI18n()
const appStore = useAppStore()
const productStore = useProductStore()
appStore.tabbarActive = route.name as string
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
  return diet.value?.taste ? t(`${diet.value?.taste}`) : ''
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

const getI18NDisclaimer = () => {
  if (productStore.productLanguageDtoList.length === 0) {
    productStore.getProductDetail4Store()
  }

  const should = productStore.productLanguageDtoList.find(
    (item) => item.languageCode === locale.value,
  )

  if (should) {
    return should.disclaimer
  } else {
    return productStore.productLanguageDtoList.find((item) => item.languageCode === 'en')
      ?.disclaimer
  }
}

onBeforeMount(async () => {
  const dietRes = await getDietById({ id: Number(route.params.id as string) })
  diet.value = dietRes.data
  if (diet.value) {
    diet.value.dietMultiLanguageObj = {}
    diet.value.dietMultiLanguageObj = diet.value?.cookbookMultiLanguageList?.reduce((acc, curr) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aiCookingData: any[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const columns: any[] = [
        {
          prop: 'portion',
          title: '分量/状态',
          minWidth: '78px',
          sortable: false,
          filterable: false,
          fixed: 'left',
          cellClass: 'test',
          thCellClass: 'thclass',
          tdCellClass: 'tdClass',
          renderHeaderCell: (h) => {
            return h(
              'div',
              {
                class: 'diagonal-box',
              },
              [
                h(
                  'span',
                  {
                    class: 'text portion',
                  },
                  t('portion1'),
                ),
                h(
                  'span',
                  {
                    class: 'text status',
                  },
                  t('status'),
                ),
              ],
            )
          },
        },
      ]
      curr.cookbookAiCookingList?.forEach((item) => {
        const portionIndex = aiCookingData.findIndex((row) => row.portion === item.quantity)
        if (portionIndex === -1) {
          aiCookingData.push({
            portion: item.quantity,
            [item.ingredientStatus]: item.cookingTime,
          })
        } else {
          Object.assign(aiCookingData[portionIndex], {
            [item.ingredientStatus]: item.cookingTime,
          })
        }
        if (columns.findIndex((row) => item.ingredientStatus === row.title) === -1) {
          columns.push({
            prop: item.ingredientStatus,
            title: item.ingredientStatus,
            sortable: false,
            filterable: false,
            cellClass: 'test',
            thCellClass: 'thclass',
            tdCellClass: 'tdClass',
            minWidth: '78px',
            renderCell: (h, { row }) => {
              return row[item.ingredientStatus] ? row[item.ingredientStatus] + t('minute') : ''
            },
          })
        }
      })
      acc[curr.languageCode] = { ...curr, aiCookingData, columns }
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

<style lang="less" scoped>
.colorful-text {
  text-transform: uppercase;
  background: linear-gradient(to right, #30cfd0 0%, #330867 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Poppins', sans-serif;
}
</style>

<style>
.diagonal-box {
  position: relative;
  width: 70px;
  height: 16px;
}

.diagonal-box::before {
  content: '';
  position: absolute;
  top: 5px;
  left: -36px;
  width: 100%;
  height: 100%;
  /* 绘制斜线，通过旋转实现，这里角度可根据容器宽高比例微调 */
  transform: skew(55deg);
  border-right: 1px solid #000; /* 斜线边框 */
}

.text {
  position: absolute;
}

.portion {
  bottom: -13px;
  left: 3px;
}

.status {
  bottom: 0;
  right: 5px;
}
</style>
