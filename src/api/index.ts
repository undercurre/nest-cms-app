import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

interface RequestOptions extends AxiosRequestConfig {
  loading?: boolean // 是否显示 loading
}

class Request {
  private instance = axios.create({
    baseURL: 'http://172.27.36.208:80', //替换为你的基础 URL
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  constructor() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
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
    return this.instance.request<T, AxiosResponse<T>>(config).then((res) => res.data)
  }
}

const request = new Request()
export default request
