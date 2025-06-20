<template>
  <div
    class="w-full h-180px rounded-8px shadow-md overflow-hidden flex flex-col"
    @click="handle2Detail"
  >
    <img class="w-full h-130px" :src="url" />

    <div class="h-49px bg-#fff px-8px py-6px flex flex-col justify-between">
      <p class="font-bold text-14px leading-21px text-#000 truncate">{{ title }}</p>
      <div class="flex text-12px">
        <div class="flex items-center mr-8px">
          <img class="w-15px h-15px mr-2px" src="@/assets/images/app/time.png" />
          <span class="text-[--vt-c-text-light-2]">{{ time }}{{ t('minute') }}</span>
        </div>
        <div class="flex items-center">
          <img class="w-15px h-15px mr-2px" src="@/assets/images/app/difficulty.png" />
          <span class="text-[--vt-c-text-light-2]">{{ formatDifficulty(difficulty) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

interface Props {
  id: number
  url: string
  title: string
  time: number
  difficulty: number
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  title: '',
  time: 0,
  difficulty: 0,
})

const map: Record<number, string> = {
  1: 'simple',
  2: 'normal',
  3: 'difficulty',
}

function formatDifficulty(level: number) {
  return t(`${map[level]}`)
}

function handle2Detail() {
  router.push({ name: 'dietDetail', params: { id: props.id } })
}
</script>
