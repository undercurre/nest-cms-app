<template>
  <div class="w-full rounded-8px shadow-md flex flex-col" @click="handle2Detail">
    <div class="relative">
      <van-button
        round
        class="rounded-16px absolute top-8px right-6px bg-#e6e9e8/80 h-32px w-32px"
        @click.stop
      >
        <Icon icon="lsicon:label-outline" width="16" height="16" class="mt-5px" />
        <!-- <Icon icon="lsicon:label-filled" width="16" height="16" class="mt-5px" /> -->
      </van-button>
      <img class="w-full h-130px img-fit rounded-t-8px" :src="url" @error="imgError" />
      <DifficuteTag :level="difficulty" />
    </div>
    <div class="bg-#fff px-8px py-6px flex flex-col justify-between rounded-b-8px">
      <p class="font-bold text-14px leading-21px text-#000">{{ title }}</p>
      <div class="flex text-12px mt-4px">
        <div class="flex items-center mr-8px">
          <Icon icon="weui:time-outlined" width="16" height="16" />
          <span class="ml-4px">{{ time }}分钟</span>
        </div>
        <div class="flex items-center mr-8px">
          <Icon icon="fluent-color:star-16" width="16" height="16" />
          <span class="text-#f3be36 text-12px">4.5</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { Icon } from '@iconify/vue'
import defaultImg from '@/assets/images/app/default-food.png'

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

function handle2Detail() {
  router.push({ name: 'dietDetail', params: { id: props.id } })
}

function imgError(event) {
  const img = event.srcElement
  img.src = defaultImg
  img.onerror = null // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
}
</script>

<style scoped lang="less">
.img-fit {
  object-fit: cover;
}
</style>
