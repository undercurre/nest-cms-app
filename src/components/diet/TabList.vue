<template>
  <div class="flex px-12px w-full gap-10px overflow-scroll hide-scrollbar">
    <div
      class="h-34px rounded-4px flex justify-center items-center shrink-0 px-6px"
      v-for="item in listWithAll"
      :key="item.value"
      :style="{
        backgroundColor: item.value === curItemKey ? '#FF6B6B' : '#9CA3AF',
        color: item.value === curItemKey ? '#fff' : '#000',
      }"
      @click="handleSelect(item.value)"
    >
      <span class="text-14px">{{
        item.value === 'all' ? item.label : $t(`cookbook.${item.label}`)
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  list: { label: string; value: string }[]
  cur?: string
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  cur: 'all',
})

const { t } = useI18n()
const listWithAll = computed(() => {
  const all = [{ label: t('common.all'), value: 'all' }]
  const result = all.concat(props.list)
  return result
})

const curItemKey = ref('all')

const emit = defineEmits(['change'])

const handleSelect = (key: string) => {
  curItemKey.value = key
  emit('change', key)
}

watch(
  () => props.cur,
  (newVal) => {
    curItemKey.value = newVal
  },
)
</script>
