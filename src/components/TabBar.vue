<script setup lang="ts">
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { Icon } from '@iconify/vue'
const appStore = useAppStore()
const props = withDefaults(
  defineProps<{
    tabList: {
      name: string
      icon: string
      activeIcon?: string
      path: string
      text: string
      hidden: boolean
    }[]
    defaultColor: string
    activeColor: string
  }>(),
  {
    tabList: () => [],
    defaultColor: '#9ca3af',
    activeColor: '#ff6b6b',
  },
)
const handleTabClick = (item: {
  name: string
  icon: string
  activeIcon?: string
  path: string
  text: string
  hidden: boolean
}) => {
  router.push(item.path)
}
</script>

<template>
  <ul
    class="tab-bar text-12px fixed left-0 w-full border-t-1 border-solid border-#f5f6f7 bg-white h-50px flex justify-around items-center"
  >
    <template v-for="item in tabList" :key="item.name">
      <li
        class="max-w-100px flex flex-col items-center justify-center"
        @click="handleTabClick(item)"
        :style="{
          color: appStore.tabbarActive === item.name ? props.activeColor : props.defaultColor,
        }"
        v-if="!item.hidden"
      >
        <Icon :icon="item.icon" width="16" height="16" />
        <Icon
          v-if="item.activeIcon && appStore.tabbarActive === item.name"
          :icon="item.activeIcon"
          width="16"
          height="16"
        />
        <span class="p-t-4px text-center" v-if="appStore.tabbarActive === item.name">{{
          $t(item.text)
        }}</span>
      </li>
    </template>
  </ul>
</template>

<style lang="less" scoped>
.tab-bar {
  bottom: calc(constant(safe-area-inset-bottom) + 0px); /* 兼容 iOS < 11.2 */
  bottom: calc(env(safe-area-inset-bottom) + 0px); /* 兼容 iOS >= 11.2 */
}
</style>
