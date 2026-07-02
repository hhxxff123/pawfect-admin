import request from '@/utils/request';

// 定义请求和响应的数据类型
export interface LoginParams {
  phone: string;
  password: string;
}

export interface RegisterParams {
  phone: string;
  password: string;
  nickname?: string;
}

export interface UserInfo {
  id: number;
  phone: string;
  nickname: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    user: UserInfo;
    token: string;
  };
}

// 登录接口
export const loginApi = (data: LoginParams) => {
  return request.post<any, LoginResponse>('/api/auth/login', data);
};

// 注册接口
export const registerApi = (data: RegisterParams) => {
  return request.post('/api/auth/register', data);
};
