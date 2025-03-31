<template>
  <van-form @submit="onSubmit" v-if="!isInfoCollected">
    <van-cell-group inset>
      <van-field
        v-model="form.height"
        name="height"
        label="身高"
        placeholder="身高"
        :rules="[{ required: true, message: '请填写身高' }]"
      />
      <van-field
        v-model="form.weight"
        name="weight"
        label="体重"
        placeholder="体重"
        :rules="[{ required: true, message: '请填写体重' }]"
      />
      <van-field
        v-model="form.breakfast"
        name="breakfast"
        label="早餐"
        placeholder="早餐吃了什么？"
        :rules="[{ required: true, message: '请填写早餐食物名称' }]"
      />
      <van-field
        v-model="form.lunch"
        name="lunch"
        label="午餐"
        placeholder="午餐吃了什么？"
        :rules="[{ required: true, message: '请填写午餐食物名称' }]"
      />
      <van-field
        v-model="form.dinner"
        name="dinner"
        label="晚餐"
        placeholder="晚餐吃了什么？"
        :rules="[{ required: true, message: '请填写晚餐食物名称' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 开始分析 </van-button>
    </div>
  </van-form>
  <div class="flex flex-col justify-between items-center" v-if="isInfoCollected">
    <div class="w-full h-500px mt-20px" ref="echart1Ref"></div>
    <div class="flex gap-10px px-10px">
      <div
        class="border-3px border-#3CB371 w-1/2 h-100px border-solid box-border rounded-8px flex justify-between items-center p-10px"
      >
        <div class="flex flex-col">
          <span class="">体脂率：23.9</span>
          <span class="mt-10px">基础消耗：1800kcal/(kg.h)</span>
        </div>
        <div>
          <img class="w-80px" src="../assets/images/app/body.png" />
        </div>
      </div>
      <div
        class="border-3px border-#f40 w-1/2 h-100px border-solid box-border rounded-8px flex justify-between items-center p-10px"
      >
        <div class="flex flex-col">
          <span class="">摄入能量：5000kcal</span>
        </div>
        <div>
          <img class="w-80px" src="../assets/images/app/energy.png" />
        </div>
      </div>
    </div>
    <div class="mt-20px px-10px">
      <p>
        <span class="text-18px font-bold">Tip</span
        >：①膳食纤维摄入过少，容易导致便秘，建议多吃蔬菜；②能量摄入明显高于日常人体基础消耗，请注意运动
      </p>
    </div>
    <div class="mt-50px">
      <p class="text-#8B0000 text-center">前往下载APP >>></p>
      <p class="text-#8B0000 text-13px">
        我们提供健康食谱、烹饪工具、日志记录、更精准的饮食规划与分析
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'

const isInfoCollected = ref(true)

const form = reactive({
  height: 175,
  weight: 60,
  breakfast: '',
  lunch: '',
  dinner: '',
  other: '',
})

const onSubmit = async () => {
  isInfoCollected.value = true
  await nextTick()
  initChart()
}

const echart1Ref = ref<HTMLElement | null>(null)

onMounted(() => {
  if (isInfoCollected.value) initChart()
})

onUnmounted(() => {
  if (echart1Ref.value) {
    echarts.dispose(echart1Ref.value)
  }
})

// 基础配置一下Echarts
function initChart() {
  const chart = echarts.init(echart1Ref.value, 'light')
  // 把配置和数据放这里
  chart.setOption({
    title: {
      text: '智能分析',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '脂肪' },
          { value: 735, name: '水分' },
          { value: 580, name: '糖分' },
          { value: 10, name: '膳食纤维' },
          { value: 300, name: '蛋白质' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
  window.onresize = function () {
    //自适应大小
    chart.resize()
  }
}
</script>

<style lang="css" scoped></style>
