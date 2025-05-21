// src/lang/locales.ts
const messages = {}

// 动态导入所有语言文件
const languageFiles: Record<string, { default: Record<string, string> }> = import.meta.glob('@/lang/locales/*.ts', { eager: true })

for (const path in languageFiles) {
  // 从文件名中提取语言代码
  const langCodeMatch = path.match(/\/([^/]+)\.ts$/)
  if (!langCodeMatch) continue
  const langCode = langCodeMatch[1]
  messages[langCode] = languageFiles?.[path]?.default
}

const il8nOptions = {
    locale: 'en',
    fallbackLocale: 'en',
    messages,
    legacy: false,
    globalInjection: true,
}

export default il8nOptions
