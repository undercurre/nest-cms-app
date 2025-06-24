<script setup lang="ts">
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
const productStore = useProductStore()
const appStore = useAppStore()
const gotoPoster = () => {
  router.push(`/diet/${productStore.id}?tab=ai-cookbook`)
}
</script>
<template>
  <div
    class="absolute bottom-130px right-0 flex items-center py-4px p-l-4px p-r-6px border-2px rounded-l-20px bg-#0077ff"
    @click="gotoPoster"
    v-if="!['diet', 'dietDetail', 'AiDietDetail', 'poster'].includes(appStore.tabbarActive)"
  >
    <img class="w-20px h-20px" src="@/assets/images/app/ai-diet-tip-icon.png" alt="" />
    <span class="ml-4px text-14px text-#ffffff">{{ $t('AiDiet') }}</span>
  </div>
</template>

<style lang="less" scoped></style>
