import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
// 引入 pinia store 用于获取 token
// import { useUserStore } from '@/stores/user';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量读取 baseURL[reference:22]
  timeout: 10000, // 请求超时时间[reference:23]
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截器[reference:24]
service.interceptors.request.use(
  (config) => {
    // const userStore = useUserStore();
    // if (userStore.token) {
    //   config.headers.Authorization = `Bearer ${userStore.token}`; // 携带 token[reference:25]
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器[reference:26]
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 假设后端统一返回格式为：{ code: number, message: string, data: any }[reference:27]
    if (res.code !== 200) {
      // 处理业务错误，例如 token 过期
      if (res.code === 401) {
        // 跳转到登录页
      }
      Message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res; // 直接返回 res，方便获取 data
  },
  (error) => {
    // 处理 HTTP 错误
    Message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
