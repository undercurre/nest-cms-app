<template>
  <div class="bg-#000 w-343px h-196px rounded-8px shadow-md m-10px overflow-hidden flex flex-col">
    <videoPlay
      width="100%"
      v-bind="options"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
      v-show="options.src"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play/lib/index.js'

const props = withDefaults(defineProps<{ url: string }>(), {
  url: '',
})

const options = reactive({
  height: '215px',
  color: '#fff', //主题色
  muted: false, //静音
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
  autoPlay: true, //自动播放
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
}
const onPause = (ev: unknown) => {
  console.log(ev, '暂停')
}

const onTimeupdate = (ev: unknown) => {
  console.log(ev, '时间更新')
}
const onCanplay = (ev: unknown) => {
  console.log(ev, '可以播放')
}

watch(
  () => props.url,
  (newUrl) => {
    if (newUrl) {
      options.src = newUrl
    }
  },
)
</script>
