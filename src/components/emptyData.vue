<script setup lang="ts">
import emptyDefaultImage from '@/assets/images/app/empty.png'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
withDefaults(
  defineProps<{
    image: string
    description?: string
    imageSize?: number
  }>(),
  {
    image: '',
    description: undefined,
    imageSize: 80,
  },
)
</script>

<template>
  <van-empty
    :image="image || emptyDefaultImage"
    :image-size="imageSize"
    :description="description ?? t('noData')"
  />
</template>

<style lang="scss" scoped></style>
