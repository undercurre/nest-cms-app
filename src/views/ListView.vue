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
            <img
              class="h-200px"
              src="https://img.pchome.com.tw/cs/items/DSBE1EA900HS0HS/000001_1725335604.jpg"
            />
            <div>
              <span>设备名称：{{ item.name }}</span>
            </div>
            <div>
              <span>设备型号：{{ item.modal }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const deviceList = ref([
  { id: 1, name: '设备1', modal: 'n24011-1' },
  { id: 2, name: '设备2', modal: 'n24011-2' },
  { id: 3, name: '设备3', modal: 'n24011-3' },
])
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
