<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { getPosterDetail } from '@/api/modules/poster'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import he from 'he'
import 'https://unpkg.com/marked/marked.min.js'
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
    id: productStore.posterId,
  })
  const { data } = res
  // 标题
  title.value = data.title
  // 内容
  markdownContent.value = he.decode(data.markdownSource)
  convertToHtml()
})
const marked = (window as any).marked
// 自定义 marked 的图片渲染器
const renderer = new marked.Renderer()
/**
 * 解析HTML字符串中的div元素，提取style、class和文本内容
 * @param {string} htmlString - 包含div元素的HTML字符串
 * @returns {Array} - 每个div元素的属性和内容的数组
 */
function parseDivElements(htmlString) {
  // 创建临时DOM容器
  const tempDiv = document.createElement('div')
  // 移除多余的右尖括号(>)，防止解析错误
  const cleanHtml = htmlString.replace(/> <div/g, '<div')
  tempDiv.innerHTML = cleanHtml

  // 获取所有div元素
  const divs = tempDiv.querySelectorAll('div')

  // 存储解析结果
  const result: any[] = []

  // 遍历每个div元素，提取属性和内容
  divs.forEach((div: any) => {
    result.push({
      style: div.getAttribute('style') || '',
      class: div.getAttribute('class') || '',
      text: div.textContent.trim(),
    })
  })

  return result
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.blockquote = (node) => {
  const { text } = node
  const list = parseDivElements(text)
  if (list.length) {
    return list
      ?.map((item) => {
        return `<blockquote style="${item.style}" :class="${item.class}">${item.text}</blockquote>`
      })
      .join('\n')
  }
  if (text.startsWith('<blockquote ') && text.endsWith('</blockquote>')) {
    return text
  }
  return `<blockquote >${text}</blockquote>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.table = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<table ') && text.endsWith('</table>')) {
    return text
  }
  return `<table>${text}</table>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.th = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<th ') && text.endsWith('</th>')) {
    return text
  }
  return `<th>${text}</th>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.tr = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<tr ') && text.endsWith('</tr>')) {
    return text
  }
  return `<tr>${text}</tr>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.td = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<td ') && text.endsWith('</td>')) {
    return text
  }
  return `<td>${text}</td>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.p = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<p ') && text.endsWith('</p>')) {
    return text
  }
  return `<p>${text}</p>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.span = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<span ') && text.endsWith('</span>')) {
    return text
  }
  return `<span>${text}</span>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.sub = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<sub ') && text.endsWith('</sub>')) {
    return text
  }
  return `<sub>${text}</sub>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.sup = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<sup ') && text.endsWith('</sup>')) {
    return text
  }
  return `<sup>${text}</sup>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.div = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<div ') && text.endsWith('</div>')) {
    return text
  }
  return `<div>${text}</div>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.u = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<u ') && text.endsWith('</u>')) {
    return text
  }
  return `<u>${text}</u>`
}

// 自定义 marked 的块引用渲染器，保留样式
renderer.s = ({ text }) => {
  // 检查是否已经包含样式
  if (text.startsWith('<s ') && text.endsWith('</s>')) {
    return text
  }
  return `<s>${text}</s>`
}

renderer.image = ({ href, title, text }) => {
  if (title) {
    const [style, classes] = title.split('|')
    return `<img src="${href}" alt="${text}" data-href="${href}" style="${style}" class="${classes}">`
  }
  return `<img src="${href}" data-href="${href}" alt="${text}">`
}

// 自定义 marked 的视频渲染器
renderer.link = ({ href, title, text }) => {
  if (text === 'video' && title) {
    const [poster, controls, width, height, style, classes] = title.split('|')
    return `<video poster="${poster}" controls="${controls}" width="${width}" height="${height}" style="${style}" class="${classes}"><source src="${href}" type="video/mp4"/></video>`
  }
  return `<a href="${href}" title="${title || ''}">${text}</a>`
}

// 设置 marked 的渲染器
marked.setOptions({
  renderer: renderer,
})
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
.preview-container {
  strong {
    font-weight: bolder !important;
  }
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    font: revert;
  }
  img {
    display: block;
    font-size: 0 !important;
  }
}
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
