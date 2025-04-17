import en from './en';
import zh from './zh';


const messages = {
    en,
    'zh-CN': zh,
};

const i18nOptions = {
    locale: 'en',
    fallbackLocale: 'en',
    messages,
    legacy: false, // Use Composition API
};

export default i18nOptions;