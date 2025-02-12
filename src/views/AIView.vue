<template>
  <div class="h-full flex flex-col justify-between">
    <div class="w-full pt-40px flex-1 text-12px overflow-scroll">
      <span class="bg-red/20 p-20px rounded-8px leading-12px"
        >我是一个AI营养师，可以为你提供各种菜谱！</span
      >
      <div v-for="(item, index) in talks.slice(1)" :key="item">
        <span v-if="index % 2 !== 1" class="bg-red/20">{{ item }}</span>
        <span v-if="index % 2 !== 0" class="bg-green/20 self-end">{{ item }}</span>
      </div>
    </div>
    <div class="border-2px border-solid border-#ddd rounded-4px">
      <van-field v-model="input" label="对话" label-align="top">
        <template #button>
          <van-button size="small" type="primary" @click="submit">提交</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAIAnswer } from '@/api/modules/diet'
import { onMounted, ref } from 'vue'

const talks = ref<string[]>([
  '你现在是一个资深营养师，接下来为我提供各种菜谱，要求提供菜品的名称，菜系，简介或者历史，需要的食材，以及操作步骤',
])

const input = ref('')

const submit = async () => {
  const res = await getAIAnswer({ content: input.value })
  talks.value.push(res.data)
}

onMounted(async () => {
  const res = await getAIAnswer({ content: talks.value[0] })
  talks.value.push(res.data)
})
</script>
