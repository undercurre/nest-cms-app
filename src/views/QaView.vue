<script lang="ts" setup>
import { Entity, getQAList } from '@/api/modules/qa'
import { appLang } from '@/lang/app-lang'
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
      pageIndex: 1,
      pageSize: 9999999,
      question: keyword.value,
      answer: keyword.value,
      keyword: keyword.value,
      languageCodes: locale.value ? [appLang[locale.value] ?? locale.value ?? 'en'] : [],
    })
    qaList.value = res.data
  } catch (error) {
    console.error('获取问答列表失败:', error)
  }
}
onMounted(() => {
  getData()
})
</script>
<template>
  <div>
    <van-sticky offset-top="46px">
      <van-search
        class="w-full qa-search"
        v-model="keyword"
        :placeholder="$t('qa.search')"
        @search="getData"
        @blur="getData"
      />
    </van-sticky>
    <div class="bg-#f6f6f6 p-t-12px qa-page" v-if="qaList?.length">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item
          :border="false"
          :title="item.question"
          v-for="(item, index) in qaList"
          :name="`qa-${index}`"
          :key="index"
        >
          <span class="pre-line-content">{{ item.answer }}</span>
        </van-collapse-item>
      </van-collapse>
    </div>
    <EmptyData v-else />
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
    .van-collapse-item {
      .van-cell {
        border-bottom: 1px solid #f6f6f6;
      }
    }
  }
}
</style>
