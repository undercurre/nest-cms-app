<template>
  <div class="flex px-12px w-full min-h-36px mb-12px gap-10px overflow-scroll hide-scrollbar">
    <div
      class="min-w-50px h-30px rounded-4px px-5px flex justify-center items-center shrink-0"
      v-for="item in listWithAll"
      :key="item.value"
      :style="{
        backgroundColor: item.value === curItemKey ? '#2196f3' : '#9CA3AF',
        color: item.value === curItemKey ? '#fff' : '#fff',
      }"
      @click="handleSelect(item.value)"
    >
      <span class="text-14px">{{ $t(`cookbook.${item.label}`) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'

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
