<script setup lang="ts">
import { RouterView } from 'vue-router'

import DietActiveIcon from '@/assets/images/app/diet_active.png'
import DietInActiveIcon from '@/assets/images/app/diet_inactive.png'
import ProductActiveIcon from '@/assets/images/app/product_active.png'
import ProductInActiveIcon from '@/assets/images/app/product_inactive.png'
import GuideActiveIcon from '@/assets/images/app/guide_active.png'
import GuideInActiveIcon from '@/assets/images/app/guide_inactive.png'
import { useProductStore } from '@/stores/product'
import { useAppStore } from '@/stores/app'
import router from './router'

const productStore = useProductStore()
const appStore = useAppStore()

// NavBar
function onClickLeft() {
  router.back()
}

function go2AI() {
  router.push('/ai')
}
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
          <span class="w-full font-bold leading-28px text-18px">智能厨房助手</span>
        </div>
      </template>
      <template #right>
        <img class="h-150%" src="@/assets/images/app/logo.png" @click="go2AI" />
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
        class="shrink-0"
        :fixed="false"
        :safe-area-inset-bottom="true"
        v-model="appStore.tabbarActive"
        active-color="#000000"
        inactive-color="#000000"
      >
        <van-tabbar-item name="guide" replace :to="`/guide/${productStore.id}`">
          <span>操作指引</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? GuideActiveIcon : GuideInActiveIcon"
            />
          </template>
        </van-tabbar-item>
        <van-tabbar-item name="product" replace :to="`/product/${productStore.id}`"
          ><span>产品说明</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? ProductActiveIcon : ProductInActiveIcon"
            /> </template
        ></van-tabbar-item>
        <van-tabbar-item name="diet" replace :to="`/diet/${productStore.id}`"
          ><span>食谱大全</span>
          <template #icon="props">
            <img
              class="w-15px h-15px pb-8px"
              :src="props.active ? DietActiveIcon : DietInActiveIcon"
            /> </template
        ></van-tabbar-item>
      </van-tabbar>
    </div>
    <van-tabbar
      :safe-area-inset-bottom="false"
      v-model="appStore.tabbarActive"
      active-color="#000000"
      inactive-color="#000000"
    >
      <van-tabbar-item name="guide" replace :to="`/guide/${productStore.id}`">
        <span>操作指引</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? GuideActiveIcon : GuideInActiveIcon"
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="product" replace :to="`/product/${productStore.id}`"
        ><span>产品说明</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? ProductActiveIcon : ProductInActiveIcon"
          /> </template
      ></van-tabbar-item>
      <van-tabbar-item name="diet" replace :to="`/diet/${productStore.id}`"
        ><span>食谱大全</span>
        <template #icon="props">
          <img
            class="w-15px h-15px pb-8px"
            :src="props.active ? DietActiveIcon : DietInActiveIcon"
          /> </template
      ></van-tabbar-item>
    </van-tabbar>
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
