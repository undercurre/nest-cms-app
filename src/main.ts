import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import i18nOptions from './lang/locales';

import App from './App.vue'
import router from './router'

import 'virtual:uno.css'
const i18n = createI18n(i18nOptions)
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
