<template>
  <van-dropdown-menu ref="menuRef" class="dropdown-cus absolute top-60px right-24px">
    <van-dropdown-item v-model="currentLocale" :options="options" @change="changeLanguage" />
  </van-dropdown-menu>
</template>

<script lang="ts" setup>
import { getProductLanguageList, type LangItem } from '@/api/modules/product'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentLocale = ref<string>(locale.value)

const languageList = ref<LangItem[]>([])
const options = ref<{ text: string; value: string }[]>([])
const getLanguageList = async () => {
  if (!localStorage.getItem('languageList')) {
    try {
      const res = await getProductLanguageList()
      localStorage.setItem('languageList', JSON.stringify(res?.data?.languageInfoList ?? ''))
    } catch (error) {
      console.log('error: ', error)
    }
  }
  languageList.value = JSON.parse(localStorage.getItem('languageList') ?? '')
}
const changeLanguage = (e) => {
  locale.value = e
  localStorage.setItem('locale', locale.value)
  // 手动切换后，页面刷新就取切换的语言
  sessionStorage.setItem('isManualSwitch', 'true')
}

watch(
  () => [languageList.value, locale.value],
  (newVal: unknown) => {
    options.value = newVal?.[0]?.map((item) => {
      return {
        text: t(`lang.${item.languageCode ?? ''}`),
        value: item.languageCode === 'zh' ? 'zh-CN' : (item.languageCode ?? ''),
      }
    })
    currentLocale.value = newVal?.[1]
  },
)

onMounted(() => {
  getLanguageList()
})
onUnmounted(() => {
  localStorage.removeItem('languageList')
})
</script>

<style lang="less">
.van-dropdown-menu {
  .van-dropdown-menu__bar {
    height: 30px !important;
    padding-right: 10px;
    border-radius: 6px;
  }
}
</style>
