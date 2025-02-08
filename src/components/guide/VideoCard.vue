<template>
  <div class="w-343px h-265px rounded-8px shadow-md m-10px overflow-hidden flex flex-col">
    <!-- 视频播放器 -->
    <video
      class="w-full"
      ref="video"
      preload="metadata"
      :src="videoUrl"
      crossorigin="anonymous"
      @loadeddata="onVideoLoaded"
      style="display: none"
    ></video>

    <!-- 用于展示第一帧的图片 -->
    <div class="w-full h-196px flex justify-center items-center relative">
      <img
        class="w-full h-196px"
        :src="firstFrameImage"
        alt="First Frame of Video"
        v-if="firstFrameImage"
      />
      <img
        class="w-50px h-50px animate-spin"
        src="@/assets/images/app/loading.png"
        v-if="!firstFrameImage"
      />
      <div
        class="flex justify-center items-center absolute border-5px border-#fff border-solid rounded-full"
      >
        <img class="w-50px h-50px" src="@/assets/images/app/play.png" v-if="firstFrameImage" />
      </div>

      <div
        class="absolute text-#fff bg-#000/60 rounded-4px p-10px w-44px h-20px text-12px leading-18px flex justify-center items-center bottom-8px right-8px"
      >
        <span>{{ formatDuration(duration) }}</span>
      </div>
    </div>

    <div class="h-69px bg-#fff p-12px flex flex-col justify-between">
      <p class="font-bold text-14px leading-21px text-#000">{{ title }}</p>
      <p class="text-14px leading-20px text-#4B5563">{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  url: string
  title: string
  description: string
}

const props = withDefaults(defineProps<Props>(), {
  url: 'https://raw.githubusercontent.com/undercurre/Video/refs/heads/main/kitchen-demo.mp4',
  title: '日常维护指南',
  description: '正确的清洁和保养方法',
})

const video = ref<HTMLVideoElement | null>(null)

const videoUrl = props.url // 视频的 URL 地址
const firstFrameImage = ref<string | null>(null) // 用来存储提取的第一帧图片数据
const duration = ref(0)

// 处理视频加载完成事件
const onVideoLoaded = () => {
  const canvas = document.createElement('canvas') // 创建一个 canvas 元素
  const context = canvas.getContext('2d') // 获取 2D 渲染上下文
  if (!video.value) return
  // 设置 canvas 的宽高为视频的宽高
  canvas.width = video.value.videoWidth
  canvas.height = video.value.videoHeight

  // 等待视频的元数据加载完成后，暂停播放并绘制第一帧
  video.value.currentTime = 0 // 跳到视频的第 0 秒
  video.value.pause()

  // 使用 canvas 绘制第一帧
  video.value.addEventListener('canplay', () => {
    if (context && video.value) {
      context.drawImage(video.value, 0, 0, canvas.width, canvas.height) // 将视频帧绘制到 canvas 上
      // 将 canvas 转换为图片并设置为 img 的 src
      firstFrameImage.value = canvas.toDataURL('image/png') // 将第一帧转为 base64 格式的图片
      duration.value = video.value.duration
    }
  })
}

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
