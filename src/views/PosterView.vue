<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string
</script>
<template>
  <div class="w-full">
    <img
      v-for="(item, index) in productStore.posterImageUrls"
      :src="item"
      :key="'poster' + index"
      class="w-full block"
    />
  </div>
</template>
<style scoped lang="less"></style>
