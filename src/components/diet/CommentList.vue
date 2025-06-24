<template>
  <div class="comment-list bg-#ffffff m-t-10px p-10px" id="comment-list">
    <div class="comment-list-title font-600 text-16px">
      {{ $t('comment') }} {{ pageConfig.total }}
    </div>
    <div
      class="comment-list-input-fake rounded-4px bg-#f7f7f7 p-6px text-#bbbbbb m-y-10px text-14px"
      @click="handleOpenCommentInput"
    >
      {{ $t('writeComment') }}
    </div>
    <div class="comment-list-content" v-if="comments.length">
      <div class="comment-item m-y-14px flex flex-col" v-for="item in comments" :key="item.id">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-#767674 text-14px">{{ $t('user') }}{{ item.userName }}</span>
            <span
              class="rounded-14px bg-#ffecef text-#cb4b5e text-12px m-l-6px p-4px"
              v-if="item.userId === userInfoStore.id"
              >{{ $t('me') }}</span
            >
          </div>
          <div class="text-14px text-#b3b3b1">{{ item.createTime }}</div>
        </div>
        <div class="m-t-8px pre-line-content">{{ item.comment }}</div>
      </div>
      <!-- 加载中状态 -->
      <div class="loading-state py-8px text-center text-12px" v-show="isLoading">
        <p class="mt-2 text-gray-500">{{ $t('loadMore') }}</p>
      </div>
      <!-- 没有更多数据 -->
      <div
        class="no-more-data py-8px text-center text-gray-500 text-12px"
        v-show="!isLoading && hasMoreData === false"
      >
        <p>{{ $t('noMore') }}</p>
      </div>
    </div>
    <EmptyData v-if="!comments?.length" />
    <van-popup
      v-model:show="showCommentInput"
      position="bottom"
      :style="{ maxHeight: '175px', height: '175px' }"
      teleport="body"
    >
      <div class="p-y-10px">
        <van-field
          class="comment-list-input"
          v-model="comment"
          rows="2"
          autosize
          type="textarea"
          maxlength="1000"
          placeholder="请输入留言"
          show-word-limit
          ref="commentListInput"
        />
        <div class="float-right m-t-8px p-x-10px">
          <van-button type="primary" round size="small" @click="handleSubmitComment">{{
            $t('send')
          }}</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
import {
  AiCookbookComment,
  createAiCookbookComment,
  getAiCookbookCommentList,
} from '@/api/modules/aiDiet'
import { useCountryCodeByLocationOrIp } from '@/stores/countryCodeByLocationOrIp'
import { useUserInfoStore } from '@/stores/userInfo'
import _ from 'lodash'
import { showToast } from 'vant'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
const userInfoStore = useUserInfoStore()
const countryCode = useCountryCodeByLocationOrIp()
const emits = defineEmits(['comment-created'])
const { t } = useI18n()
const route = useRoute()
const comments = ref<AiCookbookComment[]>([])
const comment = ref('')
const pageConfig = ref({
  pageNo: 1,
  pageSize: 20,
  total: 0,
})
const isLoading = ref(false)
const hasMoreData = ref(true)
// 处理滚动事件
const handleScroll = () => {
  if (!document.querySelector('#ai-diet-detail')) return
  if (
    (document.querySelector('#ai-diet-detail')?.scrollTop || 0) +
      (document.querySelector('#ai-diet-detail')?.clientHeight || 0) >=
    (document.querySelector('#ai-diet-detail')?.scrollHeight || 0) - 100
  ) {
    getComments()
  }
}
const getComments = async () => {
  if (isLoading.value || !hasMoreData.value) return
  isLoading.value = true
  const res = await getAiCookbookCommentList({
    aiCookbookId: Number(route.params.id),
    pageNo: pageConfig.value.pageNo,
    pageSize: pageConfig.value.pageSize,
  })
  comments.value = [...comments.value, ...res.data.aiCookbookCommentList]
  pageConfig.value.total = res.data.total
  emits('comment-created', pageConfig.value.total)
  // 判断是否还有更多数据
  hasMoreData.value = pageConfig.value.total > comments.value.length

  if (hasMoreData.value) {
    pageConfig.value.pageNo++
  }

  isLoading.value = false
}
const showCommentInput = ref(false)
const commentListInput = ref()
const handleOpenCommentInput = () => {
  showCommentInput.value = true
  nextTick(() => {
    commentListInput.value?.focus()
  })
}
const submitComment = async () => {
  try {
    await createAiCookbookComment({
      aiCookbookId: Number(route.params.id),
      userId: userInfoStore.id,
      userName: userInfoStore.name,
      countryCode: countryCode.code,
      comment: comment.value,
    })
    commentListInput.value?.blur()
    comment.value = ''
    showCommentInput.value = false
    pageConfig.value = {
      pageNo: 1,
      pageSize: 20,
      total: 0,
    }
    isLoading.value = false
    hasMoreData.value = true
    comments.value = []
    getComments()
    showToast(t('commentSuccessful'))
    setTimeout(() => {
      document.querySelector('#comment-list')?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 500)
  } catch (e) {
    console.log('e: ', e)
    showToast(t('commentFailed'))
  }
}
const handleSubmitComment = _.debounce(submitComment, 250, { maxWait: 1000 })
watch(
  () => route.params.id,
  () => {
    getComments()

    nextTick(() => {
      // 监听滚动
      document.querySelector('#ai-diet-detail')?.addEventListener('scroll', handleScroll)
    })
  },
  {
    immediate: true,
    deep: true,
  },
)
onBeforeUnmount(() => {
  document.querySelector('#ai-diet-detail')?.removeEventListener('scroll', handleScroll)
})
defineExpose({
  handleOpenCommentInput,
})
</script>
<style lang="less">
.comment-list-input .van-field__body .van-field__control {
  overflow: auto;
  max-height: 74px;
  height: 74px !important;
}
</style>
