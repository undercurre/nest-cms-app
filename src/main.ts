import './assets/main.css'

import i18nOptions from '@/lang/locales'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import 'virtual:uno.css'
import 'vant/es/toast/style'
const i18n = createI18n(i18nOptions)
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
