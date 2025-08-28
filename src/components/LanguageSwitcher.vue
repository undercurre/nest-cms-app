<template>
  <van-dropdown-menu ref="menuRef" class="dropdown-cus absolute top-60px right-24px z-999">
    <van-dropdown-item :title="currentLocaleTitle">
      <van-cell>
        <van-search v-model="searchKeyword" placeholder="Search" size="small" :maxlength="20" />
      </van-cell>
      <van-cell
        v-for="item in filteredOptions"
        :key="item.value"
        center
        :title="item.text"
        @click="changeLanguage(item.value)"
      >
      </van-cell>
    </van-dropdown-item>
  </van-dropdown-menu>
</template>

<script lang="ts" setup>
import { useLanguageList } from '@/hooks/useLanguageList'
import { appLang } from '@/lang/app-lang'
import { loadLocaleMessages } from '@/lang/locales'
import { DropdownMenuInstance } from 'vant/lib/dropdown-menu/types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const searchKeyword = ref('')
const menuRef = ref<DropdownMenuInstance | null>(null)

const filteredOptions = computed(() => {
  if (!searchKeyword.value) {
    return options.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return options.value.filter(
    (option) =>
      option.text.toLowerCase().includes(keyword) || option.value.toLowerCase().includes(keyword),
  )
})

const { t, locale } = useI18n()

const currentLocale = ref<string>(locale.value)

const currentLocaleTitle = computed(() => {
  return options.value.find((item) => item.value === currentLocale.value)?.text
})

const options = ref<{ text: string; value: string }[]>([])
const { languageList, getLanguageList } = useLanguageList()
const changeLanguage = async (e) => {
  await loadLocaleMessages(e)
  locale.value = e
  localStorage.setItem('locale', locale.value)
  // 手动切换后，页面刷新就取切换的语言
  localStorage.setItem('isManualSwitch', 'true')
  menuRef.value?.close()
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
    searchKeyword.value = ''
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

  .van-search {
    --van-search-input-height: 24px;
    margin: 4px 0;
  }
}
</style>
