<template>
  <div class="h-full flex flex-col justify-between">
    <div
      class="w-full pt-40px flex-1 text-12px overflow-scroll flex flex-col"
      ref="scrollContainer"
    >
      <div
        v-for="(item, index) in talks"
        :key="item.content"
        class="w-75% talk"
        :style="{ alignSelf: item.role === 'system' || index === 0 ? 'flex-start' : 'flex-end' }"
      >
        <div v-if="index === 0" class="bg-green/20 rounded-8px p-10px mb-20px">
          我是一个AI营养师，可以为你提供食谱等饮食咨询！
        </div>
        <div
          v-if="index !== 0 && item.role === 'user'"
          class="bg-blue/20 rounded-8px p-10px mb-20px"
          v-html="md.render(item.content)"
        ></div>
        <div
          v-if="index !== 1 && item.role === 'system'"
          class="bg-green/20 rounded-8px p-10px mb-20px"
          v-html="md.render(item.content)"
        ></div>
      </div>
    </div>
    <div class="border-2px border-solid border-#ddd rounded-4px">
      <van-field v-model="input" label="对话" label-align="top">
        <template #button>
          <van-button
            size="small"
            :loading="loading"
            type="primary"
            loading-type="spinner"
            @click="submit"
            >提交</van-button
          >
        </template>
      </van-field>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import markdownit from 'markdown-it'
// import { getAIAnswer } from '@/api/modules/diet'
import WebSocketService from '@/api/modules/ai'

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
</script>

<style scoped>
:deep(.talk p) {
  margin-top: 10px;
  margin-bottom: 10px;
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
