import axios, { type AxiosRequestConfig } from 'axios'

interface RequestOptions extends AxiosRequestConfig {
  loading?: boolean // 是否显示 loading
}

class RequestService {
  private instance

  constructor(config: AxiosRequestConfig) {
    // 创建 axios 实例并合并配置
    this.instance = axios.create({
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config, // 允许覆盖默认配置
    })

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        config.headers['mova-auth'] = `bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpc3N1ZXIiLCJhdWQiOlsiYXVkaWVuY2UiXSwicm9sZV9uYW1lIjoiZ3Vlc3QiLCJvYXV0aF9pZCI6IjE5MjA3NjI4NDc4NzExNDgwMzQiLCJ0b2tlbl90eXBlIjoiYWNjZXNzX3Rva2VuIiwiY2xpZW50X2lkIjoic3dvcmQiLCJleHAiOjE3NDczODYyMzgsIm5iZiI6MTc0Njc4MTQzOH0.fcVJrdP6P2XaDLPs5RY9qQhTWa6Q9UaoXaxfn-l9ywCcHcM2bYWG9fI3AYmFDZsjs9OL1XpkGdNRUNx19wfsag`
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        console.log('Loading end') // 结束 loading
        return response
      },
      (error) => {
        console.error('Error:', error.response?.data?.message || error.message)
        return Promise.reject(error)
      },
    )
  }

  // GET 请求
  get<T>(
    url: string,
    params: Record<string, unknown> = {},
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>({ url, method: 'GET', params, ...options })
  }

  // POST 请求
  post<T>(
    url: string,
    data: Record<string, unknown> = {},
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>({ url, method: 'POST', data, ...options })
  }

  // 通用请求方法
  private request<T>(config: RequestOptions): Promise<T> {
    return this.instance.request(config).then((res) => res.data as T)
  }
}

// 创建不同服务的实例
const cmsService = new RequestService({
  baseURL: import.meta.env.MODE === 'production' ? '/kitchen/offlinedevice/' : import.meta.env.MODE === 'uat' ? '/api/' : '/',
})

const userService = new RequestService({
  baseURL: import.meta.env.MODE === 'production' ? '/kitchen/offlinedevice/' : import.meta.env.MODE === 'uat' ? '/' : '/',
  timeout: 30000, // 自定义超时时间
  headers: {
    'X-Custom-Header': 'value', // 自定义 headers
  },
})

export { cmsService, userService }

