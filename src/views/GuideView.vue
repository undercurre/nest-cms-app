<script setup lang="ts">
import { getGuideList, type Guide } from '@/api/modules/guide'
import VideoCard from '@/components/guide/VideoCard.vue'
import { useAppStore } from '@/stores/app'
import { useProductStore } from '@/stores/product'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const appStore = useAppStore()

const route = useRoute()
const productId = route.params.id // 获取路径参数
productStore.id = Number(productId || 0)
appStore.tabbarActive = route.name as string

const guides = ref<Guide[]>()

onBeforeMount(async () => {
  const res = await getGuideList({
    productModel: encodeURIComponent(productStore.productModel),
    pageNo: 1,
    pageSize: 9999999,
  })
  // TODO: 去掉
  // const res = {
  //   code: 200,
  //   msg: 'Success',
  //   data: {
  //     guideList: [
  //       {
  //         id: 1,
  //         productModelIdList: [
  //           {
  //             productId: 1,
  //             productModel: 'WT-2023',
  //           },
  //           {
  //             productId: 2,
  //             productModel: 'DS-5G',
  //           },
  //         ],
  //         guideLanguageDtoList: [
  //           {
  //             languageId: 9,
  //             languageCode: 'zh',
  //             displayLanguage: '中文',
  //             videoUrl:
  //               'https://mova-cook.oss-cn-shanghai.aliyuncs.com/third-party-server/avatar/auto_upload/20250514115657043.mp4',
  //             title: '基础使用教程',
  //             description: '掌控智能厨房助手的基本操作要领',
  //           },
  //           {
  //             languageId: 8,
  //             languageCode: 'en',
  //             displayLanguage: '英文',
  //             videoUrl:
  //               'https://mova-cook.oss-cn-shanghai.aliyuncs.com/third-party-server/avatar/auto_upload/20250514115657043.mp4',
  //             title: 'Basic usage tutorial',
  //             description: 'Master the basic operation essentials of smart kitchen assistant',
  //           },
  //         ],
  //       },
  //       {
  //         id: 5,
  //         productModelIdList: [
  //           {
  //             productId: 1,
  //             productModel: 'WT-2023',
  //           },
  //           {
  //             productId: 2,
  //             productModel: 'DS-5G',
  //           },
  //         ],
  //         guideLanguageDtoList: [
  //           {
  //             languageId: 9,
  //             languageCode: 'zh',
  //             displayLanguage: '中文',
  //             videoUrl:
  //               'https://mova-cook.oss-cn-shanghai.aliyuncs.com/third-party-server/avatar/auto_upload/20250514115657043.mp4',
  //             title: '土豆泥',
  //             description: '栋笃笃',
  //           },
  //           {
  //             languageId: 8,
  //             languageCode: 'en',
  //             displayLanguage: '英文',
  //             videoUrl:
  //               'https://mova-cook.oss-cn-shanghai.aliyuncs.com/third-party-server/avatar/auto_upload/20250514115657043.mp4',
  //             title: 'mashed potatoes',
  //             description: 'Dong Tuk Tuk',
  //           },
  //         ],
  //       },
  //     ],
  //     total: 2,
  //   },
  // }
  guides.value = res.data.guideList
  guides.value.forEach((item) => {
    item.guideMultiLanguageObj = {}
    item.guideLanguageDtoList?.forEach((item) => {
      if (item.languageCode === 'zh') {
        item.languageCode = 'zh-CN'
      }
    })
    item.guideMultiLanguageObj = item?.guideLanguageDtoList?.reduce((acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    }, {})
  })
})
</script>

<template>
  <div class="px-20px flex flex-col justify-around items-center">
    <VideoCard v-for="item in guides" :key="item.id" :resource="item"></VideoCard>
  </div>
</template>
