<template>
  <div class="flex w-full">
    <van-sidebar v-model="active" @change="onChange" class="side-tab-list">
      <van-sidebar-item
        :title="
          item?.categoryMultiLanguageObj?.[appLang[locale] ?? locale ?? 'en']?.categoryName ??
          item?.categoryMultiLanguageObj?.['en']?.categoryName
        "
        v-for="item in category"
        :key="item.id"
        :disabled="!item.existCookbook"
      />
      <van-sidebar-item :title="$t('AiDiet')" :key="'ai-cookbook'" />
    </van-sidebar>
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { getCategoryListByProductModel, type Category } from '@/api/modules/diet'
import { appLang } from '@/lang/app-lang'
import { useProductStore } from '@/stores/product'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const emits = defineEmits(['changeSide'])
const route = useRoute()
const active = ref(0)
const { locale } = useI18n()
const category = ref<Category[]>([])
const productStore = useProductStore()
onBeforeMount(async () => {
  const categoryListRes = await getCategoryListByProductModel({
    categoryLevel: 1,
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
  // category.value.sort((a, b) => Number(b.existCookbook) - Number(a.existCookbook))
  category.value = category.value.filter((item) => item.existCookbook)
  const index = category.value.findIndex((item) => item.existCookbook)
  if (route.query.tab === 'ai-cookbook') {
    active.value = category.value.length
    emits('changeSide', 'ai-cookbook')
  } else {
    active.value = index
    if (index > -1) {
      emits('changeSide', category.value?.[index])
    } else {
      emits('changeSide', category.value?.[0])
    }
  }
})
const onChange = (index) => {
  if (category.value[index]) {
    emits('changeSide', category.value[index])
  } else {
    emits('changeSide', 'ai-cookbook')
  }
}
</script>

<style lang="less" scoped>
.side-tab-list {
  height: calc(100vh - 150px);
  background: #f7f8fa;
  margin-right: 4px;
  .van-sidebar-item {
    padding: 12px 8px;
  }
  .van-sidebar-item::before {
    background: transparent;
  }
}
</style>
