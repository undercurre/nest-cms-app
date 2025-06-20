<script lang="ts" setup>
import { Entity, getQAList } from '@/api/modules/qa'
import { getTroubleshootingList, TroubleshootingEntity } from '@/api/modules/troubleshooting'
import { appLang } from '@/lang/app-lang'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { ref, watch } from 'vue'
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
const troubleshootingList = ref<TroubleshootingEntity[]>([])
const activeTab = ref('0')

const { locale } = useI18n()

const keyword = ref('')
const getQaData = async () => {
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
watch(
  () => activeTab.value,
  (newVal) => {
    search(newVal)
  },
)
const search = (type) => {
  if (type == '0') {
    getQaData()
  } else {
    getTroubleshootingData()
  }
}
const getTroubleshootingData = async () => {
  try {
    const res = await getTroubleshootingList({
      productModel: productStore.productModel,
      pageNo: 1,
      pageSize: 9999999,
      solution: keyword.value,
      phenomenon: keyword.value,
    })
    troubleshootingList.value = res.data.troubleshootingList
    troubleshootingList.value.forEach((item) => {
      item.troubleshootingMultiLanguageObj = item?.troubleshootingLanguageList?.reduce(
        (acc, curr) => {
          acc[curr.languageCode] = curr
          return acc
        },
        {},
      )
      if (!Object.keys(item.troubleshootingMultiLanguageObj).length) {
        item.troubleshootingMultiLanguageObj = {
          zh: {},
          en: {},
        }
      }
    })
  } catch (error) {
    console.error('获取故障排除列表失败:', error)
  }
}
</script>
<template>
  <div class="qa-content p-t-48px bg-#f6f6f6">
    <div class="fixed w-full left-0 top-0px z-99999">
      <van-search
        class="w-full qa-search"
        v-model="keyword"
        :placeholder="$t('searchKeyword')"
        @search="search(activeTab)"
        @blur="search(activeTab)"
      />
    </div>
    <van-tabs v-model:active="activeTab" class="m-t-12px qa-tabs">
      <van-tab :title="$t('frequentlyAskedQuestions')">
        <div class="bg-#f6f6f6 qa-page" v-if="qaList?.length">
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
      </van-tab>
      <van-tab :title="$t('troubleshooting')">
        <div class="qa-page" v-if="troubleshootingList?.length">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item
              :border="false"
              :title="
                item.troubleshootingMultiLanguageObj[locale || 'en']?.phenomenon ??
                item.troubleshootingMultiLanguageObj['en']?.phenomenon
              "
              v-for="(item, index) in troubleshootingList"
              :name="`troubleshooting-${index}`"
              :key="index"
            >
              <span class="pre-line-content">{{
                item.troubleshootingMultiLanguageObj[locale || 'en']?.solution ??
                item.troubleshootingMultiLanguageObj['en']?.solution
              }}</span>
            </van-collapse-item>
          </van-collapse>
        </div>
        <EmptyData v-else />
      </van-tab>
    </van-tabs>
  </div>
</template>
<style lang="less">
.qa-tabs {
  .van-tabs__wrap {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
}
.qa-page {
  height: calc(100vh - 200px);
  .van-collapse {
    height: 100%;
    overflow: auto;
    .van-collapse-item {
      .van-cell {
        border-bottom: 1px solid #f6f6f6;
      }
    }
    .van-cell__title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
.qa-content {
  .van-empty {
    background: #ffffff;
  }
}
</style>
