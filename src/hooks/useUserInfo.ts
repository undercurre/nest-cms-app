import { useUserInfoStore } from '@/stores/userInfo'
import Fingerprint2 from 'fingerprintjs2' // 引入fingerprintjs2
export const useUserInfo = () => {
  const userInfoStore = useUserInfoStore()
  const createdFingerprint = () => {
    // 您不应在页面加载时或加载后直接运行指纹。 而是使用setTimeout或requestIdleCallback将其延迟几毫秒，以确保指纹一致。
    if (typeof window.requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        createFingerprint()
      })
    } else {
      setTimeout(() => {
        createFingerprint()
      }, 500)
    }
  }
  // 创建浏览器指纹
  const createFingerprint = () => {
    // 选择哪些信息作为浏览器指纹生成的依据
    const options = {
      // fonts: {
      // 	extendedJsFonts: true,
      // },
      excludes: {
        //排除,获取不到的数据,影响设备唯一性的标识
        //获取不到
        deviceMemory: true, //设备内存
        fontsFlash: true, //已安装的Flash字体列表
        enumerateDevices: true, //可用的多媒体输入和输出设备的信息。
        doNotTrack: true, //do-not-track设置
        cpuClass: true, //浏览器系统的CPU等级
        //影响设备唯一指纹
        timezoneOffset: true, //本地时间与 GMT 时间之间的时间差，以分钟为单位
        timezone: true, //时区
        fonts: true, //使用JS/CSS检测到的字体列表
        language: true, //语言
        plugins: true, //浏览器的插件信息
        adBlock: true, //广告屏蔽工具
        screenResolution: true, //屏幕分辨率
      },
    }
    return new Promise((resolve, reject) => {
      // 浏览器指纹
      // const fingerprint = Fingerprint2.get((components) => { // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
      try {
        const fingerprint = Fingerprint2.get(options, (components) => {
          // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
          const values = components.map((component) => component.value) // 配置的值的数组
          const murmur = Fingerprint2.x64hash128(values.join(''), 31) // 生成浏览器指纹
          // console.log("参数caddf45fc23104f9d17f3ef82af1df6c", options);
          // console.log("回调caddf45fc23104f9d17f3ef82af1df6c", components);
          // console.log("配置530e10f8a53a5f7f1022087b41b5ef27的值的数组", values);
          console.log('生成浏览器指纹', murmur)
          userInfoStore.id = murmur
          userInfoStore.name = murmur?.slice(0, 8)
          resolve(murmur)
        })
        console.log('fingerprint: ', fingerprint)
      } catch (error) {
        reject(error)
      }
    })
  }
  return {
    createdFingerprint,
  }
}
