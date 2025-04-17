<template>
  <div>
    <label for="language-select">Language:</label>
    <select id="language-select" v-model="currentLocale" @change="changeLanguage">
      <option v-for="(label, locale) in languages" :key="locale" :value="locale">
        {{ label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = {
  en: 'English',
  'zh-CN': '中文',
};

const currentLocale = ref<string>(locale.value);

const changeLanguage = () => {
  locale.value = currentLocale.value;
};
</script>

<style scoped>
select {
  margin-left: 8px;
  padding: 4px;
}
</style>