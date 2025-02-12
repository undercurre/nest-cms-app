<template>
  <div
    class="w-full h-209px rounded-8px shadow-md overflow-hidden flex flex-col"
    @click="handle2Detail"
  >
    <img class="w-full h-160px" :src="url" />

    <div class="h-49px bg-#fff px-12px py-6px flex flex-col justify-between">
      <p class="font-bold text-14px leading-21px text-#000">{{ title }}</p>
      <div class="flex text-12px">
        <div class="flex items-center mr-8px">
          <img class="w-15px h-15px mr-2px" src="@/assets/images/app/time.png" />
          <span>{{ time }}分钟</span>
        </div>
        <div class="flex items-center">
          <img class="w-15px h-15px mr-2px" src="@/assets/images/app/difficulty.png" />
          <span>{{ formatDifficulty(difficulty) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'

interface Props {
  id: number
  url: string
  title: string
  time: number
  difficulty: number
}

const props = withDefaults(defineProps<Props>(), {
  url: 'https://raw.githubusercontent.com/undercurre/Image/refs/heads/main/cook-fish.jpeg',
  title: '清蒸鲈鱼',
  time: 0,
  difficulty: 0,
})

function formatDifficulty(level: number) {
  const map: Record<number, string> = {
    1: '简单',
    2: '普通',
    3: '困难',
  }

  return map[level]
}

function handle2Detail() {
  router.push({ name: 'dietDetail', params: { id: props.id } })
}
</script>
