<template>
  <div class="h-full flex flex-col justify-between">
    <div class="w-full pt-40px flex-1 text-12px overflow-scroll flex flex-col">
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
import { getAIAnswer } from '@/api/modules/diet'
import { onMounted, ref } from 'vue'
import markdownit from 'markdown-it'

const md = markdownit()

const talks = ref<{ role: string; content: string }[]>([
  {
    role: 'user',
    content:
      '你现在是一个资深营养师，接下来为我提供各种菜谱，要求提供菜品的名称，菜系，简介或者历史，需要的食材，以及操作步骤',
  },
])

const input = ref('')

const loading = ref(false)

const submit = async () => {
  loading.value = true
  talks.value.push({ role: 'user', content: input.value })
  input.value = ''
  try {
    const res = await getAIAnswer(talks.value)
    talks.value.push({ role: 'system', content: res.data })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getAIAnswer(talks.value)
    talks.value.push({ role: 'system', content: res.data })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
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
