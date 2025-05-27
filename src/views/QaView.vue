<script lang="ts" setup>
import { Entity, getQAList } from '@/api/modules/qa'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string
const activeName = ref('qa-0')
const qaList = ref<Entity[]>([])
const { locale } = useI18n()

const keyword = ref('')
const getData = async () => {
  try {
    const res = await getQAList({
      productModel: productStore.productModel,
      pageNo: 1,
      pageSize: 9999999,
      keyword: keyword.value,
    })
    qaList.value = res.data.qaList
    qaList.value.forEach((item) => {
      item.qaMultiLanguageObj = {}
      item.qaLanguageRelationList?.forEach((item) => {
        if (item.languageCode === 'zh') {
          item.languageCode = 'zh-CN'
        }
      })
      item.qaMultiLanguageObj = item?.qaLanguageRelationList?.reduce((acc, curr) => {
        acc[curr.languageCode] = curr
        return acc
      }, {})
    })
  } catch (error) {
    console.error('获取问答列表失败:', error)
  }
}
const getI18NQuestion = (item) => {
  return (
    item?.qaMultiLanguageObj?.[locale.value]?.question ?? item?.qaMultiLanguageObj?.['en']?.question
  )
}
const getI18NAnswer = (item) => {
  return (
    item?.qaMultiLanguageObj?.[locale.value]?.answer ?? item?.qaMultiLanguageObj?.['en']?.answer
  )
}
onMounted(() => {
  getData()
})
</script>
<template>
  <van-sticky offset-top="46px">
    <van-search
      class="w-full qa-search"
      v-model="keyword"
      :placeholder="$t('qa.search')"
      @keyup.enter="getData"
    />
  </van-sticky>
  <div class="bg-#f6f6f6 p-t-12px qa-page">
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item
        :border="false"
        :title="getI18NQuestion(item)"
        v-for="(item, index) in qaList"
        :name="`qa-${index}`"
        :key="index"
      >
        {{ getI18NAnswer(item) }}
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<style lang="less">
.qa-page {
  .van-collapse {
    .van-collapse-item:first-child {
      .van-cell {
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
      }
    }
  }
}
</style>
