<template>
  <div
    class="rounded-16px px-6px py-2px text-#fff text-12px text-center absolute bottom-8px left-6px"
    :style="{ backgroundColor: formatDifficultyColor(level) }"
  >
    {{ formatDifficulty(level) }}
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
interface Props {
  level: number
}
const props = withDefaults(defineProps<Props>(), {
  level: 1,
})

const { t } = useI18n()
function formatDifficulty(level: number) {
  const map: Record<number, string> = {
    1: t('diet.easy'),
    2: t('diet.normal'),
    3: t('diet.hard'),
  }

  return map[level]
}
function formatDifficultyColor(level: number) {
  const map: Record<number, string> = {
    1: '#2196f3',
    2: '#eaa23c',
    3: '#f44336',
  }

  return map[level]
}
</script>

<style scoped lang="less"></style>
