<template>
  <div class="h-full flex flex-col justify-between">
    <div class="w-full p-12px flex-1 text-12px overflow-scroll flex flex-col" ref="scrollContainer">
      <div
        v-for="(item, index) in talks"
        :key="item.content"
        class="w-75% talk"
        :style="{ alignSelf: item.role === 'system' || index === 0 ? 'flex-start' : 'flex-end' }"
      >
        <div v-if="index === 0" class="bg-#2196f3 color-#fff rounded-8px p-10px mb-20px">
          {{ $t('AI.desc') }}
        </div>
        <div
          v-if="index !== 0 && item.role === 'user'"
          class="bg-#f3f4f6 rounded-8px p-10px mb-20px"
          v-html="md.render(item.content)"
        ></div>
        <div
          v-if="index !== 1 && item.role === 'system'"
          class="bg-#2196f3 color-#fff rounded-8px p-10px mb-20px"
          v-html="md.render(item.content)"
        ></div>
      </div>
    </div>
    <div class="flex items-center justify-between w-full px-12px mb-12px">
      <van-field
        v-model="input"
        label-align="top"
        class="bg-#f3f4f6 rounded-50px py-5px"
        @keyup.enter="submit"
        :placeholder="$t('AI.input')"
      >
      </van-field>
      <van-button
        size="small"
        :loading="loading"
        class="bg-transparent border-0"
        loading-type="spinner"
        @click="submit"
      >
        <Icon
          icon="fa:send"
          width="18"
          height="18"
          :class="[input ? 'text-#2196f3' : 'text-#9ba1ad']"
        />
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { onUpdated, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import markdownit from 'markdown-it'
// import { getAIAnswer } from '@/api/modules/diet'
import WebSocketService from '@/api/modules/ai'

const appStore = useAppStore()

const route = useRoute()
appStore.tabbarActive = route.name as string
const webSocketService = new WebSocketService()

const md = markdownit()

const talks = ref<{ role: string; content: string }[]>([
  {
    role: 'user',
    content:
      '你现在是一个资深营养师，接下来为我提供各种菜谱，要求提供菜品的名称，菜系，简介或者历史，需要的食材，以及操作步骤',
  },
  {
    role: 'system',
    content:
      '好的！作为一名资深营养师，我会为你提供详细的菜谱，包括菜品的名称、菜系、简介或历史、所需食材以及操作步骤。',
  },
])

const input = ref('')

const loading = ref(false)

const submit = async () => {
  if (!input.value.trim()) return
  loading.value = true
  talks.value.push({ role: 'user', content: input.value })
  input.value = ''
  try {
    // const res = await getAIAnswer(talks.value)
    // talks.value.push({ role: 'system', content: res.data })
    talks.value.push({ role: 'system', content: '' })
    webSocketService.askQuestion(JSON.stringify(talks.value))
  } catch (e) {
    console.log(e)
  } finally {
    // loading.value = false
  }
}

let answer = ''

// eslint-disable-next-line @typescript-eslint/no-explicit-any
webSocketService.socket.on('response', (data: any) => {
  if (!data.choices[0].delta.content) return
  answer += data.choices[0].delta.content as string
  talks.value[talks.value.length - 1] = { role: 'system', content: answer }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
webSocketService.socket.on('done', (data: any) => {
  console.log('done', data)
  loading.value = false
})

// 获取容器引用
const scrollContainer = ref<HTMLElement | null>(null)

// 监听更新并滚动到底部
onUpdated(() => {
  // 确保容器存在
  if (scrollContainer.value) {
    // 每次更新后滚动到底部
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})

// 断开连接
onUnmounted(() => {
  webSocketService.disconnect()
})
</script>

<style scoped>
:deep(.talk p) {
  /* margin-top: 10px;
  margin-bottom: 10px; */
}

:deep(.talk hr) {
  margin-top: 10px;
  margin-bottom: 10px;
}

:deep(.talk strong) {
  font-weight: 900;
  font-size: 14px;
}
</style>
