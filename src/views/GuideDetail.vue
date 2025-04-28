<template>
  <div class="bg-#000 w-full h-full">
    <videoPlay
      width="100%"
      v-bind="options"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
    />

    <div>
      <p class="text-#fff font-bold text-18px p-10px">{{ getI18NTitle() }}</p>
      <p class="text-#fff/80% text-16px p-10px">{{ getI18NDescription() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getGuideById, type Guide } from '@/api/modules/guide'
import { onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play/lib/index.js'

const route = useRoute()

const options = reactive({
  color: '#fff', //主题色
  muted: false, //静音
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
  autoPlay: false, //自动播放
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

const guide = ref<Guide>()

const { locale } = useI18n()

const getI18NTitle = () => {
  if (guide.value) {
    if (locale.value === 'zh-CN') {
      return guide.value.title
    } else {
      return guide.value.title_en
    }
  }
}

const getI18NDescription = () => {
  if (guide.value) {
    if (locale.value === 'zh-CN') {
      return guide.value.description
    } else {
      return guide.value.description_en
    }
  }
}

onBeforeMount(async () => {
  const res = await getGuideById({ id: Number(route.params.id as string) })
  guide.value = res.data
  options.src = res.data.video
})
</script>
