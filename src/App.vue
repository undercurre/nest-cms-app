<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import router from '@/router'
import { useProductStore } from '@/stores/product'

import { useThemeMode } from '@/hooks/useThemeMode'
import { computed, onMounted, ref } from 'vue'
import { useLocation } from './hooks/useLocation'

const route = useRoute()

// 检查当前路由是否为 list
const isListRoute = computed(() => route.name === 'list')
const isHomeRoute = computed(
  () => route.name === 'product' || route.name === 'guide' || route.name === 'diet',
)

const productStore = useProductStore()

const couponShow = ref(false)

const tabList = computed(() => {
  return [
    {
      name: 'guide',
      icon: 'nrk:media-programguide',
      path: `/guide/${productStore.id}`,
      text: 'common.operationInstructions',
    },
    {
      name: 'product',
      icon: 'icon-park-outline:ad-product',
      path: `/product/${productStore.id}`,
      text: 'common.productDescription',
    },
    {
      name: 'poster',
      icon: 'material-symbols:imagesmode-outline',
      path: `/poster/${productStore.id}`,
      text: 'common.poster',
      hidden: !productStore.posterImageUrls?.length,
    },
    {
      name: 'diet',
      icon: 'icon-park-outline:knife-fork',
      path: `/diet/${productStore.id}`,
      text: 'common.completeRecipeCollection',
    },
    {
      name: 'qa',
      icon: 'material-symbols:help',
      path: `/qa/${productStore.id}`,
      text: 'common.qa',
    },
  ]
})
console.log('tabList: ', tabList)
// NavBar
function onClickLeft() {
  console.log(window.history)
  if (isHomeRoute.value || isListRoute.value) {
    // 无法后退时的处理
    console.log('无法后退')
    // 跳到原生
    // goBack2Native()
    const dataStr = JSON.stringify({ goBack: true })
    window.flutter_inappwebview?.callHandler('jsHandler', dataStr).then(() => {
      console.log('goBack 调用成功')
    })
  } else {
    router.back()
  }
}

const { getLocation } = useLocation()

// 获取系统色系
const { getThemeMode, themeMode } = useThemeMode()

onMounted(() => {
  setTimeout(() => {
    couponShow.value = true
  }, 1000)
  getLocation()
  setTimeout(() => {
    getThemeMode()
  }, 300)
})
</script>

<template>
  <div class="w-100vw h-100vh">
    <van-nav-bar
      class="app-title-bar"
      :safe-area-inset-top="true"
      :border="true"
      :fixed="true"
      title=""
    >
      <template #left>
        <div class="flex items-center">
          <img
            class="w-14px h-14px mr-10px dark-logo"
            src="@/assets/images/app/left-arrow.png"
            @click="onClickLeft"
          />
          <span class="font-bold leading-28px text-18px truncate w-67vw text-left">{{
            isListRoute ? $t('common.equipmentList') : $t('common.smartKitchenAssistant')
          }}</span>
        </div>
      </template>
      <template #right>
        <img v-if="!isListRoute" class="h-150% dark-logo" src="@/assets/images/app/logo.png" />
        <!-- @click="go2AI" -->
      </template>
    </van-nav-bar>
    <div class="flex flex-col h-full p-b-50px">
      <div class="shadow-md w-full h-46px"></div>

      <div class="w-full flex-1 overflow-hidden">
        <div class="h-full overflow-scroll">
          <RouterView />
        </div>
      </div>
    </div>
    <TabBar
      :tabList="tabList"
      :defaultColor="themeMode === 'dark' ? '#ffffff' : '#9ca3af'"
      :activeColor="themeMode === 'dark' ? 'rgba(255, 107, 107, 0.8)' : '#ff6b6b'"
    />
  </div>
</template>

<style scoped lang="less">
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
.app-title-bar {
  --van-active-opacity: 1;
}
.app-tab-bar {
  .van-tabbar-item {
    text-align: center;
  }
}
</style>
