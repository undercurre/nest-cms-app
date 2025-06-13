<script lang="ts" setup>
import { getPosterDetail } from '@/api/modules/poster'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import he from 'he'
import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string
const title = ref('')
const markdownContent = ref('')
const valueHtml = ref('')
onBeforeMount(async () => {
  const res = await getPosterDetail({
    id: productStore.currentPosterId,
  })
  const { data } = res
  // 标题
  title.value = data.title
  // 内容
  markdownContent.value = he.decode(data.markdownSource)
  convertToHtml()
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const marked = (window as any).marked
// 转换为HTML
const convertToHtml = () => {
  try {
    const previewContent = marked.parse(markdownContent.value)
    valueHtml.value = previewContent
    console.log('valueHtml.value: ', valueHtml.value)
  } catch (error) {
    console.error('转换为HTML时出错:', error)
  }
}
</script>
<template>
  <div class="preview-container w-full w-e-text-container" ref="previewRef">
    <div>
      <div class="preview-title">{{ title }}</div>
      <div id="editor-content-view" class="editor-content-view" v-html="valueHtml"></div>
    </div>
  </div>
</template>
<style lang="less">
@import '@/assets/poster/layout.css';
@import '@/assets/poster/view.css';
</style>
<style lang="less" scoped>
.preview-container {
  padding: 12.5px;
  overflow: scroll;
  background-color: #ffffff;
  .preview-title {
    padding: 0 10px;
    margin-bottom: 14px;
    font-size: 22px;
    font-weight: 500;
    line-height: 1.4;
    word-wrap: break-word;
  }
}
</style>
