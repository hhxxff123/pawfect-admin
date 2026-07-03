import axios, { type AxiosInstance } from 'axios';
import { Message } from '@arco-design/web-vue';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// ===== 请求拦截器 =====
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== 响应拦截器 =====
service.interceptors.response.use(
  (response) => {
    // ✅ 关键：必须返回 response
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    let message = '网络异常，请稍后重试';
    if (data?.message) message = data.message;
    else if (data?.msg) message = data.msg;
    else if (error.message) message = error.message;

    Message.error(message);
    return Promise.reject(new Error(message));
  }
);

export default service;