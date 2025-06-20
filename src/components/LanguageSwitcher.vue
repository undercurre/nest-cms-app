<template>
  <van-dropdown-menu ref="menuRef" class="dropdown-cus absolute top-60px right-24px z-999">
    <van-dropdown-item v-model="currentLocale" :options="options" @change="changeLanguage" />
  </van-dropdown-menu>
</template>

<script lang="ts" setup>
import { useLanguageList } from '@/hooks/useLanguageList'
import { appLang } from '@/lang/app-lang'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentLocale = ref<string>(locale.value)

const options = ref<{ text: string; value: string }[]>([])
const { languageList, getLanguageList } = useLanguageList()
const changeLanguage = (e) => {
  locale.value = e
  localStorage.setItem('locale', locale.value)
  // 手动切换后，页面刷新就取切换的语言
  localStorage.setItem('isManualSwitch', 'true')
}

watch(
  () => [languageList.value, locale.value],
  (newVal: unknown) => {
    options.value = newVal?.[0]?.map((item) => {
      return {
        text: t(`${item.languageCode ?? ''}`),
        value: appLang[item.languageCode] ?? item.languageCode ?? 'en',
      }
    })
    currentLocale.value = newVal?.[1]
  },
)

onMounted(() => {
  getLanguageList()
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
