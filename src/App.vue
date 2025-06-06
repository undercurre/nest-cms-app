<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import router from '@/router'
import { useProductStore } from '@/stores/product'

import { useLocation } from '@/hooks/useLocation'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useAppStore } from '@/stores/app'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getMenuList,
  getPageInfoByProductId,
  PageConfigEntity,
  TabItem,
} from './api/modules/product'

const route = useRoute()

const { t, locale } = useI18n()
const appStore = useAppStore()

// 检查当前路由是否为 list
const isListRoute = computed(() => route.name === 'list')
const isHomeRoute = computed(
  () => route.name === 'product' || route.name === 'guide' || route.name === 'diet',
)

const productStore = useProductStore()

const couponShow = ref(false)

// 根据产品id获取页面配置
const pageConfig = ref<PageConfigEntity>()
const getPageConfigInfo = async () => {
  try {
    const res = await getPageInfoByProductId(productStore.id)
    const { data } = res
    data.pageConfigMultiLanguageObj = data?.pageLanguageRelationList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
    if (!Object.keys(data.pageConfigMultiLanguageObj).length) {
      data.pageConfigMultiLanguageObj = {
        zh: {},
        en: {},
      }
    }
    pageConfig.value = data
  } catch (error) {
    console.log('error: ', error)
    pageConfig.value = undefined
  }
}

const tabList = computed(() => {
  const selectMenuList = menuList.value.filter((item) =>
    pageConfig.value?.menuIdList?.includes(item.id),
  )
  const res = selectMenuList.map((item) => {
    const pathSplit = item.path?.split('/')
    const name = pathSplit.length > 1 ? pathSplit?.[1] : ''
    return {
      name: name,
      icon: item.source,
      path: `${item.path.replace('${id}', productStore.id.toString())}`,
      text:
        item.menuMultiLanguageObj?.[(locale.value == 'zh-CN' ? 'zh' : locale.value) ?? 'en']
          ?.menuName ??
        item.menuMultiLanguageObj?.['en']?.menuName ??
        '',
      hidden: !productStore.posterImageUrls?.length && name === 'poster',
    }
  })
  const tabRes = res.length
    ? res
    : [
        {
          name: 'poster',
          icon: 'material-symbols:imagesmode-outline',
          path: `/poster/${productStore.id}`,
          text: 'common.poster',
          hidden: !productStore.posterImageUrls?.length,
        },
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
  if (!tabRes.find((item) => item.path.indexOf('product') > -1)) {
    // 在数据最中间位置插入元素
    tabRes.splice(Math.floor(tabRes.length / 2), 0, {
      name: 'product',
      icon: 'icon-park-outline:ad-product',
      path: `/product/${productStore.id}`,
      text: 'common.productDescription',
      hidden: false,
    })
  }
  return tabRes
})
const menuList = ref<TabItem[]>([])
const getTab = async () => {
  const res = await getMenuList({
    pageNo: 1,
    pageSize: 9999999,
  })
  menuList.value = res.data.menuList
  menuList.value?.forEach((item) => {
    item.menuMultiLanguageObj = item?.menuLanguageRelationList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
    if (!Object.keys(item.menuMultiLanguageObj).length) {
      item.menuMultiLanguageObj = {
        zh: {},
        en: {},
      }
    }
  })
}

watch(
  () => productStore.id,
  (newVal) => {
    if (!newVal) {
      return
    }
    getPageConfigInfo()
    getTab()
  },
  { immediate: true, deep: true },
)

const getTitle = computed(() => {
  return (
    pageConfig.value?.pageConfigMultiLanguageObj?.[
      (locale.value == 'zh-CN' ? 'zh' : locale.value) ?? 'en'
    ]?.title ??
    pageConfig.value?.pageConfigMultiLanguageObj?.['en']?.title ??
    t('common.smartKitchenAssistant')
  )
})
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
// 进入动画
const enter = (el, done) => {
  // 初始状态：页面在屏幕后方（Z轴负方向）
  el.style.transform = 'translate3d(0, 0, -300px)'
  el.style.opacity = '0'

  // 动画1：向后移动（远离用户）
  setTimeout(() => {
    el.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
    el.style.transform = 'translate3d(0, 0, -600px)'
    el.style.opacity = '0.3'
  }, 10)

  // 动画2：向前移动到屏幕（带反弹效果）
  setTimeout(() => {
    el.style.transition =
      'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease'
    el.style.transform = 'translate3d(0, 0, 0)'
    el.style.opacity = '1'
  }, 300)

  // 动画完成
  setTimeout(() => {
    done()
    el.style.transition = ''
  }, 800)
}

// 离开动画
const leave = (el, done) => {
  // 直接隐藏页面（可根据需要添加反向动画）
  el.style.opacity = '0'
  setTimeout(done, 500)
}
onMounted(() => {
  setTimeout(() => {
    couponShow.value = true
  }, 1000)
  setTimeout(() => {
    getThemeMode()
  }, 300)
})
onMounted(() => {
  setTimeout(() => {
    getLocation()
  }, 300)
})
</script>

<template>
  <div class="w-100vw h-100vh relative">
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
            isListRoute ? $t('common.equipmentList') : getTitle
          }}</span>
        </div>
      </template>
      <template #right>
        <img v-if="!isListRoute" class="h-150% dark-logo" src="@/assets/images/app/logo.png" />
        <!-- @click="go2AI" -->
      </template>
    </van-nav-bar>
    <div class="flex flex-col h-full main-content">
      <div class="shadow-md w-full h-46px"></div>
      <div class="w-full flex-1 overflow-hidden">
        <div class="h-full overflow-scroll router-container">
          <Transition :css="false" @enter="enter" @leave="leave">
            <RouterView class="router-view" />
          </Transition>
        </div>
      </div>
    </div>
    <TabBar
      :tabList="tabList"
      :defaultColor="themeMode === 'dark' ? '#ffffff' : '#9ca3af'"
      :activeColor="themeMode === 'dark' ? 'rgba(255, 107, 107, 0.8)' : '#ff6b6b'"
    />
    <LanguageSwitcher v-if="appStore.tabbarActive == 'product' && !isListRoute" />
    <TipIcon v-if="productStore.posterImageUrls?.length" />
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
.main-content {
  padding-bottom: calc(constant(safe-area-inset-bottom) + 50px); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 50px); /* 兼容 iOS >= 11.2 */
}

.router-container {
  position: relative;
  height: 100%;
  perspective: 1200px; /* 透视强度 */
  overflow-x: hidden;
}

.router-view {
  box-sizing: border-box;
  backface-visibility: hidden; /* 优化3D渲染 */
  transform-style: preserve-3d;
}
</style>
