// url加http前缀
export const getUrlConcat = (url: string) => {
  if (!url) {
    return ''
  }
  if (url.startsWith('http')) return url
  return `${window.location.protocol}//${url}`
}
