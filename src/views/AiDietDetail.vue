<template>
  <div class="flex h-full overflow-scroll flex-col bg-#f7f7f7" id="ai-diet-detail">
    <div class="bg-#ffffff">
      <div class="flex flex-col items-center justify-center mt-20px">
        <p class="text-center font-bold text-20px my-10px">{{ getI18NDietName() }}</p>
      </div>
      <div class="flex flex-col mt-20px" v-if="getI18NDescription()">
        <span class="font-bold text-18px px-10px">{{ $t('introduction') }}</span>
        <p class="text-14px my-10px px-10px pre-line-content">{{ getI18NDescription() }}</p>
      </div>
      <div class="flex flex-col mt-20px">
        <span class="font-bold text-18px px-10px">{{ $t('ingredients') }}</span>
        <p
          v-for="item in diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookIngredientList
            .length
            ? diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookIngredientList
            : diet?.aiCookbookMultiLanguageObj['en']?.aiCookbookIngredientList"
          :key="item.id"
          class="text-14px my-10px px-10px"
        >
          {{ item.ingredient }}
        </p>
      </div>
      <div class="flex flex-col mt-20px">
        <span class="font-bold text-18px px-10px">{{ $t('productDescription') }}</span>
        <p
          v-for="item in diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookProductList
            .length
            ? diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookProductList
            : diet?.aiCookbookMultiLanguageObj['en']?.aiCookbookProductList"
          :key="item.id"
          class="text-14px my-10px px-10px"
        >
          {{ item.productName }}
        </p>
      </div>
      <div class="flex flex-col mt-20px">
        <span class="font-bold text-18px px-10px">{{ $t('steps') }}</span>
        <div
          v-for="item in diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookStepList
            ?.length
            ? diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookStepList
            : diet?.aiCookbookMultiLanguageObj['en']?.aiCookbookStepList"
          :key="item.id"
          class="text-14px my-10px px-10px"
        >
          {{ item.description }}
          <img v-if="item.imageUrl" class="w-full mt-10px" :src="item.imageUrl" />
        </div>
      </div>
      <div class="flex flex-col mt-20px">
        <span class="font-bold text-18px px-10px">{{ $t('notes') }}</span>
        <div
          v-for="item in diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookNoteList
            ?.length
            ? diet?.aiCookbookMultiLanguageObj[locale || 'en']?.aiCookbookNoteList
            : diet?.aiCookbookMultiLanguageObj['en']?.aiCookbookNoteList"
          :key="item.id"
          class="text-14px my-10px px-10px"
        >
          {{ item.noteNum }}. {{ item.description }}
        </div>
      </div>
      <div class="text-12px text-center my-20px text-gray-300">
        {{ $t('AiDietTips') }}
      </div>
    </div>
    <CommentList ref="commentListRef" @comment-created="commentSubmit" />
    <div
      class="sticky flex justify-between items-center w-full border-solid border-t-1 border-[#f2f2f2] p-10px bg-#ffffff bottom-0 left-0"
    >
      <div>{{ getI18NDietName() }}</div>
      <div class="flex items-center">
        <div class="flex items-center mr-8px" @click.stop="handleLike">
          <van-icon name="like-o" v-if="!diet?.isLiked" class="mr-2px" />
          <van-icon name="like" v-else color="#ff6b6b" class="mr-2px" />
          <span class="text-[--vt-c-text-light-2] text-12px">{{
            diet?.likeCount ? diet?.likeCount : $t('like')
          }}</span>
        </div>
        <div class="flex items-center ml-8px" @click="handleComment">
          <van-icon name="comment-o" v-if="!diet?.isCommented" class="mr-2px" />
          <van-icon name="comment" v-else color="#ff6b6b" class="mr-2px" />
          <span class="text-[--vt-c-text-light-2] text-12px">{{
            diet?.commentCount ? diet?.commentCount : $t('comment')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AiCookbook, createAiCookbookLike, getAiCookbookDetail } from '@/api/modules/aiDiet'
import { useAppStore } from '@/stores/app'
import { useCountryCodeByLocationOrIp } from '@/stores/countryCodeByLocationOrIp'
import { useUserInfoStore } from '@/stores/userInfo'
import { isElementPartiallyInViewport } from '@/utils'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
const userInfoStore = useUserInfoStore()
const countryCode = useCountryCodeByLocationOrIp()
const route = useRoute()

const diet = ref<AiCookbook>()

const { locale } = useI18n()
const appStore = useAppStore()
appStore.tabbarActive = route.name as string

const getI18NDietName = () => {
  return (
    diet.value?.aiCookbookMultiLanguageObj[locale.value || 'en']?.cookbookName ??
    diet.value?.aiCookbookMultiLanguageObj['en']?.cookbookName
  )
}

const getI18NDescription = () => {
  return (
    diet.value?.aiCookbookMultiLanguageObj[locale.value || 'en']?.description ??
    diet.value?.aiCookbookMultiLanguageObj['en']?.description
  )
}
const commentListRef = ref()
const handleComment = () => {
  // 留言列表可视时，打开输入留言，不可视时滚动定位到留言列表
  if (isElementPartiallyInViewport(document.querySelector('#comment-list'))) {
    commentListRef.value?.handleOpenCommentInput()
  } else {
    document.querySelector('#comment-list')?.scrollIntoView({
      behavior: 'smooth',
    })
  }
}
onBeforeMount(async () => {
  const dietRes = await getAiCookbookDetail({
    id: Number(route.params.id),
    userId: userInfoStore.id,
  })
  diet.value = dietRes.data
  diet.value.aiCookbookMultiLanguageObj = diet.value?.aiCookbookLanguageList?.reduce(
    (acc, curr) => {
      acc[curr.languageCode] = curr
      return acc
    },
    {},
  )
  if (!Object.keys(diet.value.aiCookbookMultiLanguageObj).length) {
    diet.value.aiCookbookMultiLanguageObj = {
      zh: {},
      en: {},
    }
  }
})
const handleLike = async () => {
  await createAiCookbookLike({
    aiCookbookId: diet.value?.id,
    userId: userInfoStore.id,
    userName: userInfoStore.name,
    countryCode: countryCode.code,
  })
  if (diet.value) {
    diet.value.likeCount = diet.value.likeCount + 1
    diet.value.isLiked = true
  }
}
const commentSubmit = (e) => {
  if (diet.value) {
    diet.value.commentCount = e
    diet.value.isCommented = true
  }
}
</script>

<style lang="less" scoped>
.colorful-text {
  text-transform: uppercase;
  background: linear-gradient(to right, #30cfd0 0%, #330867 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Poppins', sans-serif;
}
</style>

<style>
.diagonal-box {
  position: relative;
  width: 70px;
  height: 16px;
}

.diagonal-box::before {
  content: '';
  position: absolute;
  top: 5px;
  left: -36px;
  width: 100%;
  height: 100%;
  /* 绘制斜线，通过旋转实现，这里角度可根据容器宽高比例微调 */
  transform: skew(55deg);
  border-right: 1px solid #000; /* 斜线边框 */
}

.text {
  position: absolute;
}

.portion {
  bottom: -13px;
  left: 3px;
}

.status {
  bottom: 0;
  right: 5px;
}
</style>
