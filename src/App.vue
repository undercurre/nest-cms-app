<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import DietActiveIcon from '@/assets/images/app/diet_active.png'
import DietInActiveIcon from '@/assets/images/app/diet_inactive.png'
import ProductActiveIcon from '@/assets/images/app/product_active.png'
import ProductInActiveIcon from '@/assets/images/app/product_inactive.png'
import GuideActiveIcon from '@/assets/images/app/guide_active.png'
import GuideInActiveIcon from '@/assets/images/app/guide_inactive.png'
import StatisticsActiveIcon from '@/assets/images/app/statistics_active.png'
import StatisticsInActiveIcon from '@/assets/images/app/statistics_inactive.png'
import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import router from './router'
import { computed, onMounted, ref, nextTick } from 'vue'
import { goBack2Native } from './api/modules/native'
import { useI18n } from 'vue-i18n' 

const { locale } = useI18n()

const route = useRoute()

// 检查当前路由是否为 list
const isListRoute = computed(() => route.name === 'list')

const productStore = useProductStore()
const appStore = useAppStore()

const couponShow = ref(false)

// NavBar
function onClickLeft() {
  if (window.history.length <= 1) {
    // 无法后退时的处理
    console.log('无法后退')
    // 跳到原生
    // goBack2Native()
    window.flutter_inappwebview?.callHandler('jsHandler', 'goBack').then(() => {
      console.log('goBack 调用成功')
    })
  } else {
    router.back()
  }
}

function go2AI() {
  router.push('/ai')
}

// 获取系统语言
function getLanguage() {
  if(!localStorage.getItem('locale')) {
    localStorage.setItem('locale', route.query.lang || 'en')
  }
  locale.value = route.query.lang || localStorage.getItem('locale') || 'en'
  console.log('当前语言:', locale.value)
}

onMounted(() => {
  setTimeout(() => {
    couponShow.value = true
  }, 1000)
  setTimeout(() => {
    getLanguage()
  })
})
</script>

<template>
  <div class="w-100vw h-100vh">
    <van-nav-bar :safe-area-inset-top="true" :border="true" :fixed="true" title="">
      <template #left>
        <div class="flex items-center">
          <img
            class="w-14px h-14px mr-10px"
            src="@/assets/images/app/left-arrow.png"
            @click="onClickLeft"
          />
          <span class="w-full font-bold leading-28px text-18px">{{
            isListRoute ? $t("common.equipmentList") : $t("common.smartKitchenAssistant")
          }}</span>
        </div>
      </template>
      <template #right>
        <img v-if="!isListRoute" class="h-150%" src="@/assets/images/app/logo.png" />
        <!-- @click="go2AI" -->
      </template>
    </van-nav-bar>
    <div class="flex flex-col h-full">
      <div class="shadow-md w-full h-46px"></div>

      <div class="w-full flex-1 overflow-hidden">
        <div class="h-full overflow-scroll">
          <RouterView />
        </div>
      </div>

      <van-tabbar
        v-if="!isListRoute"
        class="shrink-0"
        :fixed="false"
        :safe-area-inset-bottom="true"
        v-model="appStore.tabbarActive"
        active-color="#000000"
        inactive-color="#000000"
      >
        <van-tabbar-item name="guide" replace :to="`/guide/${productStore.id}`">
          <span>{{ $t("common.operationInstructions") }}</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? GuideActiveIcon : GuideInActiveIcon"
            />
          </template>
        </van-tabbar-item>
        <van-tabbar-item name="product" replace :to="`/product/${productStore.id}`"
          ><span>{{ $t("common.productDescription") }}</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? ProductActiveIcon : ProductInActiveIcon"
            /> </template
        ></van-tabbar-item>
        <van-tabbar-item name="diet" replace :to="`/diet/${productStore.id}`"
          ><span>{{ $t("common.completeRecipeCollection") }}</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? DietActiveIcon : DietInActiveIcon"
            /> </template
        ></van-tabbar-item>
        <van-tabbar-item name="statistics" replace :to="`/statistics`"
          ><span>{{ $t("common.smartAnalysis") }}</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? StatisticsActiveIcon : StatisticsInActiveIcon"
            /> </template
        ></van-tabbar-item>
      </van-tabbar>
    </div>
    <van-tabbar
      v-if="!isListRoute"
      :safe-area-inset-bottom="false"
      v-model="appStore.tabbarActive"
      active-color="#000000"
      inactive-color="#000000"
    >
      <van-tabbar-item name="guide" replace :to="`/guide/${productStore.id}`">
        <span>{{ $t("common.operationInstructions") }}</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? GuideActiveIcon : GuideInActiveIcon"
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="product" replace :to="`/product/${productStore.id}`"
        ><span>{{ $t("common.productDescription") }}</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? ProductActiveIcon : ProductInActiveIcon"
          /> </template
      ></van-tabbar-item>
      <van-tabbar-item name="diet" replace :to="`/diet/${productStore.id}`"
        ><span>{{ $t("common.completeRecipeCollection") }}</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? DietActiveIcon : DietInActiveIcon"
          /> </template
      ></van-tabbar-item>
      <!-- <van-tabbar-item name="statistics" replace :to="`/statistics`"
        ><span>智能分析</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? StatisticsActiveIcon : StatisticsInActiveIcon"
          /> </template
      ></van-tabbar-item> -->
    </van-tabbar>
    <!-- <van-overlay :show="couponShow" @click="couponShow = false" />
    <img
      v-if="couponShow"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-999"
      src="./assets//images/app/coupon.png"
      @click="go2SaleApp"
    /> -->
  </div>
</template>

<style scoped>
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
</style>
