<template>
  <div
    class="rounded-16px w-36px py-2px text-#fff text-12px text-center absolute bottom-8px left-6px"
    :style="{ backgroundColor: formatDifficultyColor(level) }"
  >
    {{ formatDifficulty(level) }}
  </div>
</template>
<script setup lang="ts">
interface Props {
  level: number
}
const props = withDefaults(defineProps<Props>(), {
  level: 1,
})

function formatDifficulty(level: number) {
  const map: Record<number, string> = {
    1: '简单',
    2: '普通',
    3: '困难',
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
