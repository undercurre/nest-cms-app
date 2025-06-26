<template>
  <div
    class="w-full h-58px rounded-8px shadow-md overflow-hidden flex flex-col"
    @click="handle2Detail"
  >
    <div class="h-58px bg-#fff px-8px py-6px flex flex-col justify-between">
      <p class="font-bold text-14px leading-21px text-#000 truncate">{{ cookbookName }}</p>
      <div class="flex text-12px m-t-8px">
        <div class="flex items-center mr-8px" @click.stop="handleLike">
          <van-icon name="like-o" v-if="!isLiked" class="mr-2px" />
          <van-icon name="like" v-else color="#ff6b6b" class="mr-2px" />
          <span class="text-[--vt-c-text-light-2] truncate">{{
            likeCount ? likeCount : $t('like')
          }}</span>
        </div>
        <div class="flex items-center">
          <van-icon name="comment-o" v-if="!isCommented" class="mr-2px" />
          <van-icon name="comment" v-else color="#ff6b6b" class="mr-2px" />
          <span class="text-[--vt-c-text-light-2] truncate">{{
            commentCount ? commentCount : $t('comment')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createAiCookbookLike } from '@/api/modules/aiDiet'
import router from '@/router'
import { useCountryCodeByLocationOrIp } from '@/stores/countryCodeByLocationOrIp'
import { useUserInfoStore } from '@/stores/userInfo'

interface Props {
  id: number
  cookbookName: string
  likeCount: number
  commentCount: number
  isCommented: boolean
  isLiked: boolean
}

const emits = defineEmits(['update:likeCount', 'update:isLiked'])

const props = withDefaults(defineProps<Props>(), {
  cookbookName: '',
  likeCount: 0,
  commentCount: 0,
})
const countryCode = useCountryCodeByLocationOrIp()
const userInfoStore = useUserInfoStore()

const handleLike = async () => {
  await createAiCookbookLike({
    aiCookbookId: props.id,
    userId: userInfoStore.id,
    userName: userInfoStore.name,
    countryCode: countryCode.code,
  })
  emits('update:likeCount', props.likeCount + 1)
  emits('update:isLiked', true)
}
function handle2Detail() {
  router.push({ name: 'AiDietDetail', params: { id: props.id } })
}
</script>
