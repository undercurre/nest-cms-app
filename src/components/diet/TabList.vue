<template>
  <div class="flex flex-1 gap-10px overflow-scroll hide-scrollbar">
    <div
      class="h-34px rounded-4px flex justify-center items-center shrink-0 px-6px"
      v-for="item in listWithAll"
      :key="item.value"
      :style="{
        backgroundColor: item.existCookbook
          ? item.value === curItemKey
            ? '#FF6B6B'
            : '#9CA3AF'
          : 'rgb(200, 201, 204, 0.4)',
        color: item.value === curItemKey ? '#fff' : '#000',
      }"
      @click="handleSelect(item)"
    >
      <span class="text-14px">{{ item.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Category } from '@/api/modules/diet'
import { appLang } from '@/lang/app-lang'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  list: Category[]
  cur?: string
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  cur: '',
})

const { locale } = useI18n()
const listWithAll = computed(() => {
  const resList = props.list.map((item) => {
    return {
      label:
        item?.categoryMultiLanguageObj?.[appLang[locale.value] ?? locale.value ?? 'en']
          ?.categoryName ??
        item?.categoryMultiLanguageObj?.['en']?.categoryName ??
        '',
      value: item.id,
      existCookbook: item.existCookbook,
    }
  })
  return resList
})

const curItemKey = ref<string | number>('all')

const emit = defineEmits(['change'])

const handleSelect = (item) => {
  if (!item.existCookbook) {
    return
  }
  curItemKey.value = item.value
  emit('change', item.value)
}

watch(
  () => props.cur,
  (newVal) => {
    curItemKey.value = newVal
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
