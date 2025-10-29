<template>
  <div class="bg-#000 w-343px h-196px rounded-8px shadow-md m-10px overflow-hidden flex flex-col">
    <videoPlay
      width="100%"
      v-bind="options"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
      @error="onError"
      @waiting="onWaiting"
      @stalled="onStalled"
      v-show="options.src"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play/lib/index.js'

const props = withDefaults(defineProps<{ url: string }>(), {
  url: '',
})

const isLoading = ref(false)
const retryCount = ref(0)
const maxRetries = 3 // 最大重试次数
const retryDelay = 2000 // 重试延迟时间(毫秒)
let retryTimer: null | NodeJS.Timeout = null

const options = reactive({
  height: '196px', // 与容器高度保持一致
  color: '#fff', //主题色
  muted: false, //静音
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
  autoPlay: false, // 关闭自动播放，避免浏览器限制
  preload: 'auto', // 添加预加载
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制器
  src: '',
  title: '', //视频名称
  poster: '', //封面
})

const onPlay = (ev: unknown) => {
  console.log(ev, '播放')
  isLoading.value = false
}

const onPause = (ev: unknown) => {
  console.log(ev, '暂停')
}

const onTimeupdate = (ev: unknown) => {
  console.log(ev, '时间更新')
}

const onCanplay = (ev: unknown) => {
  console.log(ev, '可以播放')
  isLoading.value = false
}

// 添加错误处理
const onError = (ev: unknown) => {
  console.error('视频播放错误:', ev)
  isLoading.value = false
  // 可以在这里添加用户友好的错误提示
}

// 添加加载等待处理
const onWaiting = (ev: unknown) => {
  console.log('视频缓冲中...', ev)
  isLoading.value = true
}

// 重新加载视频的方法
const reloadVideo = () => {
  if (retryCount.value >= maxRetries) {
    console.error('视频加载失败，已达到最大重试次数')
    isLoading.value = false
    return
  }

  retryCount.value++
  console.log(`第${retryCount.value}次尝试重新加载视频`)

  // 先清空src，再重新设置，触发重新加载
  const currentUrl = options.src
  options.src = ''

  // 使用setTimeout确保DOM更新后再设置新的src
  setTimeout(() => {
    options.src = currentUrl
  }, 100)
}

// 添加网络中断处理
const onStalled = (ev: unknown) => {
  console.log('视频加载中断，尝试重新加载...', ev)
  isLoading.value = true

  // 清除之前的重试定时器
  if (retryTimer) {
    clearTimeout(retryTimer)
  }

  // 延迟重试，避免频繁请求
  retryTimer = setTimeout(() => {
    reloadVideo()
  }, retryDelay)
  // 可以在这里添加自动重试逻辑
}

watch(
  () => props.url,
  (newUrl) => {
    if (newUrl) {
      isLoading.value = true
      // 添加短暂延迟，确保前一个视频资源完全释放后再加载新视频
      setTimeout(() => {
        options.src = newUrl
      }, 300)
    }
  },
  { immediate: true }, // 立即执行，确保初始URL能正确加载
)
</script>
