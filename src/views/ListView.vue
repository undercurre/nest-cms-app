<template>
  <div class="list-view">
    <div class="list-container">
      <!-- Left Column - Device List -->
      <div class="left-column">
        <el-card class="device-list">
          <template #header>
            <div class="header">
              <span>{{ $t('common.equipmentList') }}</span>
            </div>
          </template>
        </el-card>

        <div class="w-full grid grid-cols-3 gap-10px place-items-center">
          <div
            class="w-full rounded-8px shadow-md flex flex-col"
            v-for="item in deviceList"
            :key="item.id"
            @click="go2Detail(item.id)"
          >
            <img class="w-full h-100px rounded-t-8px" :src="getUrlConcat(item.imageOssUrl)" />
            <div class="px-6px pt-4px text-12px font-bold truncate w-full">
              {{ item.productModel }} {{ item.productModel ? $t('product.series') : '' }}
            </div>
            <div class="px-6px pb-6px text-12px truncate w-full">
              {{ item.productName }}
            </div>
          </div>
        </div>

        <div v-if="deviceList.length === 0">
          <div class="w-full h-300px flex justify-center items-center">
            <span>{{ $t('common.noData') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getDeviceListByUid } from '@/api/modules/list'
import type { Product } from '@/api/modules/product'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { getUrlConcat } from '@/utils'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = typeof route.query.token === 'string' ? decodeURIComponent(route.query.token) : '' // 类型断言
const appStore = useAppStore()
if (token) {
  localStorage.setItem('token', token)
  appStore.token = token
}
const deviceList = ref<Product[]>([])

const go2Detail = (id: number) => {
  router.push(`/product/${id}`)
}

onBeforeMount(async () => {
  const res = await getDeviceListByUid()
  console.log(res.data)
  deviceList.value = res.data
})
</script>

<style scoped>
.list-view {
  padding: 12px;
}

.list-container {
  display: flex;
  gap: 12px;
}

.left-column {
  flex: 1;
}

.right-column {
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 200px;
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  gap: 10px;
}

.detail-item label {
  font-weight: bold;
  width: 80px;
}
</style>
