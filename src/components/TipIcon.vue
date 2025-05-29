<script setup lang="ts">
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
const productStore = useProductStore()
const appStore = useAppStore()
const gotoPoster = () => {
  router.push(`/poster/${productStore.id}`)
}
</script>
<template>
  <div
    class="absolute bottom-80px right-0 flex items-center py-4px p-l-4px p-r-6px border-2px rounded-l-20px bg-#e0d5fd"
    @click="gotoPoster"
    v-if="appStore.tabbarActive !== 'poster'"
  >
    <img class="w-20px h-20px" src="@/assets/images/app/tip-icon.png" alt="" />
    <span class="ml-4px text-14px text-#6f4fd4">{{ $t('common.poster') }}</span>
  </div>
</template>

<style lang="less" scoped></style>
