<template>
  <div class="w-343px h-265px rounded-8px shadow-md m-10px overflow-hidden flex flex-col">
    <!-- 视频播放器 -->
    <video
      class="w-full"
      ref="video"
      webkit-playsinline="true"
      playsinline="true"
      preload="metadata"
      :src="videoUrl"
      crossorigin="anonymous"
      @loadeddata="onVideoLoaded"
      style="display: none"
    ></video>

    <!-- 用于展示第一帧的图片 -->
    <div class="w-full min-h-196px flex justify-center items-center relative">
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
        @click="handlePlay"
      >
        <img class="w-50px h-50px" src="@/assets/images/app/play.png" v-if="firstFrameImage" />
      </div>

      <div
        class="absolute text-#fff bg-#000/60 rounded-4px p-10px w-44px h-20px text-12px leading-18px flex justify-center items-center bottom-8px right-8px"
      >
        <span>{{ formatDuration(duration) }}</span>
      </div>
    </div>

    <div class="min-h-69px bg-#fff p-12px flex flex-col justify-between">
      <p class="font-bold text-14px leading-21px text-#000">{{ getI18NTitle() }}</p>
      <p class="text-14px leading-20px text-#4B5563 truncate">{{ getI18NDescription() }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Guide } from '@/api/modules/guide'
import guideDefaultImage from '@/assets/images/app/guide-default.png'
import router from '@/router'
import { useGuideStore } from '@/stores/guide'
import { getUrlConcat } from '@/utils/index'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  resource: Guide
}

const props = withDefaults(defineProps<Props>(), {
  resource: () => {
    return {
      id: 1,
      video: 'https://raw.githubusercontent.com/undercurre/Video/refs/heads/main/kitchen-demo.mp4',
      title: '日常维护指南',
      description: '正确的清洁和保养方法',
      title_en: '',
      description_en: '',
      createdAt: '',
    }
  },
})

const { locale } = useI18n()
const video = ref<HTMLVideoElement | null>(null)

const videoUrl = getUrlConcat(props.resource?.guideMultiLanguageObj?.[locale.value]?.videoUrl) // 视频的 URL 地址
const firstFrameImage = ref<string | null>(null) // 用来存储提取的第一帧图片数据
const duration = ref(0)
const onVideoLoaded = () => {}
onMounted(() => {
  getFirstImg(videoUrl)
})
const getFirstImg = (url) => {
  if (!video.value) return
  video.value.crossOrigin = 'anonymous' // 允许url跨域
  video.value.autoplay = true // 自动播放
  video.value.muted = false // 静音
  video.value.src = url

  return new Promise((resolve, reject) => {
    try {
      if (!video.value) return
      video.value.addEventListener(
        'loadedmetadata',
        () => {
          if (!video.value) return
          console.log('loadedmetadata')
          video.value.currentTime = 2
          const canvas = document.createElement('canvas')
          video.value.addEventListener('canplaythrough', () => {
            console.log('canplaythrough')
            if (!video.value) return
            canvas.width = video.value.videoWidth
            canvas.height = video.value.videoHeight
            canvas.getContext('2d')?.drawImage(video.value, 0, 0, canvas.width, canvas.height)
            const firstFrame = canvas.toDataURL()
            firstFrameImage.value = firstFrame
            duration.value = video.value.duration
            video.value.pause()
            // console.log(firstFrame); // 输出第一帧画面的Base64编码字符串
            resolve(firstFrame)
          })
        },
        { once: true },
      )
    } catch (err) {
      console.error(err)
      firstFrameImage.value = guideDefaultImage
      reject('')
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
const guideStore = useGuideStore()
function handlePlay() {
  router.push({ name: 'guideDetail' })
  guideStore.guide = props.resource
}

const getI18NTitle = () => {
  return props.resource?.guideMultiLanguageObj?.[locale.value]?.title
}

const getI18NDescription = () => {
  return props.resource?.guideMultiLanguageObj?.[locale.value]?.description
}
</script>
