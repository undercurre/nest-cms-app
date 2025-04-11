<template>
  <div class="list-view">
    <div class="list-container">
      <!-- Left Column - Device List -->
      <div class="left-column">
        <el-card class="device-list">
          <template #header>
            <div class="header">
              <span>设备列表</span>
            </div>
          </template>
        </el-card>

        <div class="w-full grid grid-cols-2 gap-10px place-items-center">
          <div
            class="h-300px flex flex-col justify-center items-center"
            v-for="item in deviceList"
            :key="item.id"
          >
            <img class="w-full h-200px" :src="item.imageOssUrl" />
            <div>
              <span>设备名称：{{ item.productName }}</span>
            </div>
            <div>
              <span>设备型号：{{ item.productModel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { getDeviceListByUid } from '@/api/modules/list'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { Product } from '@/api/modules/product'

const route = useRoute()
const token = typeof route.query.token === 'string' ? decodeURIComponent(route.query.token) : '' // 类型断言
const appStore = useAppStore()
if (token) {
  localStorage.setItem('token', token)
  appStore.token = token
}
const deviceList = ref<Product[]>([])

onBeforeMount(async () => {
  const res = await getDeviceListByUid()
  console.log(res.data)
  deviceList.value = res.data
})
</script>

<style scoped>
.list-view {
  padding: 20px;
}

.list-container {
  display: flex;
  gap: 20px;
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
