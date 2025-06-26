// url加http前缀
export const getUrlConcat = (url: string) => {
  if (!url) {
    return ''
  }
  if (url.startsWith('http')) return url
  return `${window.location.protocol}//${url}`
}

// 判断元素是否部分在视口中（更常用的方法）
export function isElementPartiallyInViewport(el) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.bottom > 0 &&
    rect.right > 0
  )
}
export function isAllEnglish(text) {
  // 匹配所有非a-zA-Z的字符
  return !/[^a-zA-Z]/.test(text)
}
