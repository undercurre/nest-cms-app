<template>
  <div class="list-view">
    <div class="list-container">
      <!-- Left Column - Device List -->
      <div class="left-column">
        <el-card class="device-list">
          <template #header>
            <div class="header">
              <span>{{$t("common.equipmentList")}}</span>
            </div>
          </template>
        </el-card>

        <div class="w-full grid grid-cols-2 gap-10px place-items-center">
          <div
            class="h-300px flex flex-col justify-center items-center"
            v-for="item in deviceList"
            :key="item.id"
          >
            <img class="w-full h-200px" :src="getUrlConcat(item.imageOssUrl)" />
            <div>
              <span>{{$t("device.deviceName")}}：{{ item.productName }}</span>
            </div>
            <div>
              <span>{{$t("device.deviceModel")}}：{{ item.productModel }}</span>
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

// url加http前缀
const getUrlConcat = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${window.location.protocol}//${url}`;
};
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
