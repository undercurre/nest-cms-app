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

        <div class="my-20px pl-10px">
          <p>
            <span class="font-semibold">{{ $t('list.collectPrefix') }}</span>
            <span class="font-black p-16px">{{ deviceList.length }}</span>
            <span class="font-semibold">{{ $t('list.collectSuffix') }}</span>
          </p>
        </div>

        <div class="w-full grid grid-cols-3 gap-10px place-items-center">
          <div
            class="w-full h-200px flex flex-col justify-center shadow-2xl rounded-20px overflow-hidden border-1px border-solid border-[#434343]/10 cursor-pointer"
            v-for="item in deviceList"
            :key="item.id"
            @click="go2Detail(item.id)"
          >
            <img
              class="w-full h-full object-cover shadow-md"
              :src="getUrlConcat(item.imageOssUrl)"
            />
            <div class="w-full">
              <div class="w-full text-center truncate text-12px leading-15px mt-4px">
                {{ handleProductName(item) }}
              </div>
              <div class="w-full text-center truncate text-12px leading-15px mb-4px">
                {{ item.productModel }}
              </div>
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
import { getUrlConcat } from '@/utils/index'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { locale } = useI18n()
const token = typeof route.query.token === 'string' ? route.query.token : '' // 类型断言
const appStore = useAppStore()
if (token) {
  localStorage.setItem('token', token)
  appStore.token = token
}
const deviceList = ref<Product[]>([])

const go2Detail = (id: number) => {
  router.push(`/product/${id}`)
}

const handleProductName = (item) => {
  return item?.productMultiLanguageObj?.[handleLocaleIndex()]
    ? item?.productMultiLanguageObj?.[handleLocaleIndex()]?.productName
    : item?.productMultiLanguageObj?.['en']?.productName
}

const handleLocaleIndex = () => {
  return locale.value === 'zh-CN' ? 'zh' : locale.value
}

onBeforeMount(async () => {
  const res = await getDeviceListByUid()
  deviceList.value = res.data
  deviceList.value.forEach((item) => {
    item.productMultiLanguageObj = item.productLanguageDtoList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
  })
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
