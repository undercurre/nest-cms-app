<template>
  <div class="flex w-full">
    <van-sidebar v-model="active" @change="onChange" class="side-tab-list">
      <van-sidebar-item
        :title="
          item?.categoryMultiLanguageObj?.[(locale === 'zh-CN' ? 'zh' : locale) ?? 'en']
            ?.categoryName ?? item?.categoryMultiLanguageObj?.['en']?.categoryName
        "
        v-for="item in category"
        :key="item.id"
      />
    </van-sidebar>
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { getCategoryList, type Category } from '@/api/modules/diet'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['changeSide'])
const active = ref(0)
const { locale } = useI18n()
const category = ref<Category[]>([])
onBeforeMount(async () => {
  const categoryListRes = await getCategoryList({
    categoryLevel: 1,
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
  emits('changeSide', category.value?.[0])
})
const onChange = (index) => {
  emits('changeSide', category.value[index])
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
