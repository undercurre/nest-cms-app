<script lang="ts" setup>
import { type Guide } from '@/api/modules/guide'
import { Icon } from '@iconify/vue'
import { ref, watchEffect } from 'vue'
const props = withDefaults(defineProps<{ list: Guide[] }>(), {
  list: [],
})
const emit = defineEmits(['play'])
const currentIndex = ref(0)
const playVideo = (index) => {
  currentIndex.value = index
  emit('play', index)
}

// 处理获取视频时长（秒）
function getVideoDuration(url) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = url
    video.addEventListener('loadedmetadata', () => {
      resolve(video.duration)
      video.remove()
    })
    video.addEventListener('error', () => {
      resolve(null)
      video.remove()
    })
    document.body.appendChild(video)
  })
}
watchEffect(() => {
  // 获取每项视频的时长
  props.list.forEach((item) => {
    getVideoDuration(item.video).then((duration) => {
      if (duration) {
        item.duration = formatDuration(duration)
      } else {
        item.duration = 0
      }
    })
  })
})
// 转换视频时间格式
function formatDuration(seconds: number) {
  const minute = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const second = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')

  return minute + ':' + second
}
</script>
<template>
  <div class="px-12px w-full pb-12px">
    <div
      :class="[
        'border',
        'border-solid',
        index === currentIndex ? 'border-[#e6edf6]' : 'border-[#f3f3f3] dark:border-[#f3f3f3]/80%',
        'rounded-6px',
        index === currentIndex
          ? 'bg-#eff6ff dark:bg-[--vt-c-indigo]'
          : 'bg-#fff dark:bg-[--color-background-mute]',
        'p-8px',
        'mt-12px',
        'flex',
        'items-center',
        'justify-between',
      ]"
      v-for="(item, index) in list"
      :key="item.id"
      @click="playVideo(index)"
    >
      <div class="flex items-center flex-1">
        <div
          :class="[
            'rounded-50%',
            'w-22px',
            'h-22px',
            index === currentIndex ? 'bg-#2196f3' : 'bg-#f2f3f4',
            'text-center',
            'leading-22px',
            'text-12px',
            index === currentIndex ? 'text-#fff' : 'text-#808182',
          ]"
        >
          {{ index + 1 }}
        </div>
        <div class="ml-8px flex-1">
          <div class="flex items-center justify-between">
            <div class="text-14px text-#000 dark:text-[--color-text] font-bold">
              {{ item.title }}
            </div>
            <div class="text-12px text-#808182">{{ item.duration }}</div>
          </div>
          <div
            :class="[
              'text-12px',
              'text-#808182',
              item.description && index === currentIndex ? 'mt-6px' : 'mt-0',
            ]"
            v-if="index === currentIndex"
          >
            {{ item.description }}
          </div>
        </div>
      </div>
      <Icon
        icon="mingcute:play-fill"
        width="16"
        height="16"
        class="text-#2196f3 ml-8px"
        v-if="index === currentIndex"
      />
      <Icon icon="octicon:play-24" width="16" height="16" class="text-#808182 ml-8px" v-else />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
